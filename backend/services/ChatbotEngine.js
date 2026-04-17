const ChatSession = require('../models/ChatSession');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Listing = require('../models/Listing');
const messages = require('../utils/smsMessages');
const { verifyAadhaar, verifyUPI, createListing } = require('../utils/mockAPIs');
const { normalizeTo10Digits } = require('../utils/phoneUtils');
const aiService = require('./AIService');
const { downloadMedia, saveBase64Media } = require('../utils/mediaDownloader');

class ChatbotEngine {
  async processMessage(from, body, opts = {}) {
    const { mediaUrl, contentType, base64Media } = opts;
    const phoneKey = normalizeTo10Digits(from);

    // Initial parsing for normalization
    let tempText = body ? String(body).trim() : '';
    let tempNormalized = tempText.toLowerCase();

    // Voice-to-Text Normalization (Handling spoken responses)
    if (opts.source === 'voice') {
      if (tempNormalized.includes('one') || tempNormalized.includes('೧') || tempNormalized.includes('ಒಂದು')) body = '1';
      else if (tempNormalized.includes('two') || tempNormalized.includes('೨') || tempNormalized.includes('ಎರಡು')) body = '2';
      else if (tempNormalized.includes('three') || tempNormalized.includes('೩') || tempNormalized.includes('ಮೂರು')) body = '3';
      else if (tempNormalized.includes('confirm') || tempNormalized.includes('yes') || tempNormalized.includes('ಹೌದು')) body = 'yes';
      else if (tempNormalized.includes('cancel') || tempNormalized.includes('no') || tempNormalized.includes('ಬೇಡ')) body = 'no';
    }

    // Final text used for the state machine
    const text = body ? String(body).trim() : '';
    const normalizedText = text.toLowerCase();

    // Get or create session using normalized key
    let session = await ChatSession.findOne({ phoneNumber: phoneKey });
    if (!session) {
      session = new ChatSession({ phoneNumber: phoneKey });
    }

    const lang = session.language || 'en';
    let response = '';

    // Global Commands
    if (normalizedText === 'menu' || normalizedText === 'reset') {
      session.state = 'FARMER_MAIN'; // Default to menu
      session.tempData = {};
      await session.save();
      return messages[lang].farmer_menu;
    }

    // State Machine
    switch (session.state) {
      case 'START':
        session.state = 'SELECT_LANGUAGE';
        // Fall through if a choice was already made
        if (text === '1' || text === '2') {
          // Continue to SELECT_LANGUAGE
        } else {
          response = messages.en.welcome;
          break;
        }

      case 'SELECT_LANGUAGE':
        if (text === '1') {
          session.language = 'en';
          session.state = 'SELECT_ROLE';
          response = messages.en.select_role;
        } else if (text === '2') {
          session.language = 'kn';
          session.state = 'SELECT_ROLE';
          response = messages.kn.select_role;
        } else {
          response = messages.en.welcome;
        }
        break;

      case 'SELECT_ROLE':
        if (text === '1') {
          session.role = 'farmer';
          session.state = 'FARMER_MAIN';
          response = messages[session.language].farmer_menu;
        } else if (text === '2') {
          session.role = 'buyer';
          session.state = 'BUYER_MAIN';
          response = messages[session.language].buyer_menu;
        } else {
          response = messages[session.language].select_role;
        }
        break;

      case 'FARMER_MAIN':
        if (text === '1') {
          session.state = 'FARMER_REG_AADHAAR';
          response = messages[session.language].reg_aadhaar;
        } else if (text === '2') {
          session.state = 'FARMER_LISTING_CROP';
          response = messages[session.language].listing_crop;
        } else if (text === '3') {
          const listings = await Listing.find({ farmerPhone: from }).limit(3);
          if (listings.length > 0) {
            response = listings.map(l => `${l.produce}: ${l.quantity}${l.unit} - ₹${l.minPricePerKg}/kg`).join('\n');
          } else {
            response = "No active listings found.";
          }
          response += `\n\n${messages[session.language].farmer_menu}`;
        } else if (text.length > 15) {
          const parsed = await aiService.parseListing(text);
          if (parsed && parsed.produce) {
            session.tempData = { ...parsed };
            session.state = 'FARMER_QUICK_CONFIRM';
            response = messages[session.language].listing_confirm_ai
              .replace('{produce}', parsed.produce)
              .replace('{qty}', parsed.quantity)
              .replace('{unit}', parsed.unit || 'kg')
              .replace('{price}', parsed.price || '?')
              .replace('{loc}', parsed.location || '?');
          } else {
            response = messages[session.language].farmer_menu;
          }
        } else {
          response = messages[session.language].farmer_menu;
        }
        break;

      case 'FARMER_LISTING_CROP':
        session.tempData.produce = text;
        session.state = 'FARMER_LISTING_QUANTITY';
        response = messages[session.language].listing_quantity;
        break;

      case 'FARMER_LISTING_QUANTITY':
        if (!isNaN(text)) {
          session.tempData.quantity = parseFloat(text);
          session.state = 'FARMER_LISTING_PRICE';
          response = messages[session.language].listing_price;
        } else {
          response = messages[session.language].listing_quantity;
        }
        break;

      case 'FARMER_LISTING_PRICE':
        if (!isNaN(text)) {
          session.tempData.price = parseFloat(text);
          session.state = 'FARMER_LISTING_LOCATION';
          response = messages[session.language].listing_location;
        } else {
          response = messages[session.language].listing_price;
        }
        break;

      case 'FARMER_LISTING_LOCATION':
        session.tempData.location = text;
        session.state = 'FARMER_LISTING_PHOTO';
        response = messages[session.language].listing_photo;
        break;

      case 'FARMER_LISTING_PHOTO':
        const farmerRecord = await Farmer.findOne({ phone: from });
        if (!farmerRecord) {
          response = "Please register first!\n\n" + messages[session.language].farmer_menu;
          session.state = 'FARMER_MAIN';
        } else {
          const newListing = new Listing({
            farmerId: farmerRecord._id,
            farmerCode: farmerRecord.code,
            farmerName: farmerRecord.name,
            produce: session.tempData.produce,
            quantity: session.tempData.quantity,
            minPricePerKg: session.tempData.price,
            location: session.tempData.location,
            source: 'voice'
          });
          await newListing.save();
          response = messages[session.language].listing_success.replace('{id}', newListing._id.toString().slice(-6));
          response += "\n\n" + messages[session.language].farmer_menu;
          session.state = 'FARMER_MAIN';
          session.tempData = {};
        }
        break;

      case 'BUYER_MAIN':
        response = messages[session.language].buyer_menu;
        break;

      default:
        response = messages.en.welcome;
        session.state = 'SELECT_LANGUAGE';
    }

    session.lastSource = opts.source || 'whatsapp';
    session.lastMessageAt = Date.now();
    session.markModified('tempData');
    await session.save();
    return response;
  }
}

module.exports = new ChatbotEngine();
