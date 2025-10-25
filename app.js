if(process.env.NODE_ENV!= "production"){
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ejs = require("ejs");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRoutes= require("./routes/listings.js");
const reviewsRoutes= require("./routes/reviews.js");
const userRoutes = require("./routes/user.js");
const bookingRoutes = require("./routes/bookings");
const adminRoutes = require("./routes/admin.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MongoStore = require('connect-mongo');
const Listing = require("./models/listings.js");
const { isAdmin } = require("./middleware.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
// Serve uploaded files (multer dest: uploads/)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URL,
  crypto:{
    secret: process.env.SECRET  
  },
  touchAfter: 24 * 3600 // time period in seconds
});
store.on("error", function(e){
  console.log("SESSION STORE ERROR", e);
});
const sessionOptions = {
    store: store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    // secure: true, // Uncomment this line when using HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7// 1 week
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  // some templates expect `user` variable; provide an alias for compatibility
  res.locals.user = req.user;
  next();
});
const connectOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // More time for Windows DNS
  heartbeatFrequencyMS: 5000,
  family: 4,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
};


// Database URL (allow fallback to local MongoDB for development)
const DB_URL = process.env.ATLASDB_URL || process.env.DB_URL || 'mongodb://127.0.0.1:27017/tripnest';

async function main() {
  // Optional TLS/SSL relaxation for development troubleshooting only.
  // WARNING: do NOT enable in production. Set MONGO_INSECURE=true to allow invalid TLS certs when testing.
  const insecureTls = (process.env.MONGO_INSECURE === 'true');
  const connectOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Shorten server selection so failures surface quickly during dev
    serverSelectionTimeoutMS: 10000,
    // Prefer IPv4 which can avoid some SRV/DNS/TLS edge-cases on Windows networks
    family: 4,
    // Spread extra TLS options if debugging
    ...(insecureTls ? { tlsAllowInvalidCertificates: true, tlsAllowInvalidHostnames: true } : {})
  };
  await mongoose.connect(DB_URL, connectOpts);
}

main()
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected');
});

// Mount reviews first so nested routes are matched correctly and use :id to match controller expectations
app.use("/listings/:id/reviews", reviewsRoutes);
app.use("/listings", listingsRoutes);
app.use('/', userRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

// Redirect root URL to /listings so the site landing page shows listings
app.get('/', (req, res) => {
  return res.redirect('/listings');
});

// Catch-all for unmatched routes — use app.use to avoid path-to-regexp parsing issues
app.use((req, res, next) => {
  next(new ExpressError(`Page Not Found: ${req.originalUrl}`, 404));
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Something went wrong';
  // Log only server errors (500+) to reduce noise for client errors like 404
  if (statusCode >= 500) {
    console.error(err);
  } else {
    // For non-server errors, log a concise message (optional)
    console.warn(`HTTP ${statusCode}: ${message}`);
  }
  // Only expose stack traces in non-production environments for server errors
  const exposeError = (process.env.NODE_ENV !== 'production') && statusCode >= 500;
  res.status(statusCode).render('error', { statusCode, message, err: exposeError ? err : null });
});



// bookingRoutes mounted earlier with other route modules

app.listen(8080, () => {
  console.log("Server started on port 8080");
});