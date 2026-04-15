#!/usr/bin/env node
/**
 * FarmBid WhatsApp Automation Utility (Merged Stable Edition)
 * Uses whatsapp-web.js with Puppeteer – enhanced for crash resistance and full business logic.
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// ========== MOCK APIs / DB MODELS ==========
let Listing, FarmerModel;
let verifyAadhaar, verifyOTP, verifyUPI, createListing;

try {
  // Try to load real models if available
  Listing = require('../models/Listing');
  FarmerModel = require('../models/Farmer');
} catch (err) {
  // console.warn('[WhatsApp] MongoDB models not available');
}

try {
  const mocks = require('./mockAPIs');
  verifyAadhaar = mocks.verifyAadhaar;
  verifyOTP = mocks.verifyOTP;
  verifyUPI = mocks.verifyUPI;
  createListing = mocks.createListing;
} catch (err) {
  console.error('[WhatsApp] CRITICAL: mockAPIs.js missing');
}

// ========== CONFIGURATION ==========
const sessionPath = process.env.WHATSAPP_SESSION_PATH
  ? path.resolve(process.cwd(), process.env.WHATSAPP_SESSION_PATH)
  : path.resolve(__dirname, '../.wwebjs_auth');

const uploadDir = path.resolve(process.cwd(), 'uploads/listings');
const PENDING_FILE = path.join(sessionPath, 'pending_messages.json');

// ========== IN-MEMORY STORES ==========
const farmerStore = new Map();
const listingStore = new Map();
const pendingWhatsAppMessages = [];

// ========== HELPERS ==========
const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const normalizePhone = (phone) => {
  if (!phone) return null;
  const digits = phone.toString().replace(/[^0-9+]/g, '');
  return digits.startsWith('+') ? digits : `+${digits}`;
};

const formatPhone = (phone) => {
  if (!phone) return null;
  return phone.toString().replace(/^\+?([0-9]+)@.*$/, '$1');
};

const getWhatsAppId = (phone) => {
  const normalized = normalizePhone(phone);
  if (!normalized) throw new Error('Invalid phone');
  return `${normalized.replace('+', '')}@c.us`;
};

const hashAadhaar = (aadhaar) => crypto.createHash('sha256').update(aadhaar).digest('hex');

// ========== PUPPETEER CONFIG ==========
const getBrowserExecutable = () => {
  const paths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser'
  ];
  for (const p of paths) {
    if (p && fs.existsSync(p)) return p;
  }
  return null;
};

const puppeteerOptions = {
  headless: process.env.WHATSAPP_HEADLESS !== 'false',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  executablePath: getBrowserExecutable()
};

// ========== CLIENT STATE ==========
let client = null;
let clientReady = false;
let lastQr = null;
let lastAuthFailure = null;
let isInitializing = false;

const initClient = async () => {
  if (isInitializing) return;
  isInitializing = true;
  
  if (client) {
    try { await client.destroy(); } catch (e) {}
  }

  client = new Client({
    authStrategy: new LocalAuth({ clientId: 'farmbid-whatsapp', dataPath: sessionPath }),
    puppeteer: puppeteerOptions,
    restartOnAuthFail: true,
    authTimeoutMs: 60000
  });

  client.on('qr', (qr) => {
    lastQr = qr;
    console.log('\n📱 WhatsApp QR Code generated. Scan to connect:\n');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    clientReady = true;
    isInitializing = false;
    console.log('✅ WhatsApp client ready!');
  });

  client.on('auth_failure', (msg) => {
    clientReady = false;
    lastAuthFailure = msg;
    isInitializing = false;
    console.error('❌ WhatsApp Auth failure:', msg);
  });

  client.on('disconnected', () => {
    clientReady = false;
    isInitializing = false;
    console.warn('⚠️ WhatsApp disconnected. Retrying in 10s...');
    setTimeout(initClient, 10000);
  });

  client.on('message', async (msg) => {
    if (!clientReady || msg.from.endsWith('@g.us')) return;
    try {
      await handleFarmerMessage(msg);
    } catch (err) {
      console.error('[WhatsApp] Handler error:', err);
    }
  });

  try {
    await client.initialize();
  } catch (err) {
    console.error('[WhatsApp] Initialize error:', err);
    isInitializing = false;
    setTimeout(initClient, 15000);
  }
};

// ========== BUSINESS LOGC ==========
const getOrCreateFarmer = (phone) => {
  const normalized = normalizePhone(phone);
  let farmer = farmerStore.get(normalized);
  if (!farmer) {
    farmer = { phone: normalized, state: 0, tempListing: {}, trustScore: 0 };
    farmerStore.set(normalized, farmer);
  }
  return farmer;
};

const buildRegisteredMenu = (name) => {
  return `Menu for ${name}:\n1. Create listing\n2. View active\n3. Trust score`;
};

const handleFarmerMessage = async (msg) => {
  const phone = formatPhone(msg.from);
  const farmer = getOrCreateFarmer(phone);
  const body = msg.body?.trim() || '';
  const lower = body.toLowerCase();

  const sendReply = (text) => text && msg.reply(text);

  // Registration Flow
  if (farmer.state === 0) {
    if (lower === 'yes' || lower === 'y') {
      farmer.state = 1;
      return sendReply('Please send your 12-digit Aadhaar number.');
    }
    return sendReply('Welcome to FarmBid! Are you a farmer? Reply YES to register.');
  }

  if (farmer.state === 1) {
    if (/^\d{12}$/.test(body)) {
      const result = await verifyAadhaar(body);
      if (result.success) {
        farmer.aadhaar = hashAadhaar(body);
        farmer.name = result.name;
        farmer.state = 2;
        return sendReply(`Verified ${result.name}. Send 6-digit OTP.`);
      }
      return sendReply('Invalid Aadhaar. Try again.');
    }
    return sendReply('Send 12 digits.');
  }

  if (farmer.state === 2) {
    if (/^\d{6}$/.test(body)) {
      const result = await verifyOTP(phone, body);
      if (result.success) {
        farmer.state = 3;
        return sendReply('Verified! Send your UPI ID (e.g. name@upi).');
      }
      return sendReply('Wrong OTP.');
    }
    return sendReply('Send 6 digits.');
  }

  if (farmer.state === 3) {
    if (body.includes('@')) {
      const result = await verifyUPI(body);
      if (result.success) {
        farmer.upiId = body;
        farmer.trustScore = 100;
        farmer.state = 4;
        return sendReply(`Registered! ${buildRegisteredMenu(farmer.name)}`);
      }
      return sendReply('UPI failed.');
    }
    return sendReply('Invalid UPI.');
  }

  // Main Menu & Listing Flow
  if (farmer.state === 4) {
    if (lower === '1') {
      farmer.state = 5;
      farmer.listingStep = 'photo';
      return sendReply('Send a photo of produce.');
    }
    if (lower === '2') return sendReply('You have no active listings.');
    if (lower === '3') return sendReply(`Score: ${farmer.trustScore}`);
    return sendReply(buildRegisteredMenu(farmer.name));
  }

  if (farmer.state === 5) {
    if (farmer.listingStep === 'photo') {
      if (msg.hasMedia) {
        farmer.listingStep = 'weight';
        return sendReply('Photo OK! Send weight in kg.');
      }
      return sendReply('Send a photo.');
    }
    if (farmer.listingStep === 'weight') {
      farmer.tempListing.weight = body;
      farmer.listingStep = 'price';
      return sendReply('Send min price per kg.');
    }
    if (farmer.listingStep === 'price') {
      farmer.tempListing.price = body;
      farmer.state = 4;
      const res = await createListing({ phone, weight: farmer.tempListing.weight, price: body });
      return sendReply(`Listing LIVE! ID: ${res.listingId}`);
    }
  }
};

// ========== FUNCTIONS ==========
const sendMessage = async ({ to, body }) => {
  if (!clientReady) throw new Error('WhatsApp not ready');
  return client.sendMessage(getWhatsAppId(to), body);
};

// Start
ensureUploadDir();
initClient();

module.exports = {
  sendWhatsAppMessage: sendMessage,
  isReady: () => clientReady,
  getQrCode: () => lastQr,
  getAuthFailure: () => lastAuthFailure,
  notifyFarmerNewBid: (phone, amt) => sendMessage({ to: phone, body: `New bid: ₹${amt}` }),
  notifyFarmerDealLocked: (phone, id) => sendMessage({ to: phone, body: `Locked: ${id}` }),
  listingStore,
  farmerStore
};
