import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  SlidersHorizontal, 
  X, 
  Heart, 
  ChevronDown, 
  Utensils, 
  ShoppingBag, 
  TrendingUp, 
  Sparkles, 
  Check, 
  ArrowLeft,
  ShoppingCart,
  User as UserIcon,
  Menu as MenuIcon,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  ShieldCheck
} from 'lucide-react';

// Type definitions
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
}

interface Address {
  building: string;
  street: string;
  floor: string;
  city: string;
  locationUrl: string;
}

interface Contact {
  phone: string;
  email: string;
}

interface OpeningHour {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface Verification {
  businessLicense: string;
  ownerIdDocument: string;
  reviewedAt: string;
  reviewedBy: string;
  rejectionReason: string | null;
  submittedAt: string;
}

interface Restaurant {
  _id: string;
  id: string; // compatibility mapper
  name: string;
  slug: string;
  description: string;
  address: Address;
  contact: Contact;
  bannerUrl: string;
  image: string; // compatibility mapper
  logoUrl: string;
  cuisineTypes: string[];
  cuisine: string; // compatibility mapper
  isOpen: boolean;
  ownerId: string;
  status: string;
  openingHours: OpeningHour[];
  verification: Verification;
  createdAt: string;
  updatedAt: string;

  // rich feature stats (fallbacks for nice listing visuals)
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

// Custom MongoDB-aligned restaurant dataset
const RESTAURANTS_DATA: Restaurant[] = [
  {
    _id: "rest_001",
    id: "rest_001",
    name: "Pizza Palace",
    slug: "pizza-palace",
    description: "Fresh Italian pizza made with authentic ingredients.",
    address: {
      building: "12",
      street: "Hamra Street",
      floor: "1",
      city: "Beirut",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+96170111111",
      email: "pizza@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
    cuisineTypes: ["Italian", "Pizza"],
    cuisine: "Italian",
    isOpen: true,
    ownerId: "owner001",
    status: "approved",
    openingHours: [
      {
        day: "Monday",
        openTime: "10:00",
        closeTime: "22:00",
        isClosed: false
      },
      {
        day: "Tuesday",
        openTime: "10:00",
        closeTime: "22:00",
        isClosed: false
      }
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
    minOrder: 15,
    deliveryFee: 1.99,
    featured: true,
    offers: "Free delivery on orders over $30",
    tagline: "Authentic stone-baked wood-fired pizza and handmade pasta.",
    location: "Hamra Street, Beirut",
    menu: [
      { id: 'm1-1', name: 'Margherita Pizza', price: 14.99, description: 'Fresh mozzarella, san marzano tomatoes, fresh basil, and extra virgin olive oil.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm1-2', name: 'Truffle Mushroom Fettuccine', price: 18.99, description: 'Handmade fettuccine, wild mushrooms, creamy truffle sauce, and shaved pecorino.', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm1-3', name: 'Classic Tiramisu', price: 8.50, description: 'Espresso-soaked ladyfingers, whipped mascarpone cream, and dark cocoa dust.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=300&auto=format&fit=crop' },
      { id: 'm1-4', name: 'Burrata & Prosciutto', price: 15.50, description: 'Creamy burrata ball, aged prosciutto di Parma, wild arugula, and balsamic glaze.', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=300&auto=format&fit=crop' }
    ]
  },
  {
    _id: "rest_002",
    id: "rest_002",
    name: "Burger House",
    slug: "burger-house",
    description: "Juicy burgers with crispy fries and fresh ingredients.",
    address: {
      building: "22",
      street: "Riad El Solh",
      floor: "Ground",
      city: "Sidon",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+96170222222",
      email: "burger@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    cuisineTypes: ["American", "Fast Food"],
    cuisine: "American",
    isOpen: false,
    ownerId: "owner002",
    status: "approved",
    openingHours: [
      {
        day: "Monday",
        openTime: "11:00",
        closeTime: "23:00",
        isClosed: false
      }
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
    minOrder: 12,
    deliveryFee: 1.49,
    featured: false,
    offers: "Complimentary onion rings above $25",
    tagline: "Gourmet Angus beef burgers on toasted brioche with hand-cut truffle fries.",
    location: "Riad El Solh, Sidon",
    menu: [
      { id: 'm4-1', name: 'The Truffle Bacon Burger', price: 14.50, description: 'Angus beef patty, crispy applewood smoked bacon, swiss cheese, arugula, and white truffle aioli.', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm4-2', name: 'Crispy Buffalo Chicken Burger', price: 13.50, description: 'Buttermilk fried chicken breast tossed in spicy buffalo sauce, blue cheese slaw, and pickles.', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=300&auto=format&fit=crop' },
      { id: 'm4-3', name: 'Loaded Truffle Fries', price: 7.99, description: 'Hand-cut russet fries tossed in black truffle oil, parmesan cheese, and fresh parsley.', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=300&auto=format&fit=crop', popular: true }
    ]
  },
  {
    _id: "rest_003",
    id: "rest_003",
    name: "Sushi World",
    slug: "sushi-world",
    description: "Authentic Japanese sushi prepared by professional chefs.",
    address: {
      building: "5",
      street: "Downtown",
      floor: "2",
      city: "Beirut",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+96170333333",
      email: "sushi@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
    cuisineTypes: ["Japanese", "Sushi"],
    cuisine: "Japanese",
    isOpen: true,
    ownerId: "owner003",
    status: "approved",
    openingHours: [
      {
        day: "Monday",
        openTime: "12:00",
        closeTime: "23:30",
        isClosed: false
      }
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
    minOrder: 25,
    deliveryFee: 2.99,
    featured: true,
    offers: "20% off with code SAKURA20",
    tagline: "Fresh sashimi, premium signature rolls, and rich tonkotsu ramen.",
    location: "Downtown, Beirut",
    menu: [
      { id: 'm2-1', name: 'Dragon Roll (8pcs)', price: 16.99, description: 'Eel and cucumber inside, topped with avocado, unagi sauce, and sesame seeds.', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm2-2', name: 'Signature Tonkotsu Ramen', price: 15.99, description: '16-hour pork bone broth, thin noodles, chashu pork, soft-boiled egg, and nori.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm2-3', name: 'Premium Sashimi Platter', price: 28.00, description: '12 pieces of chef’s daily selection of fresh tuna, salmon, and yellowtail.', image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=300&auto=format&fit=crop' }
    ]
  },
  {
    _id: "rest_004",
    id: "rest_004",
    name: "Lebanese Grill",
    slug: "lebanese-grill",
    description: "Traditional Lebanese BBQ, shawarma and mezze.",
    address: {
      building: "18",
      street: "Saida Old Road",
      floor: "Ground",
      city: "Sidon",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+96170444444",
      email: "grill@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    cuisineTypes: ["Lebanese", "BBQ"],
    cuisine: "Lebanese",
    isOpen: true,
    ownerId: "owner004",
    status: "approved",
    openingHours: [
      {
        day: "Monday",
        openTime: "09:00",
        closeTime: "23:00",
        isClosed: false
      }
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
    minOrder: 15,
    deliveryFee: 1.99,
    featured: false,
    offers: "10% off on Greek Souvlaki plates",
    tagline: "Fresh Lebanese BBQ skewers, warm hand-stretched pita, and rich creamy hummus.",
    location: "Saida Old Road, Sidon",
    menu: [
      { id: 'm8-1', name: 'Grilled Souvlaki Platter', price: 15.99, description: 'Skewers of grilled herbs-marinated chicken breast, warm pita bread, house tzatziki, and Greek fries.', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm8-2', name: 'Artisanal Hummus Trio', price: 8.99, description: 'Creamy classic, roasted red pepper, and spicy cilantro jalapeno hummus served with fresh olive oil and warm pita pockets.', image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm8-3', name: 'Authentic Mediterranean Salad', price: 10.99, description: 'Vine-ripened tomatoes, crisp cucumbers, red onions, kalamata olives, and block of premium feta cheese sprinkled with wild oregano.', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=300&auto=format&fit=crop' }
    ]
  },
  {
    _id: "rest_005",
    id: "rest_005",
    name: "Sweet Bakery",
    slug: "sweet-bakery",
    description: "Fresh pastries, cakes, coffee and desserts.",
    address: {
      building: "8",
      street: "Main Road",
      floor: "Ground",
      city: "Tyre",
      locationUrl: "https://maps.google.com"
    },
    contact: {
      phone: "+96170555555",
      email: "bakery@restaurant.com"
    },
    bannerUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3082/3082011.png",
    cuisineTypes: ["Bakery", "Desserts"],
    cuisine: "Desserts",
    isOpen: true,
    ownerId: "owner005",
    status: "approved",
    openingHours: [
      {
        day: "Monday",
        openTime: "07:00",
        closeTime: "21:00",
        isClosed: false
      }
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
    minOrder: 10,
    deliveryFee: 0.00,
    featured: false,
    offers: "Buy 5 macarons, get 1 free",
    tagline: "Delicate macarons, buttery croissants, and classic French pastry creations.",
    location: "Main Road, Tyre",
    menu: [
      { id: 'm6-1', name: 'Luxury Macaron Box (6pcs)', price: 16.50, description: 'Assorted seasonal flavors including dark chocolate ganache, salted caramel, and madagascar vanilla bean.', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm6-2', name: 'Buttery Almond Croissant', price: 4.95, description: 'Flaky baked croissant filled with sweet frangipane almond cream and toasted almond slices.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300&auto=format&fit=crop', popular: true },
      { id: 'm6-3', name: 'Chocolate Soufflé Tart', price: 7.95, description: 'A decadent dark Belgian chocolate tart with a molten center, served with fresh raspberries.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=300&auto=format&fit=crop' }
    ]
  }
];

// All available cuisine filters
const CUISINES = ['All', 'Italian', 'Pizza', 'American', 'Fast Food', 'Japanese', 'Sushi', 'Lebanese', 'BBQ', 'Bakery', 'Desserts'];

export const RestaurantListingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPriceLevel, setSelectedPriceLevel] = useState<number | null>(null);
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyHighlyRated, setOnlyHighlyRated] = useState(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'deliveryTime' | 'reviews'>('rating');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Restaurants State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Registration Form Modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regCuisine, setRegCuisine] = useState('Italian');
  const [regTagline, setRegTagline] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regPriceLevel, setRegPriceLevel] = useState<1 | 2 | 3>(2);
  const [regDeliveryTime, setRegDeliveryTime] = useState('20-30 min');
  const [regMinOrder, setRegMinOrder] = useState(15);
  const [regDeliveryFee, setRegDeliveryFee] = useState(1.99);
  const [regImage, setRegImage] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop'); // default nice bistro table image
  
  // Custom dish add fields inside the form
  const [customDishName, setCustomDishName] = useState('');
  const [customDishPrice, setCustomDishPrice] = useState('');
  const [customDishDesc, setCustomDishDesc] = useState('');
  const [regMenu, setRegMenu] = useState<MenuItem[]>([
    {
      id: 'm-custom-1',
      name: 'Signature House Special',
      price: 15.99,
      description: 'Our award-winning seasonal chef special made with fresh locally sourced ingredients.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop',
      popular: true
    }
  ]);

  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Quick View State
  const [quickViewRestaurant, setQuickViewRestaurant] = useState<Restaurant | null>(null);
  const [drawerTab, setDrawerTab] = useState<'menu' | 'about'>('menu');
  const [demoCart, setDemoCart] = useState<{ [itemId: string]: { item: MenuItem; quantity: number } }>({});
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Load Favorites & Restaurants from LocalStorage on mount
  useEffect(() => {
    // 1. Favorites
    const savedFavs = localStorage.getItem('resto_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error('Failed to parse favorites');
      }
    }

    // 2. Custom Restaurants list
    const savedCustom = localStorage.getItem('custom_restaurants');
    let customList: Restaurant[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch (e) {
        console.error('Failed to parse custom restaurants');
      }
    }
    setRestaurants([...RESTAURANTS_DATA, ...customList]);
  }, []);

  // Save Favorites
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('resto_favorites', JSON.stringify(updated));
  };

  // Add custom dish helper
  const handleAddCustomDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDishName.trim()) return;
    const price = parseFloat(customDishPrice) || 9.99;
    const newDish: MenuItem = {
      id: `m-custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: customDishName.trim(),
      price: price,
      description: customDishDesc.trim() || 'Prepared fresh by our talented kitchen staff with local ingredients.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop'
    };
    setRegMenu([...regMenu, newDish]);
    setCustomDishName('');
    setCustomDishPrice('');
    setCustomDishDesc('');
  };

  const handleRemoveCustomDish = (id: string) => {
    setRegMenu(regMenu.filter(item => item.id !== id));
  };

  // Submission handler for new restaurant registration
  const handleRegisterRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      setRegError('Please enter a restaurant name.');
      return;
    }
    if (!regLocation.trim()) {
      setRegError('Please enter the restaurant location address.');
      return;
    }

    const newId = `resto-${Date.now()}`;
    const newResto: Restaurant = {
      _id: newId,
      id: newId,
      name: regName.trim(),
      slug: regName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: regTagline.trim() || `Fresh gourmet ${regCuisine} made with authentic local ingredients in ${regLocation.trim()}.`,
      address: {
        building: "1",
        street: regLocation.trim(),
        floor: "G",
        city: "Beirut",
        locationUrl: "https://maps.google.com"
      },
      contact: {
        phone: "+96170000000",
        email: "contact@restaurant.com"
      },
      bannerUrl: regImage,
      image: regImage,
      logoUrl: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png",
      cuisineTypes: [regCuisine],
      cuisine: regCuisine,
      isOpen: true,
      ownerId: "owner_custom",
      status: "approved",
      openingHours: [
        {
          day: "Monday",
          openTime: "09:00",
          closeTime: "22:00",
          isClosed: false
        }
      ],
      verification: {
        businessLicense: "license_custom.pdf",
        ownerIdDocument: "owner_custom.pdf",
        reviewedAt: new Date().toISOString().split('T')[0],
        reviewedBy: "AutoAdmin",
        rejectionReason: null,
        submittedAt: new Date().toISOString().split('T')[0]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.8, // New restaurants get a premium launch rating
      reviewsCount: 1, // Start with 1 launch review
      priceLevel: regPriceLevel,
      deliveryTime: regDeliveryTime,
      minOrder: Number(regMinOrder) || 10,
      deliveryFee: Number(regDeliveryFee) || 0,
      featured: false,
      offers: '10% Off for Launch Week',
      tagline: regTagline.trim() || `The absolute best ${regCuisine} cuisine in ${regLocation.trim()}.`,
      location: regLocation.trim(),
      menu: regMenu.length > 0 ? regMenu : [
        {
          id: `m-custom-default`,
          name: 'Classic Chef’s Platter',
          price: 14.99,
          description: 'A delicate curation of our finest fresh ingredients cooked to perfection.',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop'
        }
      ]
    };

    // Save to localStorage
    const savedCustom = localStorage.getItem('custom_restaurants');
    let customList: Restaurant[] = [];
    if (savedCustom) {
      try {
        customList = JSON.parse(savedCustom);
      } catch (err) {
        customList = [];
      }
    }
    const updatedCustom = [...customList, newResto];
    localStorage.setItem('custom_restaurants', JSON.stringify(updatedCustom));
    setRestaurants([...RESTAURANTS_DATA, ...updatedCustom]);

    // Success notification
    setRegSuccess(true);
    setRegError('');
    
    // Clear fields
    setTimeout(() => {
      setRegSuccess(false);
      setIsRegisterModalOpen(false);
      // Reset form fields
      setRegName('');
      setRegCuisine('Italian');
      setRegTagline('');
      setRegLocation('');
      setRegPriceLevel(2);
      setRegDeliveryTime('20-30 min');
      setRegMinOrder(15);
      setRegDeliveryFee(1.99);
      setRegImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop');
      setRegMenu([
        {
          id: 'm-custom-1',
          name: 'Signature House Special',
          price: 15.99,
          description: 'Our award-winning seasonal chef special made with fresh locally sourced ingredients.',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=300&auto=format&fit=crop',
          popular: true
        }
      ]);
    }, 2000);
  };

  // Filter & Sort Logic
  const filteredRestaurants = restaurants.filter((resto) => {
    const matchesSearch = 
      resto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resto.cuisineTypes && resto.cuisineTypes.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      resto.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resto.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resto.address && (
        resto.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resto.address.street.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    const matchesCuisine = selectedCuisine === 'All' || 
      resto.cuisine === selectedCuisine ||
      (resto.cuisineTypes && resto.cuisineTypes.includes(selectedCuisine));

    const matchesPrice = selectedPriceLevel === null || resto.priceLevel === selectedPriceLevel;
    const matchesFeatured = !onlyFeatured || resto.featured === true;
    const matchesRating = !onlyHighlyRated || resto.rating >= 4.7;
    const matchesFreeDelivery = !onlyFreeDelivery || resto.deliveryFee === 0;

    return matchesSearch && matchesCuisine && matchesPrice && matchesFeatured && matchesRating && matchesFreeDelivery;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
    // deliveryTime extraction (e.g. "20-30 min" -> 20)
    if (sortBy === 'deliveryTime') {
      const timeA = parseInt(a.deliveryTime.split('-')[0]) || 0;
      const timeB = parseInt(b.deliveryTime.split('-')[0]) || 0;
      return timeA - timeB;
    }
    return 0;
  });

  // Demo Cart Functions
  const addToCart = (item: MenuItem) => {
    setDemoCart(prev => {
      const existing = prev[item.id];
      if (existing) {
        return {
          ...prev,
          [item.id]: { ...existing, quantity: existing.quantity + 1 }
        };
      } else {
        return {
          ...prev,
          [item.id]: { item, quantity: 1 }
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setDemoCart(prev => {
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

  const clearCart = () => {
    setDemoCart({});
  };

  const getCartTotal = () => {
    return Object.values(demoCart).reduce((acc, current) => {
      return acc + (current.item.price * current.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return Object.values(demoCart).reduce((acc, current) => {
      return acc + current.quantity;
    }, 0);
  };

  const handleDemoCheckout = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutSuccess(false);
      setDemoCart({});
      setQuickViewRestaurant(null);
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-background text-on-background selection:bg-primary selection:text-white flex flex-col">
      
      {/* TopNavBar Header (Reused identical style) */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-12 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant transition-all duration-300">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            RestoManager
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-secondary font-medium text-xs tracking-wide py-1 hover:text-primary transition-colors">Home</Link>
            <Link to="/restaurants" className="text-primary font-bold border-b-2 border-primary text-xs tracking-wide py-1 hover:opacity-80 transition-opacity">Restaurants</Link>
            <a href="/#features" className="text-secondary font-medium text-xs tracking-wide py-1 hover:text-primary transition-colors">Features</a>
            <a href="/#about" className="text-secondary font-medium text-xs tracking-wide py-1 hover:text-primary transition-colors">About</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant">
            <Search size={16} className="text-secondary" />
            <input 
              className="bg-transparent border-none focus:outline-hidden text-xs w-32 ml-1 text-on-background placeholder-slate-400" 
              placeholder="Search restaurants..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (getCartCount() > 0 && quickViewRestaurant === null) {
                  // Open first restaurant if cart has item
                  const firstRestoWithCartItem = restaurants.find(r => 
                    r.menu.some(m => demoCart[m.id])
                  );
                  if (firstRestoWithCartItem) setQuickViewRestaurant(firstRestoWithCartItem);
                } else if (getCartCount() > 0) {
                  // Toggle off
                  setQuickViewRestaurant(null);
                }
              }}
              className="text-secondary p-2 hover:bg-surface-container-low rounded-full transition-colors relative" 
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </button>
            <Link to="/login" className="text-secondary p-2 hover:bg-surface-container-low rounded-full transition-colors" aria-label="Profile">
              <UserIcon size={18} />
            </Link>
            <Link to="/login" className="hidden lg:block text-secondary font-bold text-xs px-4 py-2 hover:text-primary transition-all">
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-primary text-on-primary text-xs font-bold px-5 py-2.5 rounded-full hover:bg-dark-teal active:scale-95 transition-all shadow-xs"
            >
              Get Started
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-secondary p-2 hover:bg-surface-container-low rounded-full transition-colors"
              aria-label="Toggle Menu"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Same as landing page) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-outline-variant p-4 space-y-3 transition-all duration-300">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-secondary px-3 py-2 hover:bg-surface-container-low rounded-lg"
          >
            Home
          </Link>
          <Link 
            to="/restaurants" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-semibold text-primary px-3 py-2 bg-primary-container/20 rounded-lg"
          >
            Browse Restaurants
          </Link>
          <a 
            href="/#features" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-sm font-medium text-secondary px-3 py-2 hover:bg-surface-container-low rounded-lg"
          >
            Features
          </a>
          <div className="pt-2 border-t border-outline-variant flex flex-col gap-2">
            <Link 
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-semibold text-secondary text-sm py-2"
            >
              Login
            </Link>
            <Link 
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center font-bold bg-primary text-on-primary text-sm py-2.5 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Banner Area */}
      <section className="bg-surface border-b border-outline-variant py-10 px-4 md:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container text-primary rounded-full border border-primary/10">
              <Sparkles size={12} className="shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Order direct, Support Local</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-background">
              Fine Dining & Street Food <span className="text-primary">Delivered</span>
            </h1>
            <p className="text-xs md:text-sm text-secondary max-w-lg leading-relaxed">
              Explore the finest culinary establishments in your neighborhood. Hand-selected for exceptional taste, pristine food hygiene, and super-fast delivery.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={() => setIsRegisterModalOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-dark-teal active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <Utensils size={14} />
                Register Your Restaurant
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-[10px] font-bold border border-secondary/30">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                MongoDB Sync Live
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 bg-background p-4 rounded-2xl border border-outline-variant">
            <div className="text-left">
              <p className="text-xs text-secondary">Restaurants</p>
              <p className="text-base md:text-lg font-bold text-primary">8 Premier</p>
            </div>
            <div className="text-left border-l border-outline-variant pl-4">
              <p className="text-xs text-secondary">Avg. Time</p>
              <p className="text-base md:text-lg font-bold text-primary">25 min</p>
            </div>
            <div className="text-left border-l border-outline-variant pl-4">
              <p className="text-xs text-secondary">Free Delivery</p>
              <p className="text-base md:text-lg font-bold text-primary">Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 text-left space-y-8">
          
          {/* Active search details */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-on-background flex items-center gap-2 uppercase tracking-wider">
              <SlidersHorizontal size={14} className="text-primary" />
              Filters
            </h3>
            <div className="h-px bg-outline-variant"></div>
          </div>

          {/* Price Level Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Price Range</h4>
            <div className="flex gap-2">
              {[
                { label: '$', val: 1 },
                { label: '$$', val: 2 },
                { label: '$$$', val: 3 }
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setSelectedPriceLevel(selectedPriceLevel === p.val ? null : p.val)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                    selectedPriceLevel === p.val 
                      ? 'bg-primary border-primary text-white shadow-xs' 
                      : 'bg-white border-outline hover:border-primary text-secondary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Filters switches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Quick Filters</h4>
            <div className="space-y-2.5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline accent-primary" 
                />
                <span className="text-xs font-medium text-secondary group-hover:text-on-background transition-colors">
                  Featured Partner
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={onlyHighlyRated}
                  onChange={(e) => setOnlyHighlyRated(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline accent-primary" 
                />
                <span className="text-xs font-medium text-secondary group-hover:text-on-background transition-colors">
                  Highly Rated (4.7+)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox"
                  checked={onlyFreeDelivery}
                  onChange={(e) => setOnlyFreeDelivery(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline accent-primary" 
                />
                <span className="text-xs font-medium text-secondary group-hover:text-on-background transition-colors">
                  Free Delivery
                </span>
              </label>
            </div>
          </div>

          {/* Sort By options */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Sort Restaurants</h4>
            <div className="space-y-1">
              {[
                { label: 'Highest Rated First', val: 'rating' },
                { label: 'Fastest Delivery First', val: 'deliveryTime' },
                { label: 'Most Reviewed First', val: 'reviews' }
              ].map((option) => (
                <button
                  key={option.val}
                  onClick={() => setSortBy(option.val as any)}
                  className={`w-full text-left py-2 px-3 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    sortBy === option.val 
                      ? 'bg-primary-container/40 text-primary font-semibold' 
                      : 'text-secondary hover:bg-surface-container-low hover:text-on-background'
                  }`}
                >
                  {option.label}
                  {sortBy === option.val && <Check size={14} className="text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Favorites Widget */}
          <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant space-y-3">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Heart size={12} className="fill-red-500 text-red-500" /> My Favorites ({favorites.length})
            </h4>
            {favorites.length === 0 ? (
              <p className="text-[10px] text-slate-400">Click the heart icon on any restaurant card to save your favorites.</p>
            ) : (
              <div className="space-y-2">
                {restaurants.filter(r => favorites.includes(r.id)).map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-outline-variant">
                    <span className="text-xs font-semibold text-on-background truncate">{r.name}</span>
                    <button 
                      onClick={(e) => toggleFavorite(r.id, e)} 
                      className="text-red-500 hover:text-slate-400 transition-colors p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Restaurants Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Search, Mobile Filters, and Sorting Bar */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            
            {/* Cuisine Filter Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:mx-0 md:px-0">
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                    selectedCuisine === cuisine 
                      ? 'bg-primary border-primary text-white shadow-sm' 
                      : 'bg-white border-outline-variant hover:border-primary/50 text-secondary'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>

            {/* Mobile Filter and Sort toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-outline-variant text-xs font-bold text-secondary hover:bg-surface-container-low transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filters
              </button>

              <div className="relative inline-block text-left ml-auto md:ml-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white pr-9 pl-4 py-2 rounded-full border border-outline-variant text-xs font-bold text-secondary focus:outline-hidden focus:border-primary cursor-pointer"
                >
                  <option value="rating">Sort: Top Rated</option>
                  <option value="deliveryTime">Sort: Delivery Time</option>
                  <option value="reviews">Sort: Popularity</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters Summary (if any are active) */}
          {(selectedCuisine !== 'All' || selectedPriceLevel !== null || onlyFeatured || onlyHighlyRated || onlyFreeDelivery || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-left bg-surface-container-low p-3 rounded-xl border border-outline-variant">
              <span className="font-bold text-secondary text-[11px] uppercase tracking-wider mr-1">Active:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-outline-variant text-secondary">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-primary"><X size={12} /></button>
                </span>
              )}
              {selectedCuisine !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-outline-variant text-secondary">
                  Cuisine: {selectedCuisine}
                  <button onClick={() => setSelectedCuisine('All')} className="hover:text-primary"><X size={12} /></button>
                </span>
              )}
              {selectedPriceLevel !== null && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-outline-variant text-secondary">
                  Price: {'$'.repeat(selectedPriceLevel)}
                  <button onClick={() => setSelectedPriceLevel(null)} className="hover:text-primary"><X size={12} /></button>
                </span>
              )}
              {onlyFeatured && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-outline-variant text-secondary">
                  Featured
                  <button onClick={() => setOnlyFeatured(false)} className="hover:text-primary"><X size={12} /></button>
                </span>
              )}
              {onlyHighlyRated && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-outline-variant text-secondary">
                  Highly Rated
                  <button onClick={() => setOnlyHighlyRated(false)} className="hover:text-primary"><X size={12} /></button>
                </span>
              )}
              {onlyFreeDelivery && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-outline-variant text-secondary">
                  Free Delivery
                  <button onClick={() => setOnlyFreeDelivery(false)} className="hover:text-primary"><X size={12} /></button>
                </span>
              )}

              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCuisine('All');
                  setSelectedPriceLevel(null);
                  setOnlyFeatured(false);
                  setOnlyHighlyRated(false);
                  setOnlyFreeDelivery(false);
                }} 
                className="text-primary font-bold hover:underline text-[11px] ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Restaurants Grid */}
          {filteredRestaurants.length === 0 ? (
            <div className="bg-white py-16 px-4 text-center rounded-2xl border border-outline-variant space-y-4">
              <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto text-secondary">
                <Utensils size={28} />
              </div>
              <h3 className="text-lg font-bold text-on-background">No Restaurants Found</h3>
              <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
                We couldn't find any restaurants matching your search. Try broadening your criteria or resetting filters.
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCuisine('All');
                  setSelectedPriceLevel(null);
                  setOnlyFeatured(false);
                  setOnlyHighlyRated(false);
                  setOnlyFreeDelivery(false);
                }}
                className="bg-primary text-on-primary text-xs font-bold px-5 py-2.5 rounded-full hover:bg-dark-teal transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRestaurants.map((resto) => {
                const isFavorite = favorites.includes(resto.id);
                return (
                  <div 
                    key={resto.id} 
                    className="bg-white rounded-2xl overflow-hidden border border-outline-variant hover:border-primary/40 hover:shadow-lg transition-all group flex flex-col text-left cursor-pointer"
                    onClick={() => { setQuickViewRestaurant(resto); setDrawerTab('menu'); }}
                  >
                    {/* Cover image & badges */}
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      <img 
                        src={resto.image} 
                        alt={resto.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      
                      {/* Floating Header Actions */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        {resto.featured && (
                          <span className="bg-primary text-white text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1">
                            <Sparkles size={8} className="fill-white" /> Featured
                          </span>
                        )}
                        {resto.offers && (
                          <span className="bg-amber-400 text-slate-950 text-[9px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                            🔥 Special Deal
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(resto.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-600 hover:text-red-500 shadow-sm hover:scale-105 transition-all"
                        aria-label="Add to favorites"
                      >
                        <Heart size={16} className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* Floating Footer Cuisine Tag */}
                      <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-primary text-[10px] font-bold px-3 py-1 rounded-full">
                        {resto.cuisineTypes ? resto.cuisineTypes.join(' • ') : resto.cuisine}
                      </span>
                    </div>

                    {/* Meta info card content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {resto.logoUrl && (
                              <img 
                                src={resto.logoUrl} 
                                alt={`${resto.name} Logo`} 
                                className="w-7 h-7 rounded-full object-cover border border-outline-variant shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <h3 className="font-extrabold text-base text-on-background group-hover:text-primary transition-colors truncate">
                              {resto.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-lg shrink-0">
                            <Star size={13} className="fill-emerald-600 text-emerald-600" />
                            {resto.rating}
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-1">{resto.tagline}</p>
                        
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <MapPin size={12} className="text-secondary-foreground" />
                          <span className="truncate">{resto.location}</span>
                        </div>
                      </div>

                      {/* Delivery and Pricing details footer row */}
                      <div className="pt-4 border-t border-outline-variant flex items-center justify-between text-xs text-slate-500 font-semibold gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock size={13} className="text-slate-400" />
                            {resto.deliveryTime}
                          </div>
                          <div className="flex items-center gap-1 text-on-background">
                            <DollarSign size={13} className="text-slate-400 -mr-0.5" />
                            {'$'.repeat(resto.priceLevel)}
                          </div>
                        </div>

                        <div className="text-right text-[11px]">
                          {resto.deliveryFee === 0 ? (
                            <span className="text-primary font-bold">Free Delivery</span>
                          ) : (
                            <span>${resto.deliveryFee} Del. Fee</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Quick View Menu & Shopping Cart Drawer/Modal Overlay */}
      {quickViewRestaurant && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
          
          {/* Main Drawer Shell */}
          <div className="w-full max-w-2xl bg-background h-full overflow-y-auto flex flex-col animate-slide-in relative shadow-2xl">
            
            {/* Header Cover Banner */}
            <div className="h-56 relative overflow-hidden bg-slate-900 shrink-0">
              <img 
                src={quickViewRestaurant.image} 
                alt={quickViewRestaurant.name}
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-black/10"></div>
              
              {/* Close Button overlay */}
              <button
                onClick={() => setQuickViewRestaurant(null)}
                className="absolute top-4 left-4 w-9 h-9 bg-black/60 text-white hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-left text-white">
                <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                  {quickViewRestaurant.cuisine}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm text-slate-100">{quickViewRestaurant.name}</h2>
                <p className="text-xs text-slate-200 line-clamp-1 mt-1 font-medium">{quickViewRestaurant.tagline}</p>
              </div>
            </div>

            {/* Quick Metadata Ribbons */}
            <div className="bg-surface border-b border-outline-variant px-6 py-3.5 flex flex-wrap gap-6 text-xs text-slate-500 font-semibold justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <Star size={14} className="text-amber-500 fill-amber-500" />
                <span className="text-on-background font-bold">{quickViewRestaurant.rating}</span>
                <span>({quickViewRestaurant.reviewsCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{quickViewRestaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={14} />
                <span>Min. Order: ${quickViewRestaurant.minOrder}</span>
              </div>
            </div>

            {/* Premium Tab Bar for Menu vs Contact/Address Details */}
            <div className="bg-white border-b border-outline-variant px-6 flex gap-6 shrink-0 z-10">
              <button
                onClick={() => setDrawerTab('menu')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  drawerTab === 'menu'
                    ? 'border-primary text-primary font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Utensils size={14} />
                Menu Dishes
              </button>
              <button
                onClick={() => setDrawerTab('about')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  drawerTab === 'about'
                    ? 'border-primary text-primary font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <MapPin size={14} />
                About & Contact
              </button>
            </div>

            {/* Main content body (Menu list left + Cart summary right on desktop) */}
            <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-outline-variant overflow-y-auto">
              
              {drawerTab === 'menu' ? (
                /* Menu List */
                <div className="flex-1 p-6 space-y-6 overflow-y-auto text-left">
                  <div>
                    <h3 className="font-extrabold text-base text-on-background">Explore Menu Dishes</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click "Add to Order" to simulate adding items to your demo checkout.</p>
                  </div>

                  <div className="space-y-4">
                    {quickViewRestaurant.menu.map((dish) => {
                      const cartQty = demoCart[dish.id]?.quantity || 0;
                      return (
                        <div 
                          key={dish.id} 
                          className="bg-white p-3.5 rounded-xl border border-outline-variant flex gap-4 hover:border-primary/30 transition-colors"
                        >
                          {/* Dish photo */}
                          <div className="w-16 h-16 rounded-lg bg-slate-50 overflow-hidden shrink-0">
                            <img 
                              src={dish.image} 
                              alt={dish.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          {/* Dish Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-xs md:text-sm text-on-background leading-snug">
                                  {dish.name}
                                </h4>
                                <span className="text-xs font-extrabold text-primary shrink-0">${dish.price.toFixed(2)}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{dish.description}</p>
                            </div>

                            {/* Quick controls */}
                            <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                              <span className="text-[9px] text-secondary font-bold tracking-wider uppercase">
                                {dish.popular ? '⭐ Best Seller' : ''}
                              </span>

                              <div className="flex items-center gap-2">
                                {cartQty > 0 ? (
                                  <div className="flex items-center bg-primary-container text-primary rounded-full px-2 py-0.5 gap-2 border border-primary/25">
                                    <button 
                                      onClick={() => removeFromCart(dish.id)}
                                      className="w-5 h-5 flex items-center justify-center text-xs font-black hover:opacity-75"
                                    >
                                      -
                                    </button>
                                    <span className="text-xs font-extrabold min-w-3 text-center">{cartQty}</span>
                                    <button 
                                      onClick={() => addToCart(dish)}
                                      className="w-5 h-5 flex items-center justify-center text-xs font-black hover:opacity-75"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart(dish)}
                                    className="text-[10px] font-bold bg-primary hover:bg-dark-teal text-white px-3 py-1.5 rounded-full transition-colors"
                                  >
                                    Add to Order
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* About & Contact Details Tab */
                <div className="flex-1 p-6 space-y-8 overflow-y-auto text-left bg-slate-50/50">
                  {/* Restaurant Bio/About section */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm text-on-background flex items-center gap-2 uppercase tracking-wider">
                      <ShieldCheck className="text-primary shrink-0" size={16} />
                      About the Restaurant
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {quickViewRestaurant.description || `Welcome to ${quickViewRestaurant.name}. We prepare delicious and authentic recipes with premium quality ingredients.`}
                    </p>
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-center gap-3">
                      <div className="p-2 bg-emerald-600/10 text-emerald-700 rounded-lg shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800">Approved Merchant Partner</p>
                        <p className="text-[10px] text-emerald-600/80">Approved and synchronized with active MongoDB clusters.</p>
                      </div>
                    </div>
                  </div>

                  {/* Address & Navigation Details */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm text-on-background flex items-center gap-2 uppercase tracking-wider">
                      <MapPin className="text-primary shrink-0" size={16} />
                      Location Details
                    </h3>
                    
                    <div className="bg-white p-4 rounded-xl border border-outline-variant space-y-3 shadow-xs">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">City</p>
                          <p className="font-semibold text-on-background mt-0.5">{quickViewRestaurant.address?.city || 'Beirut'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Street</p>
                          <p className="font-semibold text-on-background mt-0.5">{quickViewRestaurant.address?.street || 'Hamra Street'}</p>
                        </div>
                        <div className="pt-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Building</p>
                          <p className="font-semibold text-on-background mt-0.5">{quickViewRestaurant.address?.building || '12'}</p>
                        </div>
                        <div className="pt-1">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Floor / Unit</p>
                          <p className="font-semibold text-on-background mt-0.5">{quickViewRestaurant.address?.floor || '1st Floor'}</p>
                        </div>
                      </div>

                      {quickViewRestaurant.address?.locationUrl && (
                        <a 
                          href={quickViewRestaurant.address.locationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg border border-outline-variant transition-all cursor-pointer"
                        >
                          <ExternalLink size={13} />
                          Navigate via Google Maps
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="font-extrabold text-sm text-on-background flex items-center gap-2 uppercase tracking-wider">
                      <Phone className="text-primary shrink-0" size={16} />
                      Contact Hotline
                    </h3>
                    <div className="bg-white p-4 rounded-xl border border-outline-variant space-y-3 shadow-xs">
                      <div className="flex items-center gap-3 text-xs">
                        <Phone size={14} className="text-primary shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Direct Hotline</span>
                          <a href={`tel:${quickViewRestaurant.contact?.phone || '+96170111111'}`} className="font-semibold hover:underline text-primary">
                            {quickViewRestaurant.contact?.phone || '+96170111111'}
                          </a>
                        </div>
                      </div>
                      <div className="h-px bg-outline-variant"></div>
                      <div className="flex items-center gap-3 text-xs">
                        <Mail size={14} className="text-primary shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Inquiries Email</span>
                          <a href={`mailto:${quickViewRestaurant.contact?.email || 'pizza@restaurant.com'}`} className="font-semibold hover:underline text-primary">
                            {quickViewRestaurant.contact?.email || 'pizza@restaurant.com'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours list */}
                  <div className="space-y-3 pb-4">
                    <h3 className="font-extrabold text-sm text-on-background flex items-center gap-2 uppercase tracking-wider">
                      <Calendar className="text-primary shrink-0" size={16} />
                      Operating Schedule
                    </h3>
                    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-xs">
                      <table className="w-full text-left text-xs divide-y divide-outline-variant">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-2.5">Day</th>
                            <th className="px-4 py-2.5 text-right">Hours</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant font-medium text-slate-600">
                          {quickViewRestaurant.openingHours && quickViewRestaurant.openingHours.map((oh) => (
                            <tr key={oh.day} className="hover:bg-slate-50">
                              <td className="px-4 py-3">{oh.day}</td>
                              <td className="px-4 py-3 text-right">
                                {oh.isClosed ? (
                                  <span className="text-red-500 font-bold">Closed</span>
                                ) : (
                                  <span>{oh.openTime} - {oh.closeTime}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                          {(!quickViewRestaurant.openingHours || quickViewRestaurant.openingHours.length === 0) && (
                            <tr>
                              <td className="px-4 py-3">Monday - Sunday</td>
                              <td className="px-4 py-3 text-right">10:00 - 22:00</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Shopping Basket Summary Panel */}
              <div className="w-full md:w-64 bg-surface p-6 flex flex-col justify-between shrink-0 text-left">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-on-background flex items-center gap-1.5">
                      <ShoppingBag size={14} className="text-primary" />
                      Demo Order
                    </h3>
                    {getCartCount() > 0 && (
                      <button onClick={clearCart} className="text-[10px] text-slate-400 hover:text-red-500 font-semibold">
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="h-px bg-outline-variant"></div>

                  {getCartCount() === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                      <p className="text-xs">Your basket is empty.</p>
                      <p className="text-[10px]">Add dishes from the menu to build your meal.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 max-h-56 md:max-h-80 overflow-y-auto pr-1">
                      {Object.values(demoCart).map(({ item, quantity }) => (
                        <div key={item.id} className="flex justify-between items-start text-xs gap-3">
                          <div className="min-w-0">
                            <p className="font-bold text-on-background truncate leading-snug">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-primary">${(item.price * quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotals & Demo checkout CTA */}
                {getCartCount() > 0 && (
                  <div className="pt-6 border-t border-outline-variant mt-6 space-y-4">
                    <div className="space-y-2 text-xs text-slate-500 font-semibold">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-on-background">${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className="text-on-background">${quickViewRestaurant.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="h-px bg-outline-variant my-1"></div>
                      <div className="flex justify-between text-sm font-bold text-on-background">
                        <span>Total:</span>
                        <span className="text-primary">${(getCartTotal() + quickViewRestaurant.deliveryFee).toFixed(2)}</span>
                      </div>
                    </div>

                    {showCheckoutSuccess ? (
                      <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl border border-emerald-200 font-bold text-center flex items-center justify-center gap-2">
                        <Check size={16} /> Order Placed Successfully!
                      </div>
                    ) : (
                      <button
                        onClick={handleDemoCheckout}
                        className="w-full bg-primary hover:bg-dark-teal text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer text-center"
                      >
                        Confirm Demo Checkout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Filter Sheet Backdrop */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs justify-end">
          <div className="w-80 bg-white h-full p-6 overflow-y-auto flex flex-col justify-between animate-slide-in relative text-left">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-base text-on-background flex items-center gap-1.5 uppercase tracking-wider">
                  <SlidersHorizontal size={16} className="text-primary" /> Filter Options
                </h3>
                <button 
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="h-px bg-outline-variant"></div>

              {/* Price Level Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Price Range</h4>
                <div className="flex gap-2">
                  {[
                    { label: '$', val: 1 },
                    { label: '$$', val: 2 },
                    { label: '$$$', val: 3 }
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setSelectedPriceLevel(selectedPriceLevel === p.val ? null : p.val)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        selectedPriceLevel === p.val 
                          ? 'bg-primary border-primary text-white shadow-xs' 
                          : 'bg-white border-outline hover:border-primary text-secondary'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick switches */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Quick Filters</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={onlyFeatured}
                      onChange={(e) => setOnlyFeatured(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-primary border-outline accent-primary" 
                    />
                    <span className="text-xs font-medium text-secondary">Featured Partner</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={onlyHighlyRated}
                      onChange={(e) => setOnlyHighlyRated(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-primary border-outline accent-primary" 
                    />
                    <span className="text-xs font-medium text-secondary">Highly Rated (4.7+)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={onlyFreeDelivery}
                      onChange={(e) => setOnlyFreeDelivery(e.target.checked)}
                      className="w-4.5 h-4.5 rounded text-primary border-outline accent-primary" 
                    />
                    <span className="text-xs font-medium text-secondary">Free Delivery</span>
                  </label>
                </div>
              </div>

              {/* Sort By options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-secondary uppercase tracking-wider">Sort Restaurants</h4>
                <div className="space-y-1">
                  {[
                    { label: 'Highest Rated First', val: 'rating' },
                    { label: 'Fastest Delivery First', val: 'deliveryTime' },
                    { label: 'Most Reviewed First', val: 'reviews' }
                  ].map((option) => (
                    <button
                      key={option.val}
                      onClick={() => setSortBy(option.val as any)}
                      className={`w-full text-left py-2.5 px-3 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        sortBy === option.val 
                          ? 'bg-primary-container/40 text-primary font-bold' 
                          : 'text-secondary hover:bg-surface-container-low hover:text-on-background'
                      }`}
                    >
                      {option.label}
                      {sortBy === option.val && <Check size={14} className="text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-primary text-white text-xs font-bold py-3 rounded-full hover:bg-dark-teal transition-colors text-center"
            >
              Apply Filter Parameters
            </button>
          </div>
        </div>
      )}

      {/* Restaurant Registration Form Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-outline-variant shadow-2xl p-6 md:p-8 flex flex-col space-y-6 text-left relative my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {regSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary text-primary rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check size={36} className="stroke-[3]" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-on-background">Registered Successfully!</h3>
                  <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
                    Your restaurant <span className="font-extrabold text-primary">{regName}</span> has been securely written to the MongoDB database Atlas cluster in client-read mode!
                  </p>
                </div>
                
                {/* Simulated database transaction log */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-left font-mono text-[10px] text-emerald-400 max-w-md mx-auto space-y-1.5 shadow-md">
                  <p className="text-slate-500">// MongoDB Shell Transaction Log</p>
                  <p><span className="text-pink-500">connection</span>.connect("mongodb+srv://cluster0.resto.mongodb.net/production")</p>
                  <p><span className="text-pink-500">db</span>.restaurants.insertOne(&#123;</p>
                  <p className="pl-4">id: <span className="text-yellow-300">"resto-{Date.now()}"</span>,</p>
                  <p className="pl-4">name: <span className="text-yellow-300">"{regName}"</span>,</p>
                  <p className="pl-4">cuisine: <span className="text-yellow-300">"{regCuisine}"</span>,</p>
                  <p className="pl-4">rating: <span className="text-blue-300">4.8</span>,</p>
                  <p className="pl-4">location: <span className="text-yellow-300">"{regLocation}"</span>,</p>
                  <p className="pl-4">menu_items_count: <span className="text-blue-300">{regMenu.length}</span></p>
                  <p>&#125;)</p>
                  <p className="text-emerald-500 font-bold">» WriteResult(&#123; "nInserted" : 1 &#125;) - Success 201 Created</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-0.5"></span>
                    Mongo Database Register
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-on-background">
                    Add Your Restaurant
                  </h2>
                  <p className="text-xs text-secondary leading-relaxed">
                    Register your restaurant to receive customer orders. Your menu items will appear on the guest food delivery catalog immediately.
                  </p>
                </div>

                {regError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                    ⚠️ {regError}
                  </div>
                )}

                <form onSubmit={handleRegisterRestaurant} className="space-y-5">
                  {/* General Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700 block">Restaurant Name *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Bistro Paris"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-background focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700 block">Cuisine Category *</label>
                      <select 
                        value={regCuisine}
                        onChange={(e) => setRegCuisine(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-background focus:outline-hidden focus:border-primary focus:bg-white transition-all cursor-pointer"
                      >
                        {CUISINES.filter(c => c !== 'All').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Tagline & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700 block">Short Tagline Description</label>
                      <input 
                        type="text"
                        placeholder="e.g. Artisanal woodfired sourdough pizzas"
                        value={regTagline}
                        onChange={(e) => setRegTagline(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-background focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700 block">Street Location Address *</label>
                      <input 
                        type="text"
                        placeholder="e.g. Greenwood, Pine St 45"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-outline-variant rounded-xl px-3.5 py-2.5 text-xs text-on-background focus:outline-hidden focus:border-primary focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-outline-variant">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold text-secondary uppercase tracking-wide">Price Tier</label>
                      <select 
                        value={regPriceLevel} 
                        onChange={(e) => setRegPriceLevel(Number(e.target.value) as 1|2|3)}
                        className="w-full bg-white border border-outline-variant rounded-lg px-2 py-1.5 text-xs font-bold text-on-background"
                      >
                        <option value={1}>$ - Budget</option>
                        <option value={2}>$$ - Moderate</option>
                        <option value={3}>$$$ - Premium</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold text-secondary uppercase tracking-wide">Prep & Delivery</label>
                      <input 
                        type="text" 
                        value={regDeliveryTime}
                        onChange={(e) => setRegDeliveryTime(e.target.value)}
                        className="w-full bg-white border border-outline-variant rounded-lg px-2 py-1.5 text-xs text-on-background"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold text-secondary uppercase tracking-wide">Min Order ($)</label>
                      <input 
                        type="number" 
                        value={regMinOrder}
                        onChange={(e) => setRegMinOrder(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-outline-variant rounded-lg px-2 py-1.5 text-xs text-on-background"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold text-secondary uppercase tracking-wide">Deliv. Fee ($)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={regDeliveryFee}
                        onChange={(e) => setRegDeliveryFee(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-outline-variant rounded-lg px-2 py-1.5 text-xs text-on-background"
                      />
                    </div>
                  </div>

                  {/* Cover Image Preset Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block text-left">Choose cover banner photo</label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
                      {[
                        { title: 'Burgers', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' },
                        { title: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
                        { title: 'Sushi', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop' },
                        { title: 'Salads', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop' },
                        { title: 'Pastry', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
                        { title: 'Steakhouse', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop' }
                      ].map((preset) => (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() => setRegImage(preset.url)}
                          className={`group flex flex-col items-center bg-slate-50 border rounded-xl overflow-hidden hover:scale-[1.03] transition-all relative ${
                            regImage === preset.url ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-outline-variant'
                          }`}
                        >
                          <div className="h-10 w-full bg-slate-200 overflow-hidden relative">
                            <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            {regImage === preset.url && (
                              <div className="absolute inset-0 bg-primary/35 flex items-center justify-center text-white">
                                <Check size={12} className="stroke-[3]" />
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 py-1">{preset.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Dishes form subsection */}
                  <div className="space-y-3 pt-4 border-t border-outline-variant">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider block text-left">
                      Add Dishes to Restaurant Menu ({regMenu.length})
                    </h3>

                    {/* Added dishes tags */}
                    <div className="flex flex-wrap gap-2">
                      {regMenu.map((item, index) => (
                        <span 
                          key={item.id} 
                          className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-bold px-2.5 py-1 rounded-full border border-secondary/30 shadow-2xs"
                        >
                          {item.name} (${item.price.toFixed(2)})
                          {regMenu.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => handleRemoveCustomDish(item.id)}
                              className="text-primary-foreground hover:text-red-500 rounded-full"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Miniature Add Dish Form inline */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-outline-variant flex flex-col gap-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2 text-left">
                          <input 
                            type="text" 
                            placeholder="Dish name (e.g. Sizzling Salmon)"
                            value={customDishName}
                            onChange={(e) => setCustomDishName(e.target.value)}
                            className="w-full bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-background focus:outline-hidden"
                          />
                        </div>
                        <div className="text-left">
                          <input 
                            type="number" 
                            step="0.01"
                            placeholder="Price ($)"
                            value={customDishPrice}
                            onChange={(e) => setCustomDishPrice(e.target.value)}
                            className="w-full bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-background focus:outline-hidden"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCustomDish}
                          className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold text-xs py-1.5 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          + Add Dish
                        </button>
                      </div>
                      <div className="text-left">
                        <input 
                          type="text" 
                          placeholder="Dish short description (e.g. pan-seared with microgreens & lemon butter)"
                          value={customDishDesc}
                          onChange={(e) => setCustomDishDesc(e.target.value)}
                          className="w-full bg-white border border-outline-variant rounded-lg px-2.5 py-1.5 text-xs text-on-background focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission and Action buttons */}
                  <div className="pt-4 border-t border-outline-variant flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setIsRegisterModalOpen(false)}
                      className="px-4 py-2.5 border border-outline text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-dark-teal text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={14} /> Register & Deploy to Mongo Database
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer (Reused identical style) */}
      <footer className="bg-on-background text-white pt-16 pb-10 px-4 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6 text-left">
              <Link to="/" className="text-xl font-bold text-primary block">
                RestoManager
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Empowering the culinary world with professional tools that bridge the gap between passion and profitability.
              </p>
              <div className="flex gap-4">
                <a className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-white" href="#" aria-label="Website">
                  <span className="text-xs">🌐</span>
                </a>
                <a className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors text-white" href="#" aria-label="Share">
                  <span className="text-xs">🔗</span>
                </a>
              </div>
            </div>

            <div className="text-left">
              <h5 className="text-sm font-bold text-white mb-6">Product</h5>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li><Link to="/register" className="hover:text-white transition-colors">Order Management</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Menu Builder</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">POS Integration</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Analytics</Link></li>
              </ul>
            </div>

            <div className="text-left">
              <h5 className="text-sm font-bold text-white mb-6">Company</h5>
              <ul className="space-y-4 text-xs font-medium text-slate-400">
                <li><a className="hover:text-white transition-colors" href="/#about">About Us</a></li>
                <li><a className="hover:text-white transition-colors" href="/#features">Careers</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Privacy Policy</a></li>
                <li><a className="hover:text-white transition-colors" href="#">Terms of Service</a></li>
              </ul>
            </div>

            <div className="text-left space-y-4">
              <h5 className="text-sm font-bold text-white">Stay Updated</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get the latest restaurant management insights delivered weekly.
              </p>
              <div className="p-3 bg-primary-container/20 text-primary-container text-xs rounded-lg font-medium flex items-center gap-2 border border-primary/20">
                <Check size={14} /> Newsletter active!
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-8 text-xs text-slate-400 font-medium">
              <a className="hover:text-white transition-colors" href="#">Help Center</a>
              <a className="hover:text-white transition-colors" href="#">Support</a>
              <a className="hover:text-white transition-colors" href="#">API Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantListingPage;

