export interface Product {
  id: number;
  name: string;
  price: number; // INR
  originalPrice?: number; // INR
  image: string;
  category: string;
  occasion: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  recipientType: string;
}

// Reliable Unsplash images (using photo IDs known to resolve)
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=600&q=80`;

export const products: Product[] = [
  { id: 1, name: "Luxury Scented Candle Set", price: 1499, originalPrice: 2099, image: img("photo-1602607616605-3695c2011476"), category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.8, reviews: 234, badge: "Best Seller", description: "Hand-poured soy candles in elegant glass jars with notes of vanilla, rose, and sandalwood.", recipientType: "Her" },
  { id: 2, name: "Premium Leather Wallet", price: 2499, image: img("photo-1627123424574-724758594e93"), category: "Gifts for Him", occasion: "Birthday", rating: 4.7, reviews: 189, badge: "Trending", description: "Handcrafted Italian leather bifold wallet with RFID protection.", recipientType: "Him" },
  { id: 3, name: "Personalized Photo Frame", price: 899, originalPrice: 1299, image: img("photo-1513519245088-0e12902e35ca"), category: "Birthday Gifts", occasion: "Birthday", rating: 4.6, reviews: 156, description: "Custom engraved wooden photo frame for your cherished memories.", recipientType: "Anyone" },
  { id: 4, name: "Gourmet Chocolate Box", price: 1799, image: img("photo-1549007994-cb92caebd54b"), category: "Corporate Gifts", occasion: "Corporate", rating: 4.9, reviews: 312, badge: "Best Seller", description: "Artisan Belgian chocolates in a premium gift box, 24 pieces.", recipientType: "Anyone" },
  { id: 5, name: "Rose Gold Jewelry Set", price: 3499, originalPrice: 4999, image: img("photo-1515562141589-67f0d569b6f5"), category: "Gifts for Her", occasion: "Anniversary", rating: 4.8, reviews: 267, badge: "Trending", description: "Elegant rose gold necklace and earring set with cubic zirconia.", recipientType: "Her" },
  { id: 6, name: "Kids Art & Craft Kit", price: 799, image: img("photo-1513364776144-60967b0f800f"), category: "Kids Gifts", occasion: "Birthday", rating: 4.5, reviews: 143, description: "150-piece art kit with crayons, markers, paints, and more.", recipientType: "Kids" },
  { id: 7, name: "Spa Gift Basket", price: 2199, originalPrice: 2799, image: img("photo-1556228578-0d85b1a4d571"), category: "Gifts for Her", occasion: "Birthday", rating: 4.7, reviews: 198, badge: "Popular", description: "Lavender-infused bath bombs, body butter, and essential oils.", recipientType: "Her" },
  { id: 8, name: "Whiskey Decanter Set", price: 3299, image: img("photo-1569529465841-dfecdab7503b"), category: "Gifts for Him", occasion: "Birthday", rating: 4.6, reviews: 175, description: "Crystal glass decanter with 4 matching whiskey glasses.", recipientType: "Him" },
  { id: 9, name: "Custom Star Map Print", price: 1299, image: img("photo-1534447677768-be436bb09401"), category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.9, reviews: 421, badge: "Best Seller", description: "Beautiful star map showing the night sky from any date and location.", recipientType: "Anyone" },
  { id: 10, name: "Executive Pen Set", price: 1899, image: img("photo-1583485088034-697b5bc54ccd"), category: "Corporate Gifts", occasion: "Corporate", rating: 4.4, reviews: 92, description: "Premium ballpoint and fountain pen set in a wooden display case.", recipientType: "Anyone" },
  { id: 11, name: "Plush Teddy Bear Bundle", price: 1099, originalPrice: 1599, image: img("photo-1559715541-5daf8a0296d0"), category: "Kids Gifts", occasion: "Birthday", rating: 4.8, reviews: 286, badge: "Popular", description: "Giant 24-inch teddy bear with a matching baby blanket.", recipientType: "Kids" },
  { id: 12, name: "Couple's Cooking Class Kit", price: 2099, image: img("photo-1556909114-f6e7ad7d3136"), category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.7, reviews: 134, description: "Complete Italian cooking kit with recipe cards and premium ingredients.", recipientType: "Anyone" },

  // Newly added products
  { id: 13, name: "Designer Coffee Mug Set", price: 649, originalPrice: 999, image: img("photo-1514228742587-6b1558fcca3d"), category: "Birthday Gifts", occasion: "Birthday", rating: 4.5, reviews: 112, description: "Set of 4 ceramic mugs with elegant minimalist designs.", recipientType: "Anyone" },
  { id: 14, name: "Aromatherapy Diffuser", price: 1899, originalPrice: 2499, image: img("photo-1608571423902-eed4a5ad8108"), category: "Gifts for Her", occasion: "Birthday", rating: 4.7, reviews: 203, badge: "Trending", description: "Ultrasonic essential oil diffuser with 7 LED color modes.", recipientType: "Her" },
  { id: 15, name: "Smart Fitness Watch", price: 4499, originalPrice: 6999, image: img("photo-1523275335684-37898b6baf30"), category: "Gifts for Him", occasion: "Birthday", rating: 4.6, reviews: 478, badge: "Best Seller", description: "Activity tracker with heart-rate, SpO2 and 14-day battery life.", recipientType: "Him" },
  { id: 16, name: "Building Blocks Mega Set", price: 1499, image: img("photo-1558060370-d644479cb6f7"), category: "Kids Gifts", occasion: "Birthday", rating: 4.8, reviews: 321, description: "500-piece colorful building blocks for endless creativity.", recipientType: "Kids" },
  { id: 17, name: "Premium Tea Sampler", price: 999, originalPrice: 1399, image: img("photo-1576092768241-dec231879fc3"), category: "Corporate Gifts", occasion: "Corporate", rating: 4.6, reviews: 87, description: "Curated collection of 12 premium loose-leaf teas from around the world.", recipientType: "Anyone" },
  { id: 18, name: "Silk Scarf — Floral", price: 1299, image: img("photo-1601762603339-fd61e28b698a"), category: "Gifts for Her", occasion: "Anniversary", rating: 4.7, reviews: 156, description: "Luxurious 100% mulberry silk scarf with hand-rolled edges.", recipientType: "Her" },
  { id: 19, name: "Wireless Bluetooth Speaker", price: 2799, originalPrice: 3999, image: img("photo-1608043152269-423dbba4e7e1"), category: "Gifts for Him", occasion: "Birthday", rating: 4.5, reviews: 392, badge: "Popular", description: "Portable speaker with 360° sound and 24-hour playtime.", recipientType: "Him" },
  { id: 20, name: "Personalized Name Necklace", price: 1599, originalPrice: 2299, image: img("photo-1611652022419-a9419f74343d"), category: "Gifts for Her", occasion: "Anniversary", rating: 4.9, reviews: 528, badge: "Best Seller", description: "18K gold-plated custom name pendant on a delicate chain.", recipientType: "Her" },
  { id: 21, name: "Gourmet Cookie Tower", price: 1199, image: img("photo-1499636136210-6f4ee915583e"), category: "Birthday Gifts", occasion: "Birthday", rating: 4.6, reviews: 174, description: "Three-tier tower of freshly baked artisan cookies in assorted flavors.", recipientType: "Anyone" },
  { id: 22, name: "Polaroid Instant Camera", price: 5499, image: img("photo-1495121553079-4c61bcce1894"), category: "Birthday Gifts", occasion: "Birthday", rating: 4.7, reviews: 245, badge: "Trending", description: "Retro instant camera with auto flash and selfie mirror.", recipientType: "Anyone" },
  { id: 23, name: "Remote Control Race Car", price: 1799, originalPrice: 2499, image: img("photo-1594787318286-3d835c1d207f"), category: "Kids Gifts", occasion: "Birthday", rating: 4.5, reviews: 198, description: "High-speed RC car with rechargeable battery and LED lights.", recipientType: "Kids" },
  { id: 24, name: "Engraved Crystal Trophy", price: 2299, image: img("photo-1567427017947-545c5f8d16ad"), category: "Corporate Gifts", occasion: "Corporate", rating: 4.7, reviews: 64, description: "Customizable crystal award perfect for recognition and milestones.", recipientType: "Anyone" },
  { id: 25, name: "Couples' Photo Album", price: 1099, originalPrice: 1499, image: img("photo-1452860606245-08befc0ff44b"), category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.8, reviews: 192, description: "Premium leather-bound photo album with 100 slots and custom cover.", recipientType: "Anyone" },
  { id: 26, name: "Luxury Skincare Set", price: 3299, originalPrice: 4499, image: img("photo-1556228720-195a672e8a03"), category: "Gifts for Her", occasion: "Birthday", rating: 4.8, reviews: 367, badge: "Best Seller", description: "5-piece premium skincare regimen for radiant, youthful skin.", recipientType: "Her" },
  { id: 27, name: "Grooming Kit for Men", price: 1999, originalPrice: 2799, image: img("photo-1621607512214-68297480165e"), category: "Gifts for Him", occasion: "Birthday", rating: 4.6, reviews: 221, description: "Complete grooming set with beard oil, balm, comb, and scissors.", recipientType: "Him" },
  { id: 28, name: "Plush Storybook Bundle", price: 899, image: img("photo-1512820790803-83ca734da794"), category: "Kids Gifts", occasion: "Birthday", rating: 4.7, reviews: 152, description: "Set of 5 illustrated storybooks with a soft plush bookmark.", recipientType: "Kids" },
  { id: 29, name: "Champagne & Truffles Box", price: 4999, originalPrice: 6499, image: img("photo-1514362545857-3bc16c4c7d1b"), category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.9, reviews: 142, badge: "Trending", description: "Premium bubbly paired with hand-crafted dark chocolate truffles.", recipientType: "Anyone" },
  { id: 30, name: "Branded Notebook & Pen", price: 799, image: img("photo-1531346878377-a5be20888e57"), category: "Corporate Gifts", occasion: "Corporate", rating: 4.4, reviews: 76, description: "Hardcover ruled notebook paired with a sleek metal rollerball pen.", recipientType: "Anyone" },
];

export const categories = [
  { name: "Birthday Gifts", slug: "birthday-gifts" },
  { name: "Anniversary Gifts", slug: "anniversary-gifts" },
  { name: "Gifts for Him", slug: "gifts-for-him" },
  { name: "Gifts for Her", slug: "gifts-for-her" },
  { name: "Kids Gifts", slug: "kids-gifts" },
  { name: "Corporate Gifts", slug: "corporate-gifts" },
];
