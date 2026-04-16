export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  occasion: string;
  rating: number;
  reviews: number;
  badge?: string;
  description: string;
  recipientType: string;
}

export const products: Product[] = [
  { id: 1, name: "Luxury Scented Candle Set", price: 49.99, originalPrice: 69.99, image: "https://images.unsplash.com/photo-1602607616605-3695c2011476?w=400&h=400&fit=crop", category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.8, reviews: 234, badge: "Best Seller", description: "Hand-poured soy candles in elegant glass jars with notes of vanilla, rose, and sandalwood.", recipientType: "Her" },
  { id: 2, name: "Premium Leather Wallet", price: 89.99, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop", category: "Gifts for Him", occasion: "Birthday", rating: 4.7, reviews: 189, badge: "Trending", description: "Handcrafted Italian leather bifold wallet with RFID protection.", recipientType: "Him" },
  { id: 3, name: "Personalized Photo Frame", price: 34.99, originalPrice: 44.99, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop", category: "Birthday Gifts", occasion: "Birthday", rating: 4.6, reviews: 156, description: "Custom engraved wooden photo frame for your cherished memories.", recipientType: "Anyone" },
  { id: 4, name: "Gourmet Chocolate Box", price: 59.99, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop", category: "Corporate Gifts", occasion: "Corporate", rating: 4.9, reviews: 312, badge: "Best Seller", description: "Artisan Belgian chocolates in a premium gift box, 24 pieces.", recipientType: "Anyone" },
  { id: 5, name: "Rose Gold Jewelry Set", price: 129.99, originalPrice: 179.99, image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6f5?w=400&h=400&fit=crop", category: "Gifts for Her", occasion: "Anniversary", rating: 4.8, reviews: 267, badge: "Trending", description: "Elegant rose gold necklace and earring set with cubic zirconia.", recipientType: "Her" },
  { id: 6, name: "Kids Art & Craft Kit", price: 29.99, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop", category: "Kids Gifts", occasion: "Birthday", rating: 4.5, reviews: 143, description: "150-piece art kit with crayons, markers, paints, and more.", recipientType: "Kids" },
  { id: 7, name: "Spa Gift Basket", price: 79.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop", category: "Gifts for Her", occasion: "Birthday", rating: 4.7, reviews: 198, badge: "Popular", description: "Lavender-infused bath bombs, body butter, and essential oils.", recipientType: "Her" },
  { id: 8, name: "Whiskey Decanter Set", price: 109.99, image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&h=400&fit=crop", category: "Gifts for Him", occasion: "Birthday", rating: 4.6, reviews: 175, description: "Crystal glass decanter with 4 matching whiskey glasses.", recipientType: "Him" },
  { id: 9, name: "Custom Star Map Print", price: 44.99, image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&h=400&fit=crop", category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.9, reviews: 421, badge: "Best Seller", description: "Beautiful star map showing the night sky from any date and location.", recipientType: "Anyone" },
  { id: 10, name: "Executive Pen Set", price: 64.99, image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=400&fit=crop", category: "Corporate Gifts", occasion: "Corporate", rating: 4.4, reviews: 92, description: "Premium ballpoint and fountain pen set in a wooden display case.", recipientType: "Anyone" },
  { id: 11, name: "Plush Teddy Bear Bundle", price: 39.99, originalPrice: 54.99, image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&h=400&fit=crop", category: "Kids Gifts", occasion: "Birthday", rating: 4.8, reviews: 286, badge: "Popular", description: "Giant 24-inch teddy bear with a matching baby blanket.", recipientType: "Kids" },
  { id: 12, name: "Couple's Cooking Class Kit", price: 74.99, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop", category: "Anniversary Gifts", occasion: "Anniversary", rating: 4.7, reviews: 134, description: "Complete Italian cooking kit with recipe cards and premium ingredients.", recipientType: "Anyone" },
];

export const categories = [
  { name: "Birthday Gifts", slug: "birthday-gifts" },
  { name: "Anniversary Gifts", slug: "anniversary-gifts" },
  { name: "Gifts for Him", slug: "gifts-for-him" },
  { name: "Gifts for Her", slug: "gifts-for-her" },
  { name: "Kids Gifts", slug: "kids-gifts" },
  { name: "Corporate Gifts", slug: "corporate-gifts" },
];
