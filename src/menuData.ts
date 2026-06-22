export interface MenuItem {
  id: string;
  name: string;
  marathiName: string;
  price: number;
  category: "thali" | "starters" | "biryani" | "breads" | "curry" | "dessert";
  description: string;
  isVegetarian: boolean;
  isPopular?: boolean;
  isUnlimited?: boolean;
  tags?: string[];
  imageUrl?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  relativeTime: string;
  isLocalGuide?: boolean;
  numReviews?: number;
  numPhotos?: number;
}

export const RESTAURANT_INFO = {
  name: "Rajkamal Mess and Restaurant",
  marathiName: "Rajkamal Dinner Kitchen",
  rating: 4.1,
  reviewCount: 942,
  priceRange: "₹1–200 per person",
  category: "Non Vegetarian & Vegetarian Restaurant",
  address: "KG Roy, Hanuman Mandir Rd, Dharampeth, Nagpur, Maharashtra 440010",
  plusCode: "43R7+VP Nagpur, Maharashtra",
  phone: "098901 28111",
  hours: "7:00 PM - 11:30 PM (Dinner) & 12:00 PM - 3:30 PM (Lunch)",
  status: "Opens at 7:00 PM",
  highlights: [
    "Dine-in",
    "Drive-through",
    "No-contact delivery",
    "Order online"
  ]
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "veg-thali-unlimited",
    name: "Veg Thali (Unlimited)",
    marathiName: "Unlimited Veg Thali Pack",
    price: 150,
    category: "thali",
    description: "Our signature and highly recommended daily comforting thali. Includes unlimited dry veg curry, delicious paneer gravy, homely dal, steamed basmati rice, hot chapatis, salad, and pickle.",
    isVegetarian: true,
    isPopular: true,
    isUnlimited: true,
    tags: ["Homely", "Unlimited", "Best Seller"],
    imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "regular-thali",
    name: "Regular Veg Thali",
    marathiName: "Regular Veg Thali Pack",
    price: 100,
    category: "thali",
    description: "Authentic homely daily meal including 1 seasonal veg block, dal curry, steamed white rice, 3 soft chapatis, salad, and special Nagpur pickle. (Limited portion)",
    isVegetarian: true,
    isUnlimited: false,
    tags: ["Pocket Friendly", "Homely"],
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "special-thali",
    name: "Special Veg Thali",
    marathiName: "Special Upgrade Veg Thali",
    price: 120,
    category: "thali",
    description: "An upgrade to our regular thali. Includes a special paneer/mushroom vegetable curry, dry vegetable mix, dal fry, choice selection of Basmati rice, 4 butter chapatis, papad, curd, sweet, and salad.",
    isVegetarian: true,
    isUnlimited: false,
    tags: ["Popular"],
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "egg-thali",
    name: "Egg Thali Special",
    marathiName: "Boiled Egg Saoji Thali",
    price: 130,
    category: "thali",
    description: "For egg lovers. Savory spicy Egg Curry (2 boiled eggs in spicy Saoji style gravy), dry jeera aloo, aromatic jeera rice, 4 freshly made hot chapatis, lemon, and onions.",
    isVegetarian: false,
    isPopular: true,
    tags: ["Saoji Special", "High Protein"],
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6073a6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chicken-thali",
    name: "Saoji Chicken Thali",
    marathiName: "Traditional Saoji Chicken Thali",
    price: 180,
    category: "thali",
    description: "Famous Nagpur style Saoji Chicken curry, cooked with intense spices. Served with chicken dry cooked style, spicy signature gravy, steamed rice, 4 handmade chapatis, and fresh salad.",
    isVegetarian: false,
    isPopular: true,
    tags: ["Nagpur Special", "Spicy"],
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chicken-biryani",
    name: "Dharampeth Special Chicken Biryani",
    marathiName: "Nagpury Style Chicken Biryani",
    price: 160,
    category: "biryani",
    description: "Flavorsome, marinated basmati rice layered with cooked chicken pieces in special Nagpur spices. Served with raita and thick spicy gravy.",
    isVegetarian: false,
    isPopular: true,
    tags: ["Aromatic", "Flavorsome"],
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "egg-biryani",
    name: "Spicy Egg Biryani",
    marathiName: "Spicy Egg Biryani Rice Pot",
    price: 130,
    category: "biryani",
    description: "Perfectly boiled eggs sauteed in authentic biryani masala and layered with rich saffron long-grain basmati rice. Accompanied by raita.",
    isVegetarian: false,
    isUnlimited: false,
    tags: ["Comforting"],
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "tandoori-chicken-quarter",
    name: "Tandoori Chicken Starter (Quarter)",
    marathiName: "Roasted Clay Oven Chicken",
    price: 120,
    category: "starters",
    description: "Fresh chicken leg/breast piece marinated in yogurt and hot Indian spices, roasted slowly in a clay hot tandoor. Served with green chutney and mint.",
    isVegetarian: false,
    tags: ["Clay Oven", "Juicy"],
    imageUrl: "https://images.unsplash.com/photo-1628294895950-9805365006ad?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "chicken-kabab",
    name: "Spicy Chicken Seekh Kebab",
    marathiName: "Spicy Grilled Chicken Kebab",
    price: 110,
    category: "starters",
    description: "Minced chicken seasoned with chopped coriander, onions, green chilies, and Saoji spices, skewered and flame grilled to perfection.",
    isVegetarian: false,
    tags: ["Smoky"],
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "paneer-masala-curry",
    name: "Saoji Paneer Masala",
    marathiName: "Spicy Ghee Paneer Masala",
    price: 120,
    category: "curry",
    description: "Cottage cheese (paneer) cubes simmered in our hot, oily, and highly aromatic Saoji style gravy. Packs a traditional spice punch.",
    isVegetarian: true,
    tags: ["Nagpur Special", "Spicy"],
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "dal-fry-comfort",
    name: "Dal Fry Tadka",
    marathiName: "Ghee Dal Fry Tadka",
    price: 70,
    category: "curry",
    description: "Creamy yellow mixed lentils cooked with onions, tomatoes, and tempered with cumin, golden garlic, and dried red red chilies in ghee.",
    isVegetarian: true,
    tags: ["Comfort Food", "Mild"],
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "tawa-chapati",
    name: "Soft Tawa Chapati",
    marathiName: "Homely Wheat Roti Flatbread",
    price: 10,
    category: "breads",
    description: "Freshly rolled whole wheat flatbread made on tawa, lightweight and homely. No-maida, highly comforting.",
    isVegetarian: true,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "butter-chapati",
    name: "Butter Chapati",
    marathiName: "Premium Ghee Wheat Flatbread",
    price: 12,
    category: "breads",
    description: "Soft fresh wheat chapati glazed with premium Amul butter for that authentic rich flavor.",
    isVegetarian: true,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "unlimited-sweet-gulab",
    name: "Gulab Jamun (2 Pcs)",
    marathiName: "Sweet Milk Dumpling Delicacy",
    price: 30,
    category: "dessert",
    description: "Deep-fried milk dumplings soaked in warm, fragrant cardamom and rose water sugar syrup.",
    isVegetarian: true,
    tags: ["Sweet", "Nagpur Local"],
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Nikhil Adhav",
    rating: 5,
    comment: "Best in Class. Best in Taste. Best in hospitality. Must try Unlimited Veg thali. Highly recommended!",
    relativeTime: "5 months ago",
    isLocalGuide: true,
    numReviews: 37,
    numPhotos: 67
  },
  {
    id: "rev-2",
    name: "Pranali Malkam",
    rating: 5,
    comment: "The mess food is honestly very comforting. The meals feel homely, the flavours are simple yet satisfying, and the quality is consistent every day. It’s the kind of food you can eat regularly without feeling heavy. Really appreciate the effort put into maintaining hygiene and taste.",
    relativeTime: "6 months ago",
    numReviews: 1
  },
  {
    id: "rev-3",
    name: "Think SocialMedia",
    rating: 5,
    comment: "Had a great takeaway experience at Rajkamal Mess & Biryani Centre. The menu is designed to give an absolute homely feel. Tasty gravies and very generous portions.",
    relativeTime: "2 weeks ago",
    isLocalGuide: true,
    numReviews: 35,
    numPhotos: 121
  },
  {
    id: "rev-4",
    name: "Dilip Deshmukh",
    rating: 4,
    comment: "Excellent value for money. Regular veg thali at just 100/- and special at 120/- is unmatched in Dharampeth. Staff handles a huge rush nicely, although there can be a 10 min wait on Sunday evenings.",
    relativeTime: "3 months ago",
    isLocalGuide: true,
    numReviews: 12
  },
  {
    id: "rev-5",
    name: "Anonymous Foodie",
    rating: 5,
    comment: "Unlimited food in Nagpur for ₹150 is gold. Love the Saoji style Chicken Thali and the comforting hot chapatis. Feels just like home.",
    relativeTime: "1 month ago"
  }
];
