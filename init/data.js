const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
  },
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
  },
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
  },
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
  },
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
  },
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
  },
  {
    title: "Historic Canal House",
    description:
      "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
  },
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description:
      "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
  },
  {
    title: "Historic Brownstone in Boston",
    description:
      "Step back in time in this elegant historic brownstone located in the heart of Boston.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Boston",
    country: "United States",
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
  },
  {
    title: "Mountain View Cabin in Banff",
    description:
      "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Banff",
    country: "Canada",
  },
  {
    title: "Art Deco Apartment in Miami",
    description:
      "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Miami",
    country: "United States",
  },
  {
    title: "Tropical Villa in Phuket",
    description:
      "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Phuket",
    country: "Thailand",
  },
  {
    title: "Historic Castle in Scotland",
    description:
      "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Scottish Highlands",
    country: "United Kingdom",
  },
  {
    title: "Desert Oasis in Dubai",
    description:
      "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 5000,
    location: "Dubai",
    country: "United Arab Emirates",
  },
  {
    title: "Rustic Log Cabin in Montana",
    description:
      "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1100,
    location: "Montana",
    country: "United States",
  },
  {
    title: "Beachfront Villa in Greece",
    description:
      "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Mykonos",
    country: "Greece",
  },
  {
    title: "Eco-Friendly Treehouse Retreat",
    description:
      "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 750,
    location: "Costa Rica",
    country: "Costa Rica",
  },
  {
    title: "Historic Cottage in Charleston",
    description:
      "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Charleston",
    country: "United States",
  },
  {
    title: "Modern Apartment in Tokyo",
    description:
      "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Tokyo",
    country: "Japan",
  },
  {
    title: "Lakefront Cabin in New Hampshire",
    description:
      "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New Hampshire",
    country: "United States",
  },
  {
    title: "Luxury Villa in the Maldives",
    description:
      "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 6000,
    location: "Maldives",
    country: "Maldives",
  },
  {
    title: "Ski Chalet in Aspen",
    description:
      "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Aspen",
    country: "United States",
  },
  {
    title: "Secluded Beach House in Costa Rica",
    description:
      "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Costa Rica",
    country: "Costa Rica",
  },
  // ======== BEACH & VILLA STAYS ========
  {
    title: "Luxury Beachfront Villa in Goa",
    description: "Experience the best of Goan luxury in this beachfront villa with private pool, tropical garden, and sunset views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=60"
    },
    price: 9500,
    location: "Goa",
    country: "India"
  },
  {
    title: "Modern Sea View Villa in Kochi",
    description: "Wake up to breathtaking views of the Arabian Sea in this elegant villa featuring modern amenities and coastal charm.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=60"
    },
    price: 8700,
    location: "Kochi",
    country: "India"
  },
  {
    title: "Private Pool Villa in Pondicherry",
    description: "A serene French-inspired villa with a private courtyard pool and airy verandas, minutes away from the beach.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1572120360610-d971b9c7989b?auto=format&fit=crop&w=1200&q=60"
    },
    price: 8800,
    location: "Pondicherry",
    country: "India"
  },
  {
    title: "Heritage Beach Mansion in Alibaug",
    description: "Live in colonial elegance at this heritage villa just a short ferry ride from Mumbai, surrounded by coconut groves.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=60"
    },
    price: 12500,
    location: "Alibaug",
    country: "India"
  },
  {
    title: "Tropical Garden Villa in Gokarna",
    description: "An eco-friendly villa nestled between the beach and lush forest — ideal for yoga retreats and relaxation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7200,
    location: "Gokarna",
    country: "India"
  },

  // ======== CITY APARTMENTS ========
  {
    title: "Skyline Apartment in Mumbai",
    description: "Modern high-rise apartment offering panoramic city views and luxury amenities near Marine Drive.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7800,
    location: "Mumbai",
    country: "India"
  },
  {
    title: "Urban Studio Flat in Bengaluru",
    description: "A stylish studio apartment in Indiranagar, perfect for business travelers and digital nomads.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=60"
    },
    price: 5200,
    location: "Bengaluru",
    country: "India"
  },
  {
    title: "Luxury Penthouse in Hyderabad",
    description: "An elegant penthouse with a rooftop lounge and skyline views in the heart of Banjara Hills.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=1200&q=60"
    },
    price: 9900,
    location: "Hyderabad",
    country: "India"
  },
  {
    title: "Designer Apartment in Pune",
    description: "Minimalist apartment in Koregaon Park featuring sleek interiors and a private balcony garden.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585154207-4e27a3a5d3b3?auto=format&fit=crop&w=1200&q=60"
    },
    price: 6100,
    location: "Pune",
    country: "India"
  },
  {
    title: "Luxury Heritage Flat in Kolkata",
    description: "Stay in a restored British-era flat featuring high ceilings, vintage decor, and old-world charm.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=1200&q=60"
    },
    price: 6800,
    location: "Kolkata",
    country: "India"
  },

  // ======== COTTAGES & MOUNTAIN HOMES ========
  {
    title: "Himalayan View Cottage in Manali",
    description: "Wake up to snow-capped mountain views from this cozy wooden cottage with a fireplace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590073242675-4c9b1b8b22b2?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7200,
    location: "Manali",
    country: "India"
  },
  {
    title: "Colonial Hill Cottage in Shimla",
    description: "A charming colonial cottage surrounded by deodar forests, offering the perfect hillside retreat.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=60"
    },
    price: 6500,
    location: "Shimla",
    country: "India"
  },
  {
    title: "Tea Estate Bungalow in Munnar",
    description: "Stay amidst emerald tea gardens in this British-style bungalow with panoramic valley views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590080875832-16db0d38c8a2?auto=format&fit=crop&w=1200&q=60"
    },
    price: 8400,
    location: "Munnar",
    country: "India"
  },
  {
    title: "Rustic Mountain Cabin in Darjeeling",
    description: "A quaint wooden cabin overlooking the Himalayas and tea plantations, ideal for a quiet escape.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585153893-96c9ad05a0b1?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7800,
    location: "Darjeeling",
    country: "India"
  },
  {
    title: "Eco Cottage in Coorg",
    description: "An eco-sustainable cottage surrounded by coffee plantations, perfect for couples and families.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=60"
    },
    price: 5900,
    location: "Coorg",
    country: "India"
  },

  // ======== TREEHOUSES & ECO RETREATS ========
  {
    title: "Luxury Treehouse in Wayanad",
    description: "Experience treetop living with breathtaking rainforest views and luxurious comfort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571513721928-4204570b1e8d?auto=format&fit=crop&w=1200&q=60"
    },
    price: 8200,
    location: "Wayanad",
    country: "India"
  },
  {
    title: "Jungle Treehouse in Jim Corbett",
    description: "Stay in the wild in this beautifully designed treehouse, offering adventure and tranquility.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7600,
    location: "Jim Corbett National Park",
    country: "India"
  },
  {
    title: "Bamboo Treehouse in Meghalaya",
    description: "A unique bamboo-crafted treehouse perched above lush valleys and waterfalls.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585152915-1d6719b27b7d?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7100,
    location: "Shillong",
    country: "India"
  },
  {
    title: "Forest Retreat Treehouse in Lonavala",
    description: "Reconnect with nature in this serene treehouse overlooking the Sahyadri hills.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=60"
    },
    price: 6400,
    location: "Lonavala",
    country: "India"
  },
  {
    title: "Sky Nest Treehouse in Matheran",
    description: "Suspended among tall trees, this sky nest treehouse offers a cozy romantic stay.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1599423300743-c0a55bdc5e36?auto=format&fit=crop&w=1200&q=60"
    },
    price: 6900,
    location: "Matheran",
    country: "India"
  },

  // ======== HOUSEBOATS & HOMESTAYS ========
  {
    title: "Traditional Houseboat in Alleppey",
    description: "Cruise through Kerala’s backwaters aboard this luxurious traditional houseboat with chef and staff.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586864387967-d02ef85d93b3?auto=format&fit=crop&w=1200&q=60"
    },
    price: 8800,
    location: "Alleppey",
    country: "India"
  },
  {
    title: "Luxury Houseboat in Srinagar",
    description: "Experience Kashmiri hospitality on Dal Lake in a handcrafted wooden houseboat with scenic views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1577938928178-5e3a2fbbfcd0?auto=format&fit=crop&w=1200&q=60"
    },
    price: 9000,
    location: "Srinagar",
    country: "India"
  },
  {
    title: "Riverside Homestay in Rishikesh",
    description: "A peaceful homestay by the Ganges, perfect for yoga, meditation, and scenic walks.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585152908-4e66f3d5afcd?auto=format&fit=crop&w=1200&q=60"
    },
    price: 4800,
    location: "Rishikesh",
    country: "India"
  },
  {
    title: "Farmhouse Homestay in Nashik",
    description: "Stay amid vineyards and mango orchards in this rustic yet comfortable farmhouse.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=60"
    },
    price: 5500,
    location: "Nashik",
    country: "India"
  },
  {
    title: "Desert Haveli Homestay in Jaisalmer",
    description: "Live like royalty in this sandstone haveli with traditional Rajasthani décor and rooftop views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590073242675-4c9b1b8b22b2?auto=format&fit=crop&w=1200&q=60"
    },
    price: 7700,
    location: "Jaisalmer",
    country: "India"
  },
  {
    title: "Heritage Homestay in Jaipur",
    description: "A 19th-century restored haveli featuring marble courtyards and royal Rajasthani interiors.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578898887932-34005ccbb586?auto=format&fit=crop&w=1200&q=60"
    },
    price: 8300,
    location: "Jaipur",
    country: "India"
  }
];

module.exports = { data: sampleListings };