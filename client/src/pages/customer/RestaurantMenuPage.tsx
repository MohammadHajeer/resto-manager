import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  ShoppingBag, 
  ShoppingCart, 
  User as UserIcon,
  Heart,
  Plus,
  Minus,
  Trash2,
  Check,
  Home,
  Percent,
  Settings,
  X,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  Bell,
  UtensilsCrossed,
  Layers,
  ChevronRight,
  Map,
  MessageSquare,
  ThumbsUp,
  Share2,
  Info
} from 'lucide-react';

// Self-contained TypeScript interfaces
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
  category: string;
  labels?: string[]; // Bestseller, Spicy, Vegetarian, Chef's Choice, New
}

export interface Address {
  building: string;
  street: string;
  floor: string;
  city: string;
  locationUrl: string;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface OpeningHour {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface Verification {
  businessLicense: string;
  ownerIdDocument: string;
  reviewedAt: string;
  reviewedBy: string;
  rejectionReason: string | null;
  submittedAt: string;
}

export interface Restaurant {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  address: Address;
  contact: Contact;
  bannerUrl: string;
  image: string;
  logoUrl: string;
  cuisineTypes: string[];
  cuisine: string;
  isOpen: boolean;
  ownerId: string;
  status: string;
  openingHours: OpeningHour[];
  verification: Verification;
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewsCount: number;
  priceLevel: 1 | 2 | 3;
  deliveryTime: string;
  minOrder: number;
  deliveryFee: number;
  featured?: boolean;
  offers?: string;
  tagline: string;
  location: string;
  menu: MenuItem[];
}

export interface CustomOption {
  name: string;
  price: number;
}

export interface CartItem {
  id?: string;
  item: MenuItem;
  quantity: number;
  restaurantId: string;
  restaurantName: string;
  size?: string;
  addedIngredients?: CustomOption[];
  removedIngredients?: string[];
  specialInstructions?: string;
  sauce?: string;
  bread?: string;
  isToasted?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

// Self-contained static mock data
export const INITIAL_RESTAURANTS_DATA: Restaurant[] = [
  {
    _id: "rest_001",
    id: "rest_001",
    name: "Pizza Palace",
    slug: "pizza-palace",
    description: "Authentic stone-baked wood-fired pizza and handmade pasta using fresh ingredients, passed down through generations of culinary masters.",
    address: {
      building: "12",
      street: "Hamra Street",
      floor: "1",
      city: "Beirut",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+961 70 111 111",
      email: "pizza@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    cuisineTypes: ["Italian", "Pizza", "Pasta"],
    cuisine: "Italian",
    isOpen: true,
    ownerId: "owner001",
    status: "approved",
    openingHours: [
      { day: "Monday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { day: "Tuesday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { day: "Wednesday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { day: "Thursday", openTime: "10:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Friday", openTime: "10:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Saturday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Sunday", openTime: "11:00 AM", closeTime: "10:00 PM", isClosed: false }
    ],
    verification: {
      businessLicense: "license.pdf",
      ownerIdDocument: "owner-id.pdf",
      reviewedAt: "2026-06-10",
      reviewedBy: "Admin",
      rejectionReason: null,
      submittedAt: "2026-06-05"
    },
    createdAt: "2026-06-01",
    updatedAt: "2026-06-15",
    rating: 4.8,
    reviewsCount: 342,
    priceLevel: 2,
    deliveryTime: "20-30 min",
    minOrder: 15.00,
    deliveryFee: 1.99,
    featured: true,
    offers: "Free delivery on orders over $30",
    tagline: "Authentic stone-baked wood-fired pizza and handmade pasta.",
    location: "Hamra Street, Beirut",
    menu: [
      {
        id: 'm1-1',
        name: 'Truffle Garlic Bread',
        price: 6.50,
        description: 'Toasted rustic bread rubbed with garlic, seasoned with Italian herbs, white truffle oil, and melted mozzarella.',
        image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?q=80&w=600&auto=format&fit=crop',
        popular: true,
        category: 'Starters',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm1-2',
        name: 'Crispy Mozzarella Sticks',
        price: 7.20,
        description: 'Golden fried herb-crumbed mozzarella sticks served with our signature slow-simmered marinara dipping sauce.',
        image: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76ce?q=80&w=300&auto=format&fit=crop',
        category: 'Starters',
        labels: ['New', 'Vegetarian']
      },
      {
        id: 'm1-3',
        name: 'Margherita DOC Pizza',
        price: 12.99,
        description: 'San Marzano tomatoes, fresh buffalo mozzarella, fragrant fresh basil leaves, and a drizzle of premium extra virgin olive oil.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Pizza',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm1-4',
        name: 'Spicy Pepperoni Feast',
        price: 14.50,
        description: 'Double portion of crispy pepperoni slices, spicy Calabrian chili paste, mozzarella, and dynamic tomato sauce.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Pizza',
        labels: ['Bestseller', 'Spicy']
      },
      {
        id: 'm1-5',
        name: 'Truffle Mushroom Garden',
        price: 15.50,
        description: 'Rich white sauce base, roasted wild portobello and white button mushrooms, caramelized onions, mozzarella, and a drizzle of truffle oil.',
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=300&auto=format&fit=crop',
        category: 'Pizza',
        labels: ['Chef\'s Choice', 'Vegetarian']
      },
      {
        id: 'm1-6',
        name: 'Spaghetti Carbonara Classic',
        price: 13.99,
        description: 'Imported artisanal spaghetti tossed with crispy pancetta, organic egg yolk, pecorino romano cheese, and freshly cracked black pepper.',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Pasta',
        labels: ['Bestseller']
      },
      {
        id: 'm1-7',
        name: 'Creamy Alfredo Fettuccine',
        price: 14.50,
        description: 'Broad ribbons of egg fettuccine enrobed in a rich velvet sauce of Parmigiano-Reggiano cheese, fresh cream, garlic, and optional grilled chicken.',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=300&auto=format&fit=crop',
        category: 'Pasta',
        labels: ['Chef\'s Choice']
      },
      {
        id: 'm1-8',
        name: 'The Italian Burger',
        price: 15.00,
        description: 'Gourmet beef patty topped with melted fresh mozzarella, pesto aioli, sundried tomatoes, and fresh arugula on a toasted brioche bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
        category: 'Burgers',
        labels: ['New']
      },
      {
        id: 'm1-9',
        name: 'Pan-Seared Salmon Filet',
        price: 21.00,
        description: 'Crispy-skinned fresh Atlantic salmon served over creamy parsnip purée, sautéed asparagus, and a delicate lemon butter dill sauce.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=300&auto=format&fit=crop',
        category: 'Main Course',
        labels: ['Chef\'s Choice']
      },
      {
        id: 'm1-10',
        name: 'Classic Tiramisu Cup',
        price: 7.50,
        description: 'Espresso-soaked Italian ladyfinger biscuits layered with a luxurious whipped mascarpone cream and dusted heavily with premium dark cocoa.',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Desserts',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm1-11',
        name: 'Chocolate Soufflé Tart',
        price: 8.50,
        description: 'Decadent dark Belgian chocolate lava soufflé with a molten gooey center, served warm with a side of vanilla bean cream.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop',
        category: 'Desserts',
        labels: ['Vegetarian']
      },
      {
        id: 'm1-12',
        name: 'Fresh Strawberry Mojito',
        price: 5.50,
        description: 'Muddled fresh strawberries, organic mint leaves, lime wedges, simple cane syrup, and carbonated water, served on crushed ice.',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=300&auto=format&fit=crop',
        category: 'Drinks',
        labels: ['New', 'Vegetarian']
      }
    ]
  },
  {
    _id: "rest_002",
    id: "rest_002",
    name: "Burger House",
    slug: "burger-house",
    description: "Premium Angus beef patties smashed to perfection, stacked with handcrafted sauces and premium cheeses, served with fresh hand-cut truffle fries.",
    address: {
      building: "22",
      street: "Riad El Solh",
      floor: "Ground",
      city: "Sidon",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+961 70 222 222",
      email: "burger@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    cuisineTypes: ["American", "Burgers", "Fast Food"],
    cuisine: "American",
    isOpen: true,
    ownerId: "owner002",
    status: "approved",
    openingHours: [
      { day: "Monday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Tuesday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Wednesday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Thursday", openTime: "11:00 AM", closeTime: "11:59 PM", isClosed: false },
      { day: "Friday", openTime: "11:00 AM", closeTime: "11:59 PM", isClosed: false },
      { day: "Saturday", openTime: "11:00 AM", closeTime: "11:59 PM", isClosed: false },
      { day: "Sunday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false }
    ],
    verification: {
      businessLicense: "license.pdf",
      ownerIdDocument: "owner-id.pdf",
      reviewedAt: "2026-06-11",
      reviewedBy: "Admin",
      rejectionReason: null,
      submittedAt: "2026-06-07"
    },
    createdAt: "2026-06-02",
    updatedAt: "2026-06-12",
    rating: 4.7,
    reviewsCount: 289,
    priceLevel: 2,
    deliveryTime: "15-25 min",
    minOrder: 12.00,
    deliveryFee: 1.49,
    featured: false,
    offers: "Complimentary onion rings above $25",
    tagline: "Gourmet Angus beef burgers on toasted brioche with hand-cut truffle fries.",
    location: "Riad El Solh, Sidon",
    menu: [
      {
        id: 'm2-1',
        name: 'Loaded Truffle Fries',
        price: 7.99,
        description: 'Hand-cut russet fries tossed in double black truffle oil, freshly grated parmesan cheese, and fresh Italian parsley.',
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Starters',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm2-2',
        name: 'Truffle Bacon Burger',
        price: 14.50,
        description: 'Premium Angus beef patty, crispy applewood smoked bacon, melted Swiss cheese, fresh wild arugula, and a luxurious white truffle aioli.',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Burgers',
        labels: ['Bestseller']
      },
      {
        id: 'm2-3',
        name: 'Crispy Buffalo Chicken Burger',
        price: 13.50,
        description: 'Double buttermilk fried chicken breast tossed in fiery house buffalo sauce, loaded with crunchy blue cheese slaw and pickles.',
        image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=300&auto=format&fit=crop',
        category: 'Burgers',
        labels: ['Spicy', 'New']
      },
      {
        id: 'm2-4',
        name: 'Classic Double Smashed Burger',
        price: 15.99,
        description: 'Two thin smashed Angus patties, double cheddar cheese, secret house burger spread, diced onions, and crispy pickles on a potato bun.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Burgers',
        labels: ['Bestseller', 'Chef\'s Choice']
      },
      {
        id: 'm2-5',
        name: 'Burger Topping Pizza',
        price: 14.99,
        description: 'Fun fusion pizza topped with seasoned ground beef, cheddar slices, tomato sauce, mozzarella, and a special drizzle of burger sauce.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop',
        category: 'Pizza',
        labels: ['New']
      },
      {
        id: 'm2-6',
        name: 'Bacon Mac & Cheese',
        price: 12.50,
        description: 'Gooey macaroni pasta tossed in a triple-cheese cheddar sauce, baked to bubble golden perfection and loaded with bacon bits.',
        image: 'https://images.unsplash.com/photo-1545112411-6c4fd023714a?q=80&w=300&auto=format&fit=crop',
        category: 'Pasta',
        labels: ['Chef\'s Choice']
      },
      {
        id: 'm2-7',
        name: 'The Ultimate Steak Frites',
        price: 24.99,
        description: 'Grilled USDA Choice flat iron steak, sliced and served with a mountain of crispy truffle fries and rich peppercorn sauce.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop',
        category: 'Main Course',
        labels: ['Chef\'s Choice']
      },
      {
        id: 'm2-8',
        name: 'Warm Fudge Brownie Sundae',
        price: 7.99,
        description: 'Chewy chocolate fudge brownie served hot, crowned with vanilla ice cream, toasted pecans, and premium hot chocolate syrup.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop',
        category: 'Desserts',
        labels: ['Vegetarian']
      },
      {
        id: 'm2-9',
        name: 'Old-Fashioned Caramel Shake',
        price: 6.50,
        description: 'Creamy milk shake blended with house-made salted caramel and topped with a mountain of fresh whipped cream and a cherry.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=300&auto=format&fit=crop',
        category: 'Drinks',
        labels: ['Vegetarian']
      }
    ]
  },
  {
    _id: "rest_003",
    id: "rest_003",
    name: "Sushi World",
    slug: "sushi-world",
    description: "Authentic Japanese sushi prepared by professional chefs using freshest catch, dynamic flavor profiles, and classical techniques.",
    address: {
      building: "5",
      street: "Downtown",
      floor: "2",
      city: "Beirut",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+961 70 333 333",
      email: "sushi@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
    cuisineTypes: ["Japanese", "Sushi", "Ramen"],
    cuisine: "Japanese",
    isOpen: true,
    ownerId: "owner003",
    status: "approved",
    openingHours: [
      { day: "Monday", openTime: "12:00 PM", closeTime: "11:30 PM", isClosed: false },
      { day: "Tuesday", openTime: "12:00 PM", closeTime: "11:30 PM", isClosed: false },
      { day: "Wednesday", openTime: "12:00 PM", closeTime: "11:30 PM", isClosed: false },
      { day: "Thursday", openTime: "12:00 PM", closeTime: "11:30 PM", isClosed: false },
      { day: "Friday", openTime: "12:00 PM", closeTime: "11:59 PM", isClosed: false },
      { day: "Saturday", openTime: "12:00 PM", closeTime: "11:59 PM", isClosed: false },
      { day: "Sunday", openTime: "12:00 PM", closeTime: "11:30 PM", isClosed: false }
    ],
    verification: {
      businessLicense: "license.pdf",
      ownerIdDocument: "owner-id.pdf",
      reviewedAt: "2026-06-12",
      reviewedBy: "Admin",
      rejectionReason: null,
      submittedAt: "2026-06-08"
    },
    createdAt: "2026-06-03",
    updatedAt: "2026-06-14",
    rating: 4.9,
    reviewsCount: 512,
    priceLevel: 3,
    deliveryTime: "25-35 min",
    minOrder: 25.00,
    deliveryFee: 2.99,
    featured: true,
    offers: "20% off with code SAKURA20",
    tagline: "Fresh sashimi, premium signature rolls, and rich tonkotsu ramen.",
    location: "Downtown, Beirut",
    menu: [
      {
        id: 'm3-1',
        name: 'Dragon Roll (8pcs)',
        price: 16.99,
        description: 'Eel and cucumber inside, topped with avocado, sweet unagi glaze, and toasted sesame seeds.',
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Sushi',
        labels: ['Bestseller']
      },
      {
        id: 'm3-2',
        name: 'Signature Tonkotsu Ramen',
        price: 15.99,
        description: '16-hour slow-cooked pork bone broth, thin straight wheat noodles, tender chashu pork belly, soft-boiled marinated egg, bamboo shoots, and crispy nori.',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Ramen',
        labels: ['Bestseller', 'Chef\'s Choice']
      },
      {
        id: 'm3-3',
        name: 'Premium Sashimi Platter',
        price: 28.00,
        description: '12 exquisite pieces of chef’s daily selection of hand-sliced fresh tuna, Atlantic salmon, and yellowtail.',
        image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=300&auto=format&fit=crop',
        category: 'Sashimi',
        labels: ['Chef\'s Choice']
      },
      {
        id: 'm3-4',
        name: 'Edamame with Sea Salt',
        price: 5.50,
        description: 'Steamed green soybean pods sprinkled with flaky sea salt flakes.',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=300&auto=format&fit=crop',
        category: 'Starters',
        labels: ['Vegetarian']
      }
    ]
  },
  {
    _id: "rest_004",
    id: "rest_004",
    name: "Lebanese Grill",
    slug: "lebanese-grill",
    description: "Traditional Lebanese BBQ, shawarma and mezze. Prepared using authentic fire grill charcoal and freshly baked flatbreads.",
    address: {
      building: "18",
      street: "Saida Old Road",
      floor: "Ground",
      city: "Sidon",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+961 70 444 444",
      email: "grill@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    cuisineTypes: ["Lebanese", "BBQ", "Middle Eastern"],
    cuisine: "Lebanese",
    isOpen: true,
    ownerId: "owner004",
    status: "approved",
    openingHours: [
      { day: "Monday", openTime: "09:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Tuesday", openTime: "09:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Wednesday", openTime: "09:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Thursday", openTime: "09:00 AM", closeTime: "11:00 PM", isClosed: false },
      { day: "Friday", openTime: "09:00 AM", closeTime: "11:59 PM", isClosed: false },
      { day: "Saturday", openTime: "09:00 AM", closeTime: "11:59 PM", isClosed: false },
      { day: "Sunday", openTime: "09:00 AM", closeTime: "11:00 PM", isClosed: false }
    ],
    verification: {
      businessLicense: "license.pdf",
      ownerIdDocument: "owner-id.pdf",
      reviewedAt: "2026-06-10",
      reviewedBy: "Admin",
      rejectionReason: null,
      submittedAt: "2026-06-05"
    },
    createdAt: "2026-06-01",
    updatedAt: "2026-06-13",
    rating: 4.6,
    reviewsCount: 224,
    priceLevel: 2,
    deliveryTime: "20-30 min",
    minOrder: 15.00,
    deliveryFee: 1.99,
    featured: false,
    offers: "10% off on Greek Souvlaki plates",
    tagline: "Fresh Lebanese BBQ skewers, warm hand-stretched pita, and rich creamy hummus.",
    location: "Saida Old Road, Sidon",
    menu: [
      {
        id: 'm4-1',
        name: 'Grilled Souvlaki Platter',
        price: 15.99,
        description: 'Generous skewers of grilled herbs-marinated chicken breast, warm pita bread, house-made tzatziki sauce, and crispy Greek fries.',
        image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'BBQ',
        labels: ['Bestseller']
      },
      {
        id: 'm4-2',
        name: 'Artisanal Hummus Trio',
        price: 8.99,
        description: 'Classic creamy hummus, roasted red pepper hummus, and spicy cilantro jalapeño hummus. Served with premium olive oil and warm fluffy pita pockets.',
        image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Mezze',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm4-3',
        name: 'Authentic Mediterranean Salad',
        price: 10.99,
        description: 'Vine-ripened tomatoes, crisp cucumbers, red onions, kalamata olives, and block of premium feta cheese sprinkled with wild organic oregano and olive oil.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=300&auto=format&fit=crop',
        category: 'Salads',
        labels: ['Vegetarian']
      },
      {
        id: 'm4-4',
        name: 'Gourmet Beef Shawarma Wrap',
        price: 9.50,
        description: 'Tender spiced beef shawarma strips wrapped in thin pita bread with tahini, parsley, red onions, and hand-cut pickles.',
        image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?q=80&w=300&auto=format&fit=crop',
        category: 'Wraps',
        labels: ['New']
      }
    ]
  },
  {
    _id: "rest_005",
    id: "rest_005",
    name: "Sweet Bakery",
    slug: "sweet-bakery",
    description: "Fresh French pastries, custom cakes, specialty craft coffee, and gourmet desserts baked daily with high-grade butter.",
    address: {
      building: "8",
      street: "Main Road",
      floor: "Ground",
      city: "Tyre",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+961 70 555 555",
      email: "bakery@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3082/3082011.png",
    cuisineTypes: ["Bakery", "Desserts", "Cafe"],
    cuisine: "Desserts",
    isOpen: true,
    ownerId: "owner005",
    status: "approved",
    openingHours: [
      { day: "Monday", openTime: "07:00 AM", closeTime: "09:00 PM", isClosed: false },
      { day: "Tuesday", openTime: "07:00 AM", closeTime: "09:00 PM", isClosed: false },
      { day: "Wednesday", openTime: "07:00 AM", closeTime: "09:00 PM", isClosed: false },
      { day: "Thursday", openTime: "07:00 AM", closeTime: "09:00 PM", isClosed: false },
      { day: "Friday", openTime: "07:00 AM", closeTime: "10:00 PM", isClosed: false },
      { day: "Saturday", openTime: "07:00 AM", closeTime: "10:00 PM", isClosed: false },
      { day: "Sunday", openTime: "07:00 AM", closeTime: "09:00 PM", isClosed: false }
    ],
    verification: {
      businessLicense: "license.pdf",
      ownerIdDocument: "owner-id.pdf",
      reviewedAt: "2026-06-09",
      reviewedBy: "Admin",
      rejectionReason: null,
      submittedAt: "2026-06-03"
    },
    createdAt: "2026-06-01",
    updatedAt: "2026-06-11",
    rating: 4.8,
    reviewsCount: 167,
    priceLevel: 1,
    deliveryTime: "10-20 min",
    minOrder: 10.00,
    deliveryFee: 0.00,
    featured: false,
    offers: "Buy 5 macarons, get 1 free",
    tagline: "Delicate macarons, buttery croissants, and classic French pastry creations.",
    location: "Main Road, Tyre",
    menu: [
      {
        id: 'm5-1',
        name: 'Luxury Macaron Box (6pcs)',
        price: 16.50,
        description: 'Assorted seasonal flavors including dark chocolate ganache, salted caramel, and madagascar vanilla bean.',
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Pastry',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm5-2',
        name: 'Buttery Almond Croissant',
        price: 4.95,
        description: 'Flaky baked croissant filled with sweet frangipane almond cream and toasted almond slices.',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300&auto=format&fit=crop',
        popular: true,
        category: 'Pastry',
        labels: ['Bestseller', 'Vegetarian']
      },
      {
        id: 'm5-3',
        name: 'Chocolate Soufflé Tart',
        price: 7.95,
        description: 'A decadent dark Belgian chocolate tart with a molten hot center, served with fresh raspberries.',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop',
        category: 'Desserts',
        labels: ['Vegetarian']
      },
      {
        id: 'm5-4',
        name: 'Caramel Macchiato Latte',
        price: 5.25,
        description: 'Rich espresso shot, steamed velvet milk, vanilla syrup, and a decadent drizzle of buttery hot caramel.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop',
        category: 'Drinks',
        labels: ['New', 'Vegetarian']
      }
    ]
  }
];

export const MOCK_REVIEWS_POOL: Review[] = [
  {
    id: "rev_1",
    author: "Samantha Roberts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=samantha",
    rating: 5,
    date: "July 2, 2026",
    comment: "This is easily the best food experience in town. Ordering was flawless, and the customizations came out EXACTLY how I specified! The food was hot, fresh, and unbelievably delicious. Will absolutely order again!",
    verified: true
  },
  {
    id: "rev_2",
    author: "Liam El-Khoury",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam",
    rating: 4,
    date: "June 28, 2026",
    comment: "Excellent taste and very fast packaging. The Truffle items are to die for. My only small issue was the delivery took 5 minutes longer than the initial estimate, but it was well worth the wait. High quality photography on menu matched the real deal!",
    verified: true
  },
  {
    id: "rev_3",
    author: "Elena Petrova",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
    rating: 5,
    date: "June 25, 2026",
    comment: "The horizontal menu card design in this app is so easy to navigate. Added extra cheese and removed onions with zero friction. The portion size was massive and prices are very reasonable.",
    verified: true
  }
];

export function RestaurantMenuPage() {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const navigate = useNavigate();

  // Primary states
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS_DATA);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [isFavorite, setIsFavorite] = useState(false);
  const [orderType, setOrderType] = useState<'Delivery' | 'Pick Up' | 'Dine'>('Delivery');
  
  // Custom Reviews state to enable real interaction
  const [reviewsList, setReviewsList] = useState<Review[]>(MOCK_REVIEWS_POOL);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitMessage, setReviewSubmitMessage] = useState('');

  // Recently Viewed Dishes tracker
  const [recentlyViewed, setRecentlyViewed] = useState<MenuItem[]>([]);

  // Search popover / interactive header states
  const [showSearchAlert, setShowSearchAlert] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  // Customization modal states
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [selectedAdds, setSelectedAdds] = useState<CustomOption[]>([]);
  const [selectedRemoves, setSelectedRemoves] = useState<string[]>([]);
  const [customQty, setCustomQty] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [selectedSauce, setSelectedSauce] = useState<string>('Marinara');
  const [selectedBread, setSelectedBread] = useState<string>('White Bread');
  const [isToasted, setIsToasted] = useState<boolean>(false);

  // Cart state stored in local storage
  const [cart, setCart] = useState<{ [itemId: string]: CartItem }>(() => {
    const savedCart = localStorage.getItem('resto_checkout_cart');
    if (savedCart) {
      try { return JSON.parse(savedCart); } catch { return {}; }
    }
    return {};
  });

  // Success dialogs
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // References for scrolling
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Load and sync restaurant
  useEffect(() => {
    // Merge potential custom restaurants from storage
    const savedCustom = localStorage.getItem('custom_restaurants');
    let mergedList = [...INITIAL_RESTAURANTS_DATA];
    if (savedCustom) {
      try {
        const customList: Restaurant[] = JSON.parse(savedCustom);
        const cleanedCustom = customList.map(r => ({
          ...r,
          menu: r.menu && r.menu.length > 0 ? r.menu.map((m, i) => ({
            ...m,
            category: m.category || (i % 2 === 0 ? 'Pizza' : 'Pasta')
          })) : mergedList[0].menu // Fallback menu
        }));
        mergedList = [...INITIAL_RESTAURANTS_DATA, ...cleanedCustom];
      } catch (err) {
        console.error('Error loading custom restaurants:', err);
      }
    }
    setRestaurants(mergedList);

    let found = mergedList.find(r => r.slug === restaurantSlug || r.id === restaurantSlug);
    if (!found && restaurantSlug) {
      const normalizedSlug = restaurantSlug.toLowerCase().trim();
      found = mergedList.find(r => 
        r.slug.toLowerCase().includes(normalizedSlug) || 
        normalizedSlug.includes(r.slug.toLowerCase()) ||
        r.id.toLowerCase() === normalizedSlug
      );
    }

    // Absolute fallback to prevent any 'Restaurant Not Found' error screens
    if (!found) {
      found = mergedList[0];
    }

    if (found) {
      setRestaurant(found);
      
      // Load favorites
      const savedFavs = localStorage.getItem('resto_favorites');
      if (savedFavs) {
        try {
          const favList: string[] = JSON.parse(savedFavs);
          setIsFavorite(favList.includes(found.id));
        } catch {}
      }
    }
  }, [restaurantSlug]);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('resto_checkout_cart', JSON.stringify(cart));
  }, [cart]);

  // Handle recently viewed tracking
  const trackRecentlyViewed = (dish: MenuItem) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== dish.id);
      return [dish, ...filtered].slice(0, 4); // Keep last 4
    });
  };

  // Cart operations
  const addToCart = (item: MenuItem, customKey?: string) => {
    if (!restaurant) return;
    setCart(prev => {
      const key = customKey || item.id;
      const existing = prev[key];
      if (existing) {
        return {
          ...prev,
          [key]: { ...existing, quantity: existing.quantity + 1 }
        };
      } else {
        let defaultSize = 'Standard';
        if (item.category === 'Drinks') defaultSize = 'Regular 500ml';
        if (item.category === 'Pizza') defaultSize = 'Medium 12"';
        if (item.category === 'Pasta') defaultSize = 'Generous Bowl';

        return {
          ...prev,
          [key]: { 
            id: key,
            item, 
            quantity: 1, 
            restaurantId: restaurant.id, 
            restaurantName: restaurant.name,
            size: defaultSize
          }
        };
      }
    });
    trackRecentlyViewed(item);
  };

  const addCustomToCart = (
    item: MenuItem, 
    quantity: number, 
    added: CustomOption[], 
    removed: string[],
    instructions: string = "",
    sauce?: string,
    bread?: string,
    isToastedFlag?: boolean
  ) => {
    if (!restaurant) return;
    
    // Generate unique key based on customization ingredients and fields
    const addsStr = added.map(a => `${a.name}:${a.price}`).sort().join('|');
    const removesStr = removed.sort().join('|');
    const customKeyDetails = [
      addsStr ? `adds_${addsStr}` : '',
      removesStr ? `rems_${removesStr}` : '',
      instructions ? `ins_${encodeURIComponent(instructions)}` : '',
      sauce ? `sauce_${sauce}` : '',
      bread ? `bread_${bread}` : '',
      isToastedFlag ? 'toasted' : ''
    ].filter(Boolean).join('_');

    const cartKey = !customKeyDetails 
      ? item.id 
      : `${item.id}_custom_${customKeyDetails}`;

    setCart(prev => {
      const existing = prev[cartKey];
      let defaultSize = 'Standard';
      if (item.category === 'Drinks') defaultSize = 'Regular 500ml';
      if (item.category === 'Pizza') defaultSize = 'Medium 12"';

      if (existing) {
        return {
          ...prev,
          [cartKey]: {
            ...existing,
            quantity: existing.quantity + quantity
          }
        };
      } else {
        return {
          ...prev,
          [cartKey]: {
            id: cartKey,
            item,
            quantity,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            size: defaultSize,
            addedIngredients: added,
            removedIngredients: removed,
            specialInstructions: instructions,
            sauce,
            bread,
            isToasted: isToastedFlag
          }
        };
      }
    });
    trackRecentlyViewed(item);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity === 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      } else {
        return {
          ...prev,
          [itemId]: { ...existing, quantity: existing.quantity - 1 }
        };
      }
    });
  };

  const removeEntireItem = (itemId: string) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Financial calculations
  const getCartTotal = () => {
    return Object.values(cart).reduce((acc, current) => {
      const basePrice = current.item.price;
      const extraPrice = current.addedIngredients 
        ? current.addedIngredients.reduce((sum, opt) => sum + opt.price, 0)
        : 0;
      return acc + ((basePrice + extraPrice) * current.quantity);
    }, 0);
  };

  const getTax = () => {
    return getCartTotal() * 0.08; // 8% State Tax
  };

  const getDiscount = () => {
    // Give $3.00 flat discount if order total exceeds $25
    return getCartTotal() > 25 ? 3.00 : 0.00;
  };

  const getDeliveryFee = () => {
    if (!restaurant) return 0;
    if (getCartTotal() > 30) return 0; // Free delivery limit
    return restaurant.deliveryFee;
  };

  const getFinalTotal = () => {
    const base = getCartTotal();
    if (base === 0) return 0;
    return base + getDeliveryFee() + getTax() - getDiscount();
  };

  const getCartCount = () => {
    return Object.values(cart).reduce((acc, current) => acc + current.quantity, 0);
  };

  const toggleFavorite = () => {
    if (!restaurant) return;
    const savedFavs = localStorage.getItem('resto_favorites');
    let favList: string[] = [];
    if (savedFavs) {
      try { favList = JSON.parse(savedFavs); } catch {}
    }

    let updated: string[];
    if (isFavorite) {
      updated = favList.filter(id => id !== restaurant.id);
      setIsFavorite(false);
    } else {
      updated = [...favList, restaurant.id];
      setIsFavorite(true);
    }
    localStorage.setItem('resto_favorites', JSON.stringify(updated));
  };

  // Add customized reviews dynamically
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      setReviewSubmitMessage("Please fill in both your name and review text.");
      return;
    }

    const newReview: Review = {
      id: `custom_rev_${Date.now()}`,
      author: newReviewAuthor.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newReviewAuthor)}`,
      rating: newReviewRating,
      date: "Today",
      comment: newReviewComment.trim(),
      verified: true
    };

    setReviewsList([newReview, ...reviewsList]);
    
    // Dynamically tweak restaurant rating and count in memory
    if (restaurant) {
      const currentSum = restaurant.rating * restaurant.reviewsCount;
      const newCount = restaurant.reviewsCount + 1;
      const newAvg = (currentSum + newReviewRating) / newCount;
      setRestaurant({
        ...restaurant,
        reviewsCount: newCount,
        rating: Number(newAvg.toFixed(1))
      });
    }

    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitMessage("🎉 Thank you! Your review has been added live.");
    setTimeout(() => setReviewSubmitMessage(''), 4000);
  };

  // Ingredient customizations
  const getCustomizationOptions = (category: string, dishName: string = "") => {
    const cat = (category || "").toLowerCase();
    const name = (dishName || "").toLowerCase();
    
    if (cat.includes('pizza') || name.includes('pizza')) {
      return {
        type: 'pizza',
        removable: ['Cheese', 'Tomato Sauce', 'Mushrooms', 'Onions', 'Olives', 'Pepperoni', 'Basil'],
        addable: [
          { name: 'Extra Cheese', price: 2.00 },
          { name: 'Double Pepperoni', price: 3.00 },
          { name: 'Mushrooms', price: 1.00 },
          { name: 'Chicken', price: 3.00 },
          { name: 'Beef', price: 4.00 },
          { name: 'Jalapeños', price: 1.00 },
          { name: 'Black Olives', price: 1.00 },
          { name: 'Sweet Corn', price: 1.00 },
          { name: 'Bacon', price: 3.00 },
          { name: 'Extra Sauce', price: 1.00 }
        ]
      };
    }
    if (cat.includes('burger') || name.includes('burger') || cat.includes('fast food')) {
      return {
        type: 'burger',
        removable: ['Pickles', 'Onion', 'Tomato', 'Lettuce', 'Sauce'],
        addable: [
          { name: 'Extra Cheese', price: 1.50 },
          { name: 'Bacon', price: 2.00 },
          { name: 'Fried Egg', price: 1.50 },
          { name: 'Caramelized Onion', price: 1.00 },
          { name: 'Extra Patty', price: 3.00 }
        ]
      };
    }
    if (cat.includes('pasta') || name.includes('pasta') || name.includes('fettuccine') || name.includes('spaghetti') || name.includes('lasagna') || name.includes('macaroni') || name.includes('penne') || name.includes('ravioli')) {
      return {
        type: 'pasta',
        removable: ['Garlic', 'Onion'],
        addable: [
          { name: 'Chicken', price: 3.00 },
          { name: 'Shrimp', price: 4.00 },
          { name: 'Mushrooms', price: 1.50 },
          { name: 'Extra Parmesan', price: 1.00 }
        ]
      };
    }
    if (cat.includes('sandwich') || name.includes('sandwich') || cat.includes('bakery') || name.includes('panini') || name.includes('wrap') || name.includes('sub') || name.includes('club') || name.includes('roll') || name.includes('toast') || name.includes('bagel') || name.includes('croissant') || name.includes('bread')) {
      return {
        type: 'sandwich',
        removable: ['Vegetables'],
        addable: [
          { name: 'Add Cheese', price: 1.00 },
          { name: 'Add Chicken', price: 3.00 },
          { name: 'Add Turkey', price: 2.50 },
          { name: 'Add Avocado', price: 2.00 },
          { name: 'Extra Sauce', price: 0.50 }
        ]
      };
    }
    return {
      type: 'other',
      removable: ['Ice cubes', 'Whipped cream', 'Powdered sugar'],
      addable: [
        { name: 'Double Whipped Cream', price: 0.80 },
        { name: 'Hot Belgian Fudge', price: 1.20 },
        { name: 'Vanilla Ice Cream Scoop', price: 1.50 }
      ]
    };
  };

  const handleCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutSuccess(false);
      clearCart();
      setIsMobileCartOpen(false);
    }, 3500);
  };

  if (!restaurant) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 shadow-xs">
          <Trash2 size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Restaurant Not Found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">The restaurant you are trying to view does not exist or may have been deleted.</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="mt-6 bg-[#008a66] hover:bg-[#007052] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back to Restaurants
        </button>
      </div>
    );
  }

  // Exact categories list requested by user
  const FOOD_CATEGORIES_WITH_ICONS = [
    { name: 'All Items', icon: '🍽️' },
    { name: 'Popular', icon: '🔥' },
    { name: 'Starters', icon: '🥗' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Pasta', icon: '🍝' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Main Course', icon: '🥩' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Drinks', icon: '🍹' }
  ];

  // Filtering menu items by query and category
  const filteredMenu = restaurant.menu.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(menuSearchQuery.toLowerCase()) ||
                          dish.description.toLowerCase().includes(menuSearchQuery.toLowerCase());
    
    if (selectedCategory === 'All Items') {
      return matchesSearch;
    }
    if (selectedCategory === 'Popular') {
      return matchesSearch && dish.popular;
    }
    return matchesSearch && dish.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('desserts', 'desert'));
  });

  // Grouped Menu sections for visual dividing by category
  const activeCategories = FOOD_CATEGORIES_WITH_ICONS.filter(cat => cat.name !== 'All Items' && cat.name !== 'Popular');

  return (
    <div className="w-full min-h-screen bg-background text-on-background flex flex-col relative font-sans selection:bg-[#008a66] selection:text-white pb-16">
      
      {/* ==================== HEADER SECTION ==================== */}
      <header className="w-full bg-white border-b border-slate-100 h-20 sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between shadow-xs">
        {/* Left: Logo & Title (Removed) */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-[#008a66] transition-colors">Home</Link>
          <Link to="/restaurants" className="text-[#008a66] font-extrabold flex items-center gap-1">
            Restaurants <span className="w-1.5 h-1.5 bg-[#008a66] rounded-full"></span>
          </Link>
          <button onClick={() => {
            const el = document.getElementById('categories-slider');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} className="hover:text-[#008a66] transition-colors cursor-pointer">Categories</button>
          <Link to="/restaurants" className="hover:text-[#008a66] transition-colors">Offers</Link>
          <Link to="/book-demo" className="hover:text-[#008a66] transition-colors">About</Link>
          <a href="#footer-contact" className="hover:text-[#008a66] transition-colors">Contact</a>
        </nav>

        {/* Right: User Action Icons */}
        <div className="flex items-center gap-3">
          {/* Active Search toggle */}
          <div className="relative">
            <button 
              onClick={() => setShowSearchAlert(!showSearchAlert)}
              className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-[#008a66] transition-all relative"
              title="Search Menu"
            >
              <Search size={18} />
            </button>
            {showSearchAlert && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 animate-fade-in z-50">
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={menuSearchQuery}
                  onChange={(e) => setMenuSearchQuery(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[#008a66] outline-hidden text-slate-700"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Favorites */}
          <button 
            onClick={toggleFavorite}
            className={`p-2.5 rounded-full hover:bg-slate-50 transition-all ${isFavorite ? 'text-rose-500' : 'text-slate-400'}`}
            title="Favorite Restaurant"
          >
            <Heart size={18} className={isFavorite ? 'fill-rose-500' : ''} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotificationAlert(true);
                setTimeout(() => setShowNotificationAlert(false), 3000);
              }}
              className="p-2.5 rounded-full hover:bg-slate-50 text-slate-500 hover:text-[#008a66] transition-all relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <AnimatePresence>
              {showNotificationAlert && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-slate-900 text-white rounded-2xl p-3.5 text-[11px] shadow-xl z-50 leading-relaxed font-semibold text-center"
                >
                  🔔 Dynamic Promo: Get 20% Off on all drinks today!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Shopping Cart Icon (Shows on mobile to open Drawer, shows count) */}
          <button 
            onClick={() => setIsMobileCartOpen(true)}
            className="p-2.5 rounded-full bg-[#e6f7f1] text-[#008a66] hover:opacity-90 relative lg:hidden"
            title="Open Order"
          >
            <ShoppingCart size={18} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-900 font-bold rounded-full text-[10px] flex items-center justify-center border-2 border-white shadow-xs">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden cursor-pointer hover:border-[#008a66] transition-all"
            title="User Account"
          >
            <img 
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(restaurant.slug)}`} 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ==================== PREMIUM FULL-WIDTH RESTAURANT BANNER ==================== */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div 
          className="relative h-[280px] sm:h-[340px] md:h-[380px] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-100 shadow-lg text-left"
        >
          {/* Background Image of the Restaurant */}
          <img 
            src={restaurant.bannerUrl || restaurant.image} 
            alt={restaurant.name} 
            className="absolute inset-0 w-full h-full object-cover opacity-100"
            referrerPolicy="no-referrer"
          />
          {/* Subtle vignette/dark gradient overlays to make white text pop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20"></div>

          {/* Top Row: Back Navigation, Search and Favorite Buttons */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between items-center z-10">
            {/* Back Button */}
            <button 
              onClick={() => navigate('/restaurants')}
              className="bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white border border-white/20 text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft size={14} className="stroke-[2.5]" />
              <span>Back to browsing</span>
            </button>

            {/* Actions: Search & Favorite */}
            <div className="flex items-center gap-2.5">
              {/* Search Toggle circle */}
              <button 
                onClick={() => {
                  setShowSearchAlert(!showSearchAlert);
                  const el = document.getElementById('categories-slider');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md ${
                  showSearchAlert 
                    ? 'bg-[#008a66] border-[#008a66] text-white' 
                    : 'bg-black/40 hover:bg-black/60 border-white/10 text-white'
                }`}
                title="Search Menu"
              >
                <Search size={16} />
              </button>

              {/* Favorite toggle circle */}
              <button 
                onClick={toggleFavorite}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md ${
                  isFavorite 
                    ? 'bg-rose-600 border-rose-600 text-white hover:bg-rose-700' 
                    : 'bg-black/40 hover:bg-black/60 border-white/10 text-white'
                }`}
                title="Favorite Restaurant"
              >
                <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
              </button>
            </div>
          </div>

          {/* Bottom Row: Details and Info Panel Overlay */}
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col md:flex-row md:items-end justify-between gap-5 z-10">
            
            {/* Left Content: Badges, Name, Stats */}
            <div className="text-white space-y-2 sm:space-y-3 max-w-xl text-left">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#008a66] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                  Featured
                </span>
                <span className="bg-white/15 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/10 shadow-sm">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span>{restaurant.rating.toFixed(1)} ({restaurant.reviewsCount}+ ratings)</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-3xl md:text-4.5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
                {restaurant.name}
              </h1>

              {/* Delivery info metadata row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-emerald-400" />
                  <span>{restaurant.deliveryTime}</span>
                </span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-1">
                  <Sparkles size={13} className="text-emerald-400 fill-emerald-400" />
                  <span>Free Delivery</span>
                </span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>1.2 miles away</span>
                </span>
              </div>
            </div>

            {/* Right Content: Elegant Translucent Info Card */}
            <div 
              className="md:max-w-xs w-full bg-black/45 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-white space-y-1 text-left shadow-xl"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                <Info size={12} className="stroke-[2.5]" />
                <span>Restaurant Info</span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed font-medium">
                {restaurant.description || restaurant.tagline}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* ==================== LEFT AREA: HERO, CATEGORIES & FOODS ==================== */}
        <div className="lg:col-span-8 space-y-8 flex flex-col">

          {/* ==================== CATEGORY NAVIGATION ==================== */}
          <section id="categories-slider" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Layers size={18} className="text-[#008a66]" /> Menu Categories
              </h2>
              <span className="text-[10px] text-slate-400 font-bold">Scroll horizontally to browse</span>
            </div>

            {/* Horizontal scrollbar with category icons */}
            <div 
              ref={categoryScrollRef}
              className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {FOOD_CATEGORIES_WITH_ICONS.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                    }}
                    className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs hover:scale-[1.02] ${
                      isActive 
                        ? 'bg-[#008a66] text-white shadow-md border-transparent ring-2 ring-[#008a66]/20' 
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ==================== MENU DISHES SECTION ==================== */}
          <section className="space-y-8">
            
            {/* If filtered menu is empty */}
            {filteredMenu.length === 0 ? (
              <div className="bg-white py-16 px-6 text-center rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Search size={22} />
                </div>
                <h3 className="font-extrabold text-slate-800">No Dishes Found</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  We couldn't find any dishes under "{selectedCategory}" containing your search query. Let's try another section!
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All Items');
                    setMenuSearchQuery('');
                  }}
                  className="bg-[#008a66] text-white text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#007052] transition-all"
                >
                  View All Dishes
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Dynamically divide menu by categories if "All Items" is selected */}
                {(selectedCategory === 'All Items' ? activeCategories.map(c => c.name) : [selectedCategory]).map((catName) => {
                  const dishesInCat = filteredMenu.filter(dish => {
                    if (catName === 'Popular') return dish.popular;
                    return dish.category.toLowerCase().includes(catName.toLowerCase().replace('desserts', 'desert'));
                  });

                  if (dishesInCat.length === 0) return null;

                  return (
                    <div key={catName} className="space-y-4">
                      {/* Section Title */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-[#008a66] rounded-full"></span>
                          {catName}
                          <span className="text-xs text-slate-400 font-semibold font-mono">({dishesInCat.length})</span>
                        </h3>
                        <button 
                          onClick={() => {
                            setSelectedCategory(catName);
                            window.scrollTo({ top: 350, behavior: 'smooth' });
                          }}
                          className="text-[11px] font-bold text-[#008a66] hover:underline"
                        >
                          View Category Only
                        </button>
                      </div>

                      {/* Display as MODERN HORIZONTAL CARDS */}
                      <div className="grid grid-cols-1 gap-4">
                        {dishesInCat.map((dish) => {
                          const cartQty = cart[dish.id]?.quantity || 0;
                          
                          // Custom assign badges based on names
                          const labelList = dish.labels || (dish.popular ? ['Bestseller', 'Chef\'s Choice'] : []);
                          
                          return (
                            <div 
                              key={dish.id} 
                              onClick={() => {
                                setCustomizingDish(dish);
                                setSelectedAdds([]);
                                setSelectedRemoves([]);
                                setCustomQty(1);
                                setSpecialInstructions('');
                                setSelectedSauce('Marinara');
                                setSelectedBread('White Bread');
                                setIsToasted(false);
                                trackRecentlyViewed(dish);
                              }}
                              className="bg-white rounded-2xl p-4 border border-slate-150/70 hover:border-[#008a66]/30 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-300 relative flex flex-col sm:flex-row gap-4 items-start sm:items-center cursor-pointer group"
                            >
                              
                              {/* Large Food Image with zoom on card hover */}
                              <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                                <img 
                                  src={dish.image} 
                                  alt={dish.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                />
                                {/* Optional Labels inside image */}
                                {labelList.length > 0 && (
                                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                    {labelList.map((lbl) => {
                                      let colorClass = 'bg-[#008a66] text-white';
                                      if (lbl === 'Spicy') colorClass = 'bg-rose-500 text-white';
                                      if (lbl === 'Vegetarian') colorClass = 'bg-emerald-600 text-white';
                                      if (lbl === 'New') colorClass = 'bg-sky-500 text-white';
                                      if (lbl === 'Chef\'s Choice') colorClass = 'bg-purple-600 text-white';
                                      
                                      return (
                                        <span 
                                          key={lbl} 
                                          className={`${colorClass} text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs`}
                                        >
                                          {lbl}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>

                              {/* Details: Middle-Right area */}
                              <div className="flex-1 space-y-1.5 min-w-0 pr-2">
                                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                  <h4 className="font-extrabold text-slate-800 text-[15px] sm:text-base leading-tight truncate group-hover:text-[#008a66] transition-colors">
                                    {dish.name}
                                  </h4>
                                  <span className="text-[#008a66] font-black text-sm sm:text-base font-sans">
                                    ${dish.price.toFixed(2)}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                                  {dish.description}
                                </p>

                                <div className="flex items-center gap-3 pt-1 text-[10px] font-bold text-slate-400">
                                  <span className="flex items-center gap-0.5 text-amber-500">
                                    <Star size={11} className="fill-amber-400" /> 4.9
                                  </span>
                                  <span>•</span>
                                  <span>{dish.category}</span>
                                  <span>•</span>
                                  <span className="text-emerald-600 hover:underline">Customizable ⚙️</span>
                                </div>
                              </div>

                              {/* Action controls (Right side) */}
                              <div 
                                className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-50 sm:pl-4 self-stretch"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Favorite button */}
                                <button 
                                  onClick={() => {
                                    addToCart(dish);
                                  }}
                                  className="w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                                  title="Add favorite"
                                >
                                  <Heart size={14} />
                                </button>

                                {/* Add / Stepper Button */}
                                <div className="min-h-[36px] flex items-center">
                                  {cartQty > 0 ? (
                                    <div className="flex items-center bg-[#008a66] text-white rounded-full px-2 py-1 gap-2.5 shadow-sm">
                                      <button 
                                        onClick={() => removeFromCart(dish.id)}
                                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                        title="Decrease"
                                      >
                                        <Minus size={11} className="stroke-[3]" />
                                      </button>
                                      <span className="text-xs font-extrabold min-w-[14px] text-center font-mono">
                                        {cartQty}
                                      </span>
                                      <button 
                                        onClick={() => addToCart(dish)}
                                        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                        title="Increase"
                                      >
                                        <Plus size={11} className="stroke-[3]" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => addToCart(dish)}
                                      className="text-xs font-extrabold bg-[#008a66] hover:bg-[#007052] text-white px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-xs hover:scale-105 cursor-pointer"
                                    >
                                      <Plus size={12} className="stroke-[3]" /> Add to Cart
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ==================== ADDITIONAL SECTIONS ==================== */}

          {/* 1. RESTAURANT DETAILED INFORMATION */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 text-left space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles size={16} className="text-[#008a66]" /> About {restaurant.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {restaurant.description} We are proud of our hand-picked organic suppliers, our sustainable meat policies, and our locally sourced produce which arrives at our kitchen counters every single morning. Our chefs are trained in classic styles combined with modern flavor science to promise an unforgettable banquet in every box.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kitchen Contacts</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={12} className="text-[#008a66]" />
                  <span className="font-bold">{restaurant.contact.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail size={12} className="text-[#008a66]" />
                  <span className="font-bold truncate">{restaurant.contact.email}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Special Guidelines</span>
                <p className="text-slate-500 font-medium leading-tight">
                  🍔 Order over $30 for instant FREE delivery. Minimum delivery order amount is ${restaurant.minOrder.toFixed(2)}. Allergy details can be typed during custom comments.
                </p>
              </div>
            </div>
          </section>

          {/* 2. REVIEWS & RATINGS (WITH LIVE USER INPUT SYSTEM!) */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#008a66]" /> Customer Reviews
                </h3>
                <p className="text-xs text-slate-400 font-medium">Real-time testimonials and feedback</p>
              </div>
              
              {/* Avg Rating Badge */}
              <div className="bg-[#e6f7f1] text-[#008a66] px-4 py-2 rounded-2xl flex items-center gap-2 self-start sm:self-center">
                <Star size={18} className="fill-[#008a66] text-[#008a66]" />
                <div className="text-left">
                  <span className="text-base font-black block leading-none">{restaurant.rating.toFixed(1)}</span>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">{restaurant.reviewsCount} verified reviews</span>
                </div>
              </div>
            </div>

            {/* List of Reviews */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#fcfdfe] rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100">
                        <img src={rev.avatar} alt={rev.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <span className="font-extrabold text-slate-800 block leading-tight">{rev.author}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">{rev.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400" />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                          Verified Order
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-500 font-medium leading-relaxed pl-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Live Interactive Add Review Form */}
            <form onSubmit={handleAddReview} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-150 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Write a Customer Review</h4>
                <p className="text-[10px] text-slate-400 font-medium">Have you tasted our menu? Share your live dining opinion below!</p>
              </div>

              {reviewSubmitMessage && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold p-3 rounded-xl">
                  {reviewSubmitMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-500">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria El-Ali"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008a66] outline-hidden text-slate-700"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-500">Review Star Score</label>
                  <div className="flex gap-1 pt-2">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setNewReviewRating(starVal)}
                        className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star 
                          size={18} 
                          className={starVal <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-500">Your Experience Details</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Tell others how delicious the pizzas, pasta, or burgers were..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008a66] outline-hidden text-slate-700 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="bg-[#008a66] hover:bg-[#007052] text-white text-xs font-extrabold px-5 py-2 rounded-xl transition-all shadow-xs"
              >
                Submit Live Review
              </button>
            </form>
          </section>

          {/* 3. OPENING HOURS TIMINGS GRID */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 text-left space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock size={16} className="text-[#008a66]" /> Opening Operational Timings
            </h3>
            <p className="text-xs text-slate-400 font-medium">Standard working schedule of {restaurant.name} for deliveries and collection.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
              {restaurant.openingHours.map((hour) => (
                <div key={hour.day} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs space-y-0.5">
                  <span className="font-extrabold text-slate-800 block">{hour.day.slice(0, 3)}</span>
                  {hour.isClosed ? (
                    <span className="text-rose-500 font-black text-[10px] block">Closed</span>
                  ) : (
                    <div className="text-slate-500 text-[9px] font-semibold space-y-0.5 leading-none">
                      <span className="block text-[#008a66] font-bold">{hour.openTime}</span>
                      <span className="block text-slate-400">to</span>
                      <span className="block font-bold">{hour.closeTime}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 4. RESTAURANT LOCATION MAP PLACEHOLDER */}
          <section className="bg-white p-6 rounded-3xl border border-slate-100 text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Map size={16} className="text-rose-500" /> Kitchen Map Location
              </h3>
              <a 
                href={restaurant.address.locationUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-[#008a66] hover:underline"
              >
                Open Google Maps ➔
              </a>
            </div>

            {/* Stylized premium Vector Map Illustration mockup */}
            <div className="h-44 bg-slate-100 border border-slate-100 rounded-2xl relative overflow-hidden flex items-center justify-center">
              {/* Map grid decoration patterns */}
              <div className="absolute inset-0 bg-radial-to-br from-transparent to-slate-200/50 pointer-events-none opacity-60"></div>
              <div className="absolute top-10 left-0 right-0 h-[1px] bg-slate-300/30"></div>
              <div className="absolute top-24 left-0 right-0 h-[1px] bg-slate-300/30"></div>
              <div className="absolute bottom-10 left-0 right-0 h-[1px] bg-slate-300/30"></div>
              <div className="absolute left-20 top-0 bottom-0 w-[1px] bg-slate-300/30"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-300/30"></div>
              <div className="absolute right-24 top-0 bottom-0 w-[1px] bg-slate-300/30"></div>
              
              {/* Diagonal pathways representing map roads */}
              <div className="absolute top-0 bottom-0 left-10 w-8 bg-slate-200/40 rotate-[35deg] transform origin-top"></div>
              <div className="absolute top-0 bottom-0 right-1/4 w-12 bg-slate-200/40 -rotate-[25deg] transform origin-top"></div>

              {/* Pulsing Pinpoint Marker */}
              <div className="relative z-10 text-center space-y-2">
                <div className="relative inline-block">
                  <div className="w-10 h-10 bg-rose-500/10 rounded-full flex items-center justify-center animate-ping absolute top-0 left-0 right-0 bottom-0"></div>
                  <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg relative">
                    <MapPin size={20} />
                  </div>
                </div>
                <div className="bg-slate-900/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide inline-block shadow-md">
                  📍 {restaurant.name} Kitchen
                </div>
              </div>
            </div>
          </section>

          {/* 5. SIMILAR RESTAURANTS RECOMMENDATION SECTION */}
          <section className="space-y-4">
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UtensilsCrossed size={16} className="text-[#008a66]" /> You Might Also Crave
            </h3>
            
            {/* Horizontal similar cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {restaurants
                .filter(r => r.id !== restaurant.id)
                .slice(0, 2)
                .map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => {
                      navigate(`/restaurants/${item.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-[#008a66]/20 shadow-xs hover:shadow-md transition-all flex gap-3.5 cursor-pointer group text-left"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <img src={item.logoUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0 space-y-0.5 flex-1">
                      <h4 className="font-extrabold text-xs text-slate-800 truncate group-hover:text-[#008a66] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold truncate">
                        {item.cuisineTypes.join(' • ')}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-slate-500">
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star size={10} className="fill-amber-400" /> {item.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{item.deliveryTime}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-350 shrink-0 self-center group-hover:translate-x-0.5 transition-transform" />
                  </div>
                ))}
            </div>
          </section>

          {/* 6. RECENTLY VIEWED DISHES CAROUSEL */}
          {recentlyViewed.length > 0 && (
            <section className="bg-white p-5 rounded-3xl border border-slate-100 text-left space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Recently Selected Dishes
              </h3>
              
              <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
                {recentlyViewed.map((dish) => (
                  <div 
                    key={`rec_${dish.id}`}
                    onClick={() => {
                      setCustomizingDish(dish);
                      setSelectedAdds([]);
                      setSelectedRemoves([]);
                      setCustomQty(1);
                      setSpecialInstructions('');
                      setSelectedSauce('Marinara');
                      setSelectedBread('White Bread');
                      setIsToasted(false);
                    }}
                    className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100/60 p-2 rounded-2xl border border-slate-100 shrink-0 max-w-[210px] cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-[11px] text-slate-800 block truncate leading-tight">
                        {dish.name}
                      </span>
                      <span className="text-[#008a66] font-black text-[10px] block mt-0.5">
                        ${dish.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ==================== RIGHT COLUMN: STICKY SHOPPING CART SIDEBAR ==================== */}
        <div className="hidden lg:block lg:col-span-4">
          <aside className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            
            {/* Top Header Row */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShoppingCart size={18} className="text-[#008a66]" /> Basket Order
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                  title="Clear all"
                >
                  Clear All
                </button>
              </div>

              {/* Dine / Pick Up / Delivery Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                {(['Delivery', 'Pick Up', 'Dine'] as const).map((type) => {
                  const isSelected = orderType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-2 text-[10px] font-black rounded-xl transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#008a66] text-white shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>

              {/* Cart items scrollable container */}
              <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                {getCartCount() === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag size={20} />
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-700">Your Basket is Empty</h4>
                    <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                      Select mouth-watering pizza, pasta, or burger dishes from our menu to fill your basket.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.values(cart).map((cartItem) => {
                      const cartItemId = cartItem.id || cartItem.item.id;
                      const itemExtraPrice = cartItem.addedIngredients 
                        ? cartItem.addedIngredients.reduce((sum, a) => sum + a.price, 0)
                        : 0;
                      const itemTotalPrice = (cartItem.item.price + itemExtraPrice) * cartItem.quantity;

                      return (
                        <div key={cartItemId} className="flex gap-2.5 pb-2.5 border-b border-slate-50 justify-between items-center text-xs">
                          
                          {/* Circular thumbnail image */}
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <img 
                              src={cartItem.item.image} 
                              alt={cartItem.item.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Middle Details */}
                          <div className="min-w-0 flex-1 text-left">
                            <span className="font-extrabold text-slate-800 text-xs block truncate leading-tight">
                              {cartItem.item.name}
                            </span>
                            
                            {/* Option selections */}
                            {cartItem.sauce && (
                              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                                Sauce: <span className="text-[#008a66]">{cartItem.sauce}</span>
                              </span>
                            )}
                            {cartItem.bread && (
                              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                                Bread: <span className="text-[#008a66]">{cartItem.bread}</span>{cartItem.isToasted ? " (Toasted)" : ""}
                              </span>
                            )}

                            {/* Extras and Removes */}
                            {cartItem.addedIngredients && cartItem.addedIngredients.length > 0 && (
                              <span className="text-[9px] text-emerald-600 font-bold block leading-tight mt-0.5">
                                + {cartItem.addedIngredients.map(a => a.name).join(', ')}
                              </span>
                            )}
                            {cartItem.removedIngredients && cartItem.removedIngredients.length > 0 && (
                              <span className="text-[9px] text-rose-500 font-bold block leading-tight mt-0.5">
                                - No {cartItem.removedIngredients.join(', No ')}
                              </span>
                            )}
                            {cartItem.specialInstructions && (
                              <span className="text-[9px] text-amber-600 font-medium block truncate max-w-full italic mt-0.5 bg-amber-50 px-1 py-0.5 rounded-sm">
                                "{cartItem.specialInstructions}"
                              </span>
                            )}
                          </div>

                          {/* Controls & Price */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-slate-800 font-extrabold text-xs">
                              ${itemTotalPrice.toFixed(2)}
                            </span>
                            
                            {/* Simple inline small stepper controls */}
                            <div className="flex items-center bg-slate-50 border border-slate-150 rounded-full px-1.5 py-0.5 gap-2">
                              <button 
                                onClick={() => removeFromCart(cartItemId)}
                                className="w-4 h-4 flex items-center justify-center hover:bg-slate-200 text-slate-500 rounded-full text-[10px]"
                                title="Less"
                              >
                                <Minus size={9} className="stroke-[3]" />
                              </button>
                              <span className="text-[10px] font-extrabold text-slate-700 min-w-[10px] text-center font-mono">
                                {cartItem.quantity}
                              </span>
                              <button 
                                onClick={() => addToCart(cartItem.item, cartItemId)}
                                className="w-4 h-4 flex items-center justify-center hover:bg-slate-200 text-slate-500 rounded-full text-[10px]"
                                title="More"
                              >
                                <Plus size={9} className="stroke-[3]" />
                              </button>
                            </div>
                          </div>

                          {/* Remove entire */}
                          <button 
                            onClick={() => removeEntireItem(cartItemId)}
                            className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Price Calculations breakdown */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              
              <div className="space-y-1.5 text-xs text-slate-500 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-700">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-slate-700">${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-slate-700">
                    {getDeliveryFee() === 0 ? (
                      <span className="text-emerald-600 font-extrabold uppercase text-[10px]">Free</span>
                    ) : `$${getDeliveryFee().toFixed(2)}`}
                  </span>
                </div>
                
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold bg-emerald-50/70 p-2 rounded-xl mt-1">
                    <span className="flex items-center gap-1">🎉 Coupon Discount</span>
                    <span>-${getDiscount().toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-50">
                <span className="text-sm font-black text-slate-900">Total Price</span>
                <span className="text-xl font-black text-[#008a66] font-sans">
                  ${getFinalTotal().toFixed(2)}
                </span>
              </div>

              {/* Small promotional / savings message */}
              {getCartCount() > 0 && (
                <p className="text-[10px] text-center font-bold text-emerald-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                  {getCartTotal() > 30 
                    ? "🎉 Nice! Free delivery applied. You saved an extra $1.99!" 
                    : `Add $${(30 - getCartTotal()).toFixed(2)} more to qualify for FREE delivery.`}
                </p>
              )}

              {/* View Cart & Checkout Action Button */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={getCartCount() === 0 || getCartTotal() < restaurant.minOrder}
                  className="w-full bg-[#008a66] hover:bg-[#007052] disabled:bg-slate-200 disabled:cursor-not-allowed text-white text-xs font-black py-3 rounded-xl transition-all cursor-pointer shadow-md text-center"
                >
                  View Cart & Checkout
                </button>
                
                {getCartCount() > 0 && getCartTotal() < restaurant.minOrder && (
                  <p className="text-[10px] text-center font-bold text-amber-600 bg-amber-50 p-2 rounded-xl">
                    ⚠️ Minimum order from {restaurant.name} is ${restaurant.minOrder.toFixed(2)}. Add ${(restaurant.minOrder - getCartTotal()).toFixed(2)} more.
                  </p>
                )}
              </div>

            </div>

          </aside>
        </div>

      </div>

      {/* ==================== FOOTER / CONTACT SECTION ==================== */}
      <footer id="footer-contact" className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-slate-100 text-left text-xs text-slate-400 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="font-extrabold text-slate-800 text-sm block">RestoManager Food Network</span>
            <p className="leading-relaxed">
              We connect hungry diners directly with top-rated local kitchens, offering full customization options and real-time delivery tracking for the absolute best food experience.
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-extrabold text-slate-800 text-sm block">Contact Support Desk</span>
            <p className="leading-relaxed">
              Have questions regarding your delivery, dietary allergies, or coupon codes? Our customer service team is online 24/7.
            </p>
            <p className="font-bold text-[#008a66]">Email: support@restomanager.com | Phone: +1 800 555 FOOD</p>
          </div>
          <div className="space-y-2">
            <span className="font-extrabold text-slate-800 text-sm block">Corporate Office Address</span>
            <p className="leading-relaxed">
              Downtown Culinary Plaza, Suite 402, Gourmet Street, Lebanon.
            </p>
            <p className="text-[10px]">© 2026 RestoManager Gourmet Inc. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* ==================== CHECKOUT SUCCESS POPUP DIALOG ==================== */}
      <AnimatePresence>
        {showCheckoutSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-left">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 bg-[#e6f7f1] text-[#008a66] rounded-full flex items-center justify-center mx-auto">
                <Check size={28} className="stroke-[3]" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  Your kitchen order is now cooking at <strong className="text-[#008a66]">{restaurant.name}</strong>.
                </p>
              </div>

              {/* Receipt Summary detailing food customizations */}
              <div className="bg-[#f8faf9] p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs text-slate-600 font-semibold max-h-48 overflow-y-auto">
                <div className="border-b border-slate-100 pb-1.5 mb-1.5 font-bold text-slate-400 uppercase tracking-wider text-[9px]">
                  Receipt Summary
                </div>
                
                {Object.values(cart).map((cartItem, idx) => {
                  const itemExtraPrice = cartItem.addedIngredients 
                    ? cartItem.addedIngredients.reduce((sum, a) => sum + a.price, 0)
                    : 0;
                  const itemTotalPrice = (cartItem.item.price + itemExtraPrice) * cartItem.quantity;

                  return (
                    <div key={idx} className="pb-1.5 border-b border-dashed border-slate-200 last:border-0 last:pb-0 text-[11px]">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{cartItem.quantity}x {cartItem.item.name}</span>
                        <span>${itemTotalPrice.toFixed(2)}</span>
                      </div>
                      {cartItem.addedIngredients && cartItem.addedIngredients.length > 0 && (
                        <div className="text-[9px] text-emerald-600 pl-2 mt-0.5">
                          + Extra: {cartItem.addedIngredients.map(a => a.name).join(', ')}
                        </div>
                      )}
                      {cartItem.removedIngredients && cartItem.removedIngredients.length > 0 && (
                        <div className="text-[9px] text-rose-500 pl-2 mt-0.5">
                          - No: {cartItem.removedIngredients.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                  <span>Order Type</span>
                  <span className="text-slate-800 font-extrabold">{orderType}</span>
                </div>
                <div className="flex justify-between text-[11px] border-t border-slate-200 pt-2 font-bold text-slate-900">
                  <span>Total Paid (incl. Tax)</span>
                  <span className="text-[#008a66] font-black">${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-medium">This is a simulated demo checkout. Your driver will deliver in {restaurant.deliveryTime}!</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MOBILE DRAWER CART SUMMARY ==================== */}
      <AnimatePresence>
        {isMobileCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-5 text-left space-y-4 shadow-2xl relative"
            >
              {/* Close Drawer Button */}
              <button 
                onClick={() => setIsMobileCartOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>

              <div className="border-b border-slate-50 pb-2">
                <h3 className="text-base font-black text-slate-900">Your Basket Order</h3>
                <p className="text-xs text-slate-400">Currently ordering from {restaurant.name}</p>
              </div>

              {/* Items scrollable container */}
              <div className="space-y-3.5 max-h-[35vh] overflow-y-auto pr-1">
                {getCartCount() === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingBag size={20} />
                    </div>
                    <p className="text-xs text-slate-400">Your basket is empty. Add some dishes!</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    {Object.values(cart).map((cartItem) => {
                      const cartItemId = cartItem.id || cartItem.item.id;
                      const itemExtraPrice = cartItem.addedIngredients 
                        ? cartItem.addedIngredients.reduce((sum, a) => sum + a.price, 0)
                        : 0;
                      const itemTotalPrice = (cartItem.item.price + itemExtraPrice) * cartItem.quantity;

                      return (
                        <div key={cartItemId} className="flex gap-2.5 pb-2.5 border-b border-slate-100 justify-between items-center">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                            <img src={cartItem.item.image} alt={cartItem.item.name} className="w-full h-full object-cover" />
                          </div>

                          <div className="min-w-0 flex-1 text-left">
                            <span className="font-extrabold text-slate-800 text-xs block truncate leading-tight">{cartItem.item.name}</span>
                            
                            {/* Option selections */}
                            {cartItem.sauce && (
                              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                                Sauce: <span className="text-[#008a66]">{cartItem.sauce}</span>
                              </span>
                            )}
                            {cartItem.bread && (
                              <span className="text-[9px] text-slate-500 font-bold block mt-0.5">
                                Bread: <span className="text-[#008a66]">{cartItem.bread}</span>{cartItem.isToasted ? " (Toasted)" : ""}
                              </span>
                            )}

                            {/* Extras and Removes */}
                            {cartItem.addedIngredients && cartItem.addedIngredients.length > 0 && (
                              <span className="text-[9px] text-emerald-600 font-bold block leading-tight mt-0.5">
                                + {cartItem.addedIngredients.map(a => a.name).join(', ')}
                              </span>
                            )}
                            {cartItem.removedIngredients && cartItem.removedIngredients.length > 0 && (
                              <span className="text-[9px] text-rose-500 font-bold block leading-tight mt-0.5">
                                - No {cartItem.removedIngredients.join(', No ')}
                              </span>
                            )}
                            {cartItem.specialInstructions && (
                              <span className="text-[9px] text-amber-600 font-medium block truncate max-w-full italic mt-0.5 bg-amber-50 px-1 py-0.5 rounded-sm">
                                "{cartItem.specialInstructions}"
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">${itemTotalPrice.toFixed(2)}</span>
                            
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-full px-1 py-0.5 gap-2">
                              <button onClick={() => removeFromCart(cartItemId)} className="w-4 h-4 text-slate-400 flex items-center justify-center">-</button>
                              <span className="font-bold text-[10px]">{cartItem.quantity}</span>
                              <button onClick={() => addToCart(cartItem.item, cartItemId)} className="w-4 h-4 text-slate-400 flex items-center justify-center">+</button>
                            </div>

                            <button onClick={() => removeEntireItem(cartItemId)} className="text-rose-400 p-1">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Calculations breakdown */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="text-slate-800">${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="text-slate-800">
                    {getDeliveryFee() === 0 ? "Free" : `$${getDeliveryFee().toFixed(2)}`}
                  </span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-emerald-600 bg-emerald-50 p-2 rounded-xl">
                    <span>🎉 Coupon Discount Applied</span>
                    <span>-${getDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-slate-900">
                  <span>Total Price</span>
                  <span className="text-[#008a66] text-base">${getFinalTotal().toFixed(2)}</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCheckout}
                    disabled={getCartCount() === 0 || getCartTotal() < restaurant.minOrder}
                    className="w-full bg-[#008a66] hover:bg-[#007052] disabled:bg-slate-200 text-white font-extrabold py-3 rounded-xl transition-all shadow-md text-center text-xs"
                  >
                    Place Simulated Order (${getFinalTotal().toFixed(2)})
                  </button>
                  {getCartCount() > 0 && getCartTotal() < restaurant.minOrder && (
                    <p className="text-[9px] text-center font-bold text-amber-600 mt-2">
                      ⚠️ Minimum order limit is ${restaurant.minOrder.toFixed(2)}.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== FOOD CUSTOMIZATION MODAL ==================== */}
      <AnimatePresence>
        {customizingDish && (() => {
          const options = getCustomizationOptions(customizingDish.category, customizingDish.name);
          const prepTime = (() => {
            const cat = (customizingDish.category || "").toLowerCase();
            const name = (customizingDish.name || "").toLowerCase();
            if (cat.includes('pizza') || name.includes('pizza')) return "12-15 mins";
            if (cat.includes('burger') || name.includes('burger')) return "10-12 mins";
            if (cat.includes('pasta') || name.includes('pasta')) return "15-18 mins";
            if (cat.includes('sandwich') || name.includes('sandwich')) return "8-10 mins";
            return "10-15 mins";
          })();

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-left">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setCustomizingDish(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors z-20"
                >
                  <X size={16} />
                </button>

                {/* Large Dish Image Banner */}
                <div className="h-44 sm:h-52 relative bg-slate-100 overflow-hidden -mx-6 -mt-6 rounded-t-3xl">
                  <img 
                    src={customizingDish.image} 
                    alt={customizingDish.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
                  
                  {/* Category & Prep Time Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 text-white">
                    <span className="bg-[#008a66] text-white text-[10px] font-black uppercase px-3 py-1 rounded-md shadow-xs">
                      {customizingDish.category}
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1 border border-white/15">
                      <Clock size={11} className="text-emerald-400" />
                      Prep Time: {prepTime}
                    </span>
                  </div>
                </div>

                {/* Title, Description & Base Price */}
                <div className="space-y-1 text-left">
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-tight">
                    {customizingDish.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    {customizingDish.description}
                  </p>
                  <p className="text-[#008a66] font-black text-sm pt-1">
                    Base Price: ${customizingDish.price.toFixed(2)}
                  </p>
                </div>

                {/* Customizations body options */}
                <div className="space-y-5 text-xs">
                  
                  {/* Category-Specific Option: Sauce Selection for Pasta */}
                  {options.type === 'pasta' && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                        Choose Sauce
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Alfredo', 'Marinara', 'Pesto'].map((sauce) => (
                          <button
                            key={sauce}
                            type="button"
                            onClick={() => setSelectedSauce(sauce)}
                            className={`py-2 px-1 text-center rounded-xl font-bold border transition-all text-[11px] ${
                              selectedSauce === sauce 
                                ? 'bg-[#008a66] border-[#008a66] text-white shadow-2xs' 
                                : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sauce}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category-Specific Option: Bread Type & Toast for Sandwich */}
                  {options.type === 'sandwich' && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                          Choose Bread Type
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['White Bread', 'Whole Wheat', 'Sourdough', 'Brioche'].map((bread) => (
                            <button
                              key={bread}
                              type="button"
                              onClick={() => setSelectedBread(bread)}
                              className={`py-2 px-1 text-center rounded-xl font-bold border transition-all text-[10px] ${
                                selectedBread === bread 
                                  ? 'bg-[#008a66] border-[#008a66] text-white shadow-2xs' 
                                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-750'
                              }`}
                            >
                              {bread}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <label className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-150 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isToasted}
                          onChange={(e) => setIsToasted(e.target.checked)}
                          className="w-4 h-4 rounded-md border-slate-300 text-[#008a66] focus:ring-[#008a66]"
                        />
                        <div className="text-left">
                          <span className="text-[10px] font-extrabold text-slate-800 block">Toast Bread</span>
                          <span className="text-[9px] text-slate-400 block font-semibold">Served warm and crispy</span>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Removes Section (Toggle pills / checkboxes) */}
                  {options.removable.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Remove Standard Ingredients (No Extra Cost)
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {options.removable.map((item) => {
                          const isRemoved = selectedRemoves.includes(item);
                          return (
                            <label
                              key={item}
                              className={`p-2.5 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer select-none ${
                                isRemoved 
                                  ? 'bg-rose-50 border-rose-200 text-rose-950 shadow-2xs' 
                                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={isRemoved}
                                  onChange={() => {
                                    if (isRemoved) {
                                      setSelectedRemoves(prev => prev.filter(r => r !== item));
                                    } else {
                                      setSelectedRemoves(prev => [...prev, item]);
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded-md border-slate-300 text-rose-500 focus:ring-rose-400"
                                />
                                <span className="font-extrabold text-[11px]">Remove {item}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Adds Section */}
                  {options.addable.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Add Premium Extras
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {options.addable.map((opt) => {
                          const isSelected = selectedAdds.some(a => a.name === opt.name);
                          return (
                            <button
                              key={opt.name}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedAdds(prev => prev.filter(a => a.name !== opt.name));
                                } else {
                                  setSelectedAdds(prev => [...prev, opt]);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-15 cursor-pointer ${
                                isSelected 
                                  ? 'bg-emerald-50/50 border-[#008a66] text-emerald-950 shadow-2xs' 
                                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-extrabold text-[11px] truncate max-w-[80%]">{opt.name}</span>
                                <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#008a66] border-[#008a66] text-white' : 'border-slate-300'}`}>
                                  {isSelected && <Check size={10} className="stroke-[3]" />}
                                </span>
                              </div>
                              <span className="text-[#008a66] text-[9px] font-black mt-1">
                                +${opt.price.toFixed(2)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions text area */}
                  <div className="space-y-2 text-left">
                    <label htmlFor="special-instructions" className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Special Instructions
                    </label>
                    <textarea
                      id="special-instructions"
                      rows={2}
                      placeholder="e.g. No salt, Extra spicy, Cut into slices, Well done..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008a66]/20 focus:border-[#008a66] outline-hidden text-slate-700 font-semibold placeholder:text-slate-450 resize-none"
                    />
                  </div>

                  {/* Quantity selection & item total */}
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Quantity</span>
                      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full px-3 py-1 gap-4 mt-1.5">
                        <button 
                          type="button"
                          onClick={() => setCustomQty(prev => Math.max(1, prev - 1))}
                          className="w-6 h-6 flex items-center justify-center text-sm font-black hover:bg-slate-200 rounded-full select-none"
                        >
                          -
                        </button>
                        <span className="text-sm font-black font-mono text-slate-800 min-w-[12px] text-center">
                          {customQty}
                        </span>
                        <button 
                          type="button"
                          onClick={() => setCustomQty(prev => prev + 1)}
                          className="w-6 h-6 flex items-center justify-center text-sm font-black hover:bg-slate-200 rounded-full select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Custom Subtotal</span>
                      <p className="text-[#008a66] font-black text-xl mt-1">
                        ${((customizingDish.price + selectedAdds.reduce((sum, a) => sum + a.price, 0)) * customQty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCustomizingDish(null)}
                    className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs text-center border border-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addCustomToCart(
                        customizingDish, 
                        customQty, 
                        selectedAdds, 
                        selectedRemoves, 
                        specialInstructions,
                        options.type === 'pasta' ? selectedSauce : undefined,
                        options.type === 'sandwich' ? selectedBread : undefined,
                        options.type === 'sandwich' ? isToasted : undefined
                      );
                      setCustomizingDish(null);
                    }}
                    className="w-full py-3 rounded-xl bg-[#008a66] hover:bg-[#007052] text-white font-extrabold text-xs text-center shadow-md cursor-pointer transition-colors"
                  >
                    Add to Basket
                  </button>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}

export default RestaurantMenuPage;
