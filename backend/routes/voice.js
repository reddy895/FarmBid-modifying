const express = require('express');
const router = express.Router();
const chatbotEngine = require('../services/ChatbotEngine');
const ChatSession = require('../models/ChatSession');
const { normalizeTo10Digits } = require('../utils/phoneUtils');

/**
 * Handle incoming voice calls (Twilio/Exotel Webhook)
 * Supports both POST and GET
 */
router.all('/incoming', async (req, res) => {
  const from = req.body.From || req.query.From;
  const callSid = req.body.CallSid || req.query.CallSid;

  console.log(`[Voice] Incoming call from ${from}`);

  // Welcome message
  // Using <Gather input="dtmf speech"> to allow both dial pad and voice
  // We set method="POST" for subsequent steps as supported by TwiML/Exotel
  let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="dtmf speech" numDigits="1" action="/api/voice/process" method="POST" language="kn-IN" speechTimeout="auto">
        <Say language="kn-IN">ಫಾರ್ಮ್‌ಬಿಡ್‌ಗೆ ಸ್ವಾಗತ. ಇಂಗ್ಲಿಷ್‌ಗಾಗಿ ಒಂದು ಅಥವಾ ಕನ್ನಡಕ್ಕಾಗಿ ಎರಡನ್ನು ಒತ್ತಿರಿ.</Say>
        <Say language="en-IN">Welcome to FarmBid. Press 1 for English or 2 for Kannada.</Say>
    </Gather>
</Response>`;

  res.type('text/xml');
  res.send(twiml);
});

/**
 * Process speech or digits input
 * Supports both POST and GET
 */
router.all('/process', async (req, res) => {
  const from = req.body.From || req.query.From;
  const digits = req.body.Digits || req.query.Digits;
  const speechResult = req.body.SpeechResult || req.query.SpeechResult;
  
  // Normalized input (prefer Digits if available, then Speech)
  const userInput = digits || speechResult || '';
  
  console.log(`[Voice] Input from ${from}: "${userInput}" (Type: ${digits ? 'DTMF' : 'Speech'})`);

  if (!userInput) {
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather input="dtmf speech" numDigits="1" action="/api/voice/process" method="POST" language="kn-IN">
        <Say language="kn-IN">ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಇನ್ನೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.</Say>
    </Gather>
</Response>`;
    return res.type('text/xml').send(twiml);
  }

  try {
    // Check current session state to see if we should say "Sari" (Okay)
    const phoneKey = normalizeTo10Digits(from);
    const session = await ChatSession.findOne({ phoneNumber: phoneKey });
    
    // Logic: If they are in the "Listing Crop" state and they spoke the answer, say "Sari"
    let prefix = '';
    if (session && session.state === 'FARMER_LISTING_CROP' && speechResult) {
      prefix = 'ಸರಿ. '; // "Sari." in Kannada
    }

    // Process through the engine
    const reply = await chatbotEngine.processMessage(from, userInput, { source: 'voice' });

    // Build the response TwiML
    // We determine if we need Speech or DTMF based on the next state
    // But for simplicity, we always allow both hybrid-style
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="kn-IN">${prefix}${reply}</Say>
    <Gather input="dtmf speech" numDigits="1" action="/api/voice/process" method="POST" language="kn-IN" speechTimeout="auto">
        <!-- Waiting for next response -->
    </Gather>
</Response>`;

    res.type('text/xml');
    res.send(twiml);
  } catch (err) {
    console.error('[Voice] Processing error:', err);
    res.type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="kn-IN">ಕ್ಷಮಿಸಿ, ತಾಂತ್ರಿಕ ತೊಂದರೆ. ನಂತರ ಪ್ರಯತ್ನಿಸಿ.</Say>
    <Hangup/>
</Response>`);
  }
});

module.exports = router;
