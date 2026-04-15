const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

async function checkListings() {
  try {
    // Connect to database
    const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/farmbid_db';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');

    const total = await Listing.countDocuments();
    console.log('Total listings:', total);

    const active = await Listing.countDocuments({ status: { $in: ['live', 'ending_soon'] } });
    console.log('Active auctions:', active);

    const ended = await Listing.countDocuments({ status: 'ended' });
    console.log('Ended auctions:', ended);

    const cancelled = await Listing.countDocuments({ status: 'cancelled' });
    console.log('Cancelled auctions:', cancelled);

    // Show some sample listings
    const samples = await Listing.find({}).limit(3).select('produce status auctionEndsAt createdAt');
    console.log('\nSample listings:');
    samples.forEach(listing => {
      console.log(`- ${listing.produce}: ${listing.status} (ends: ${listing.auctionEndsAt})`);
    });

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkListings();