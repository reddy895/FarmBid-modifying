const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

async function resetAuctionTimers() {
  try {
    // Connect to database
    const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017/farmbid_db';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB');

    // Calculate new auction end time (24 hours from now)
    const newAuctionEndsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update all auctions (including ended ones) to reset their timers
    const result = await Listing.updateMany(
      {
        status: { $in: ['live', 'ending_soon', 'ended'] }
      },
      {
        $set: {
          auctionEndsAt: newAuctionEndsAt,
          status: 'live' // Reset status to live since we're extending time
        }
      }
    );

    console.log(`✅ Reset auction timers for ${result.modifiedCount} listings`);
    console.log(`📅 New auction end time: ${newAuctionEndsAt.toISOString()}`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error resetting auction timers:', error);
    process.exit(1);
  }
}

// Run the script
resetAuctionTimers();