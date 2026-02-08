if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const Booking = require('../models/booking');
const Listing = require('../models/listings');
const User = require('../models/user');
const { webhookHandler } = require('../controllers/stripe');

// Mock request and response
const mockReq = (body) => ({
    body,
    headers: {}
});

const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.send = (msg) => {
        res.body = msg;
        return res;
    };
    res.json = (data) => {
        res.body = data;
        return res;
    };
    return res;
};

async function main() {
    if (!process.env.ATLASDB_URL) {
        console.error('ATLASDB_URL environment variable is required.');
        process.exit(1);
    }

    await mongoose.connect(process.env.ATLASDB_URL);
    console.log('Connected to DB');

    try {
        // 1. Setup: Find a listing and user
        const listing = await Listing.findOne();
        const user = await User.findOne();

        if (!listing || !user) {
            console.error('Need at least one listing and one user to test.');
            process.exit(1);
        }

        console.log(`Testing with Listing: ${listing.title} (${listing._id})`);

        // 2. Setup: Define booking details
        const checkIn = new Date('2025-12-10');
        const checkOut = new Date('2025-12-15');

        // Ensure cleanup of any previous test run artifacts
        await Booking.deleteMany({ listing: listing._id, checkIn: checkIn });

        // 3. Action: Simulate TWO concurrent Webhook events for the same dates
        delete process.env.STRIPE_WEBHOOK_SECRET;

        const eventBody = {
            type: 'checkout.session.completed',
            data: {
                object: {
                    amount_total: 20000,
                    metadata: {
                        listingId: listing._id.toString(),
                        userId: user._id.toString(),
                        checkIn: checkIn.toISOString(),
                        checkOut: checkOut.toISOString(),
                        guests: '2'
                    }
                }
            }
        };

        console.log('Simulating TWO concurrent overlapping webhooks...');

        // Create two separate request/response pairs
        const req1 = mockReq(eventBody);
        const res1 = mockRes();
        const req2 = mockReq(eventBody);
        const res2 = mockRes();

        // Fire them in parallel
        await Promise.all([
            webhookHandler(req1, res1),
            webhookHandler(req2, res2)
        ]);

        // 4. Verification
        const bookings = await Booking.find({
            listing: listing._id,
            checkIn: checkIn
        });

        console.log(`Found ${bookings.length} booking(s) for these dates.`);

        if (bookings.length === 1) {
            console.log('SUCCESS: Race condition handled! Only ONE booking was created despite concurrent requests.');
        } else if (bookings.length > 1) {
            console.error(`FAILURE: ${bookings.length} bookings created. Race condition occurred.`);
        } else {
            console.error('FAILURE: No bookings created? Something else went wrong.');
        }

        // Cleanup
        if (bookings.length > 0) {
            await Booking.deleteMany({ listing: listing._id, checkIn: checkIn });
        }
        console.log('Cleanup complete.');

    } catch (err) {
        console.error('Test failed with error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main();
