TripNest — Stay Booking Platform

TripNest is a full-stack stay booking platform that allows users to explore properties, check availability, and make secure online bookings. The system is designed with production-level architecture, focusing on scalability, performance, security, and real-time updates.

🚀 Features
Core Functionality

Browse and search property listings

View detailed property pages with images and reviews

User authentication (Signup/Login)

Role-based access control (User / Owner)

Create and manage property listings

Book stays with date availability checks

Secure online payments using Stripe

Image uploads via Cloudinary

⚡ Performance & Scalability

Redis Caching

Cache-aside pattern for listings and property details

Dynamic cache keys for filtered searches

TTL for automatic expiration

Smart cache invalidation on create/update/delete/booking

Pagination

Server-side pagination (8 listings per page)

Reduces response time and memory usage

Database Optimization

MongoDB indexes on:

location

country

title

price

Prevents full collection scans and improves query performance

🔒 Security

Password hashing using bcrypt

Password strength validation

Session-based authentication with Passport.js

Layered Rate Limiting

Global API protection

Strict limits for login/signup

Booking endpoint protection

Secure environment configuration

Stripe webhook signature verification

🧠 Concurrency Control (Production-Level)

To prevent double bookings during simultaneous payments:

Pre-booking availability check

MongoDB transactions

Listing-level write lock to serialize booking operations

Ensures only one booking succeeds for the same dates

🔄 Real-Time Updates

Implemented Socket.io

When a booking is confirmed:

Availability updates instantly for other users

Users see a notification and refreshed calendar

📊 Monitoring & Error Handling

Structured request logging:

Method, route, status, response time

Centralized error handling middleware

Stack traces logged internally

User-friendly error pages

🏗️ Tech Stack

Backend

Node.js

Express.js

MongoDB + Mongoose

Redis (Upstash / TCP)

Socket.io

Stripe API

Passport.js

bcrypt

Frontend

EJS

Bootstrap

JavaScript

Media

Cloudinary

Deployment

Render

📦 Installation
1. Clone the repository
git clone https://github.com/your-username/tripnest.git
cd tripnest

2. Install dependencies
npm install

3. Create .env file
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

REDIS_URL= (optional)
UPSTASH_REDIS_REST_URL= (optional)
UPSTASH_REDIS_REST_TOKEN= (optional)


Redis is optional.
If not configured, the app automatically falls back to MongoDB.

4. Run the application
npm start


App runs at:

http://localhost:3000

🧪 Testing Concurrency

A script is provided to simulate simultaneous booking attempts:

scripts/verifyConcurrency.js


This confirms that double bookings are prevented.

📈 System Design Highlights

Cache-aside architecture

Event-driven real-time updates

Transaction-based consistency

Horizontal scaling ready (Redis-backed rate limiting possible)

Production-grade error handling and logging
