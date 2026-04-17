const axios = require('axios');

async function testFinalVoiceFlow() {
  const PORT = 3001;
  const BASE_URL = `http://localhost:${PORT}/api/voice`;
  // Use a random phone number for every test run to avoid session overlaps
  const TEST_PHONE = '+91' + Math.floor(1000000000 + Math.random() * 9000000000);

  console.log(`--- Testing Final Voice AI Agent [Phone: ${TEST_PHONE}] ---`);

  try {
    // 1. Incoming Call
    const welcome = await axios.post(`${BASE_URL}/incoming`, { From: TEST_PHONE });
    console.log('\n[1] Welcome Prompt Correct?');
    console.log(welcome.data.includes('ಫಾರ್ಮ್‌ಬಿಡ್‌ಗೆ ಸ್ವಾಗತ') ? '✅ Yes' : '❌ No');

    // 2. Select Kannada (Digit 2)
    const selectLang = await axios.post(`${BASE_URL}/process`, { From: TEST_PHONE, Digits: '2' });
    console.log('\n[2] Select Kannada (2) -> Role Menu Prompted?');
    console.log(selectLang.data.includes('ನೀವು:') ? '✅ Yes' : '❌ No');

    // 3. Select Farmer (Digit 1)
    const selectRole = await axios.post(`${BASE_URL}/process`, { From: TEST_PHONE, Digits: '1' });
    console.log('\n[3] Select Farmer (1) -> Farmer Menu Prompted?');
    console.log(selectRole.data.includes('ರೈತರ ಮೆನು') ? '✅ Yes' : '❌ No');

    // 4. Create Listing (Digit 2)
    const createListing = await axios.post(`${BASE_URL}/process`, { From: TEST_PHONE, Digits: '2' });
    console.log('\n[4] Create Listing (2) -> Crop Input Prompted?');
    console.log(createListing.data.includes('ಯಾವ ಬೆಳೆಯನ್ನು') ? '✅ Yes' : '❌ No');

    // 5. Speak "Akki" (Rice)
    const speakCrop = await axios.post(`${BASE_URL}/process`, {
      From: TEST_PHONE,
      SpeechResult: 'ಅಕ್ಕಿ',
      Confidence: 0.99
    });
    console.log('\n[5] Speak Crop ("ಅಕ್ಕಿ") -> "Sari" Acknowledgement present?');
    if (speakCrop.data.includes('ಸರಿ.')) {
        console.log('✅ Success: Bot said "Sari"!');
    } else {
        console.log('❌ Failure: Bot missing "Sari" acknowledgment.');
    }

    console.log('\n--- Final Test Complete ---');
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

testFinalVoiceFlow();
