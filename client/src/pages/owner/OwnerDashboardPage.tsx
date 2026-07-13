import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  Smile,
  Frown,
  ChevronDown,
  Calendar,
  Bell,
  Search,
  Edit,
  Trash2,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  UtensilsCrossed,
  LogOut,
  RefreshCw,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- TS INTERFACES ---
export interface Review {
  id: string;
  customerName: string;
  avatar: string;
  date: string;
  timestamp: number; // unix timestamp for strict sorting
  tableNo: string;
  rating: number;
  text: string;
  foodRating: number;
  serviceRating: number;
  ambienceRating: number;
  dishName: string;
  dishImage: string;
  status: 'Replied' | 'Pending Reply';
  replyText?: string;
  replyDate?: string;
  diningType: 'Dine-in' | 'Takeaway' | 'Delivery';
}

export interface RestaurantProfile {
  name: string;
  ownerName: string;
  logo: string;
  avatar: string;
  cuisine: string;
  location: string;
}

interface OwnerDashboardPageProps {
  userEmail?: string | null;
  onLogout?: () => void;
}

// --- SAMPLE DATA GENERATION ---
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Priya Mehta',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    date: '2 days ago',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #4',
    rating: 5,
    text: 'Excellent ambience, delicious food and great service. The creamy pesto pasta and tiramisu were outstanding! Will definitely visit again with my family. Highly recommend the outdoor patio seating.',
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    dishName: 'Creamy Pesto Pasta',
    dishImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80',
    status: 'Replied',
    replyText: 'Thank you so much Priya! We are absolutely thrilled you loved the pesto pasta and tiramisu. Our kitchen team takes great pride in crafting fresh pasta daily. Looking forward to hosting you and your family again soon!',
    replyDate: '1 day ago',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-2',
    customerName: 'Amit Verma',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    date: '3 days ago',
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #12',
    rating: 4,
    text: 'Good food and quick delivery. Packaging was neat and clean. The garlic bread was slightly cold upon arrival, but the sourdough margherita pizza was absolutely stellar. Crispy crust and generous cheese!',
    foodRating: 4,
    serviceRating: 4,
    ambienceRating: 4,
    dishName: 'Sourdough Margherita Pizza',
    dishImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80',
    status: 'Replied',
    replyText: 'Thanks for the review, Amit! We appreciate the feedback on our sourdough crust. We will coordinate with our delivery partners to optimize transit bags so the garlic bread reaches you piping hot!',
    replyDate: '2 days ago',
    diningType: 'Delivery'
  },
  {
    id: 'rev-3',
    customerName: 'Sneha Kapoor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: '4 days ago',
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #8',
    rating: 2,
    text: 'Food was average. We had to wait too long for our table even with a reservation. The server was polite, but the kitchen seemed extremely disorganized tonight. The Caesar salad was decent but had way too much dressing.',
    foodRating: 2,
    serviceRating: 3,
    ambienceRating: 3,
    dishName: 'Caesar Salad Supreme',
    dishImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80',
    status: 'Pending Reply',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-4',
    customerName: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    date: '5 days ago',
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #2',
    rating: 5,
    text: 'One of the best restaurants in the city! The Double Truffle Burger is out of this world. Perfectly juicy patties, rich truffle aioli, and crispy fries. Elegant atmosphere and rapid service.',
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    dishName: 'Double Truffle Burger',
    dishImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    status: 'Replied',
    replyText: 'Wow, thank you Vikram! Our Double Truffle Burger is indeed a signature item that we cook with extreme precision. We are honored by your praise and can’t wait to serve you again.',
    replyDate: '4 days ago',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-5',
    customerName: 'Rajesh Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    date: '1 week ago',
    timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #9',
    rating: 5,
    text: 'Amazing experience! The ambiance is cozy, and the staff is super attentive. We tried the molten chocolate lava cake for dessert, and it was pure bliss. Melted center was perfect.',
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    dishName: 'Molten Lava Cake',
    dishImage: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
    status: 'Pending Reply',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-6',
    customerName: 'Neha Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    date: '1 week ago',
    timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000,
    tableNo: 'N/A (Takeaway)',
    rating: 1,
    text: 'Extremely disappointed. I ordered takeaway, and they completely forgot my drinks. The burger bun was soggy by the time I got home, and the fries were totally unsalted. Not worth the high price at all.',
    foodRating: 1,
    serviceRating: 1,
    ambienceRating: 2,
    dishName: 'Double Truffle Burger',
    dishImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    status: 'Pending Reply',
    diningType: 'Takeaway'
  },
  {
    id: 'rev-7',
    customerName: 'Rohan Gupta',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    date: '1 week ago',
    timestamp: Date.now() - 9 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #6',
    rating: 4,
    text: 'Nice cozy place with wonderful acoustic background music. The service is fast and friendly. Sourdough pizza crust was crisp and flavorful. Could use slightly more basil leaves, but overall very good.',
    foodRating: 4,
    serviceRating: 5,
    ambienceRating: 4,
    dishName: 'Sourdough Margherita Pizza',
    dishImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80',
    status: 'Replied',
    replyText: 'Thanks Rohan! We love our live acoustics on weekends too. Next time you order, let your server know and we will throw on extra fresh organic basil for you!',
    replyDate: '6 days ago',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-8',
    customerName: 'Anjali Desai',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?w=150&auto=format&fit=crop&q=80',
    date: '2 weeks ago',
    timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #15',
    rating: 5,
    text: 'Perfect evening! The outdoor patio seating is beautiful with warm string lights. The signature mocktails are balanced, and the pesto pasta is fresh and handmade. Our server went above and beyond.',
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    dishName: 'Creamy Pesto Pasta',
    dishImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80',
    status: 'Replied',
    replyText: 'Thank you Anjali! We are thrilled our patio lighting and handmade pasta hit the spot. We will pass on your compliments to your server, who will be delighted to hear this!',
    replyDate: '12 days ago',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-9',
    customerName: 'Kabir Malhotra',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    date: '2 weeks ago',
    timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #11',
    rating: 3,
    text: 'Average food but excellent service. The staff offered us free mocktails because our table wasn’t ready on time, which was very kind of them. The truffle fries were great, but the burger was slightly overcooked.',
    foodRating: 3,
    serviceRating: 5,
    ambienceRating: 4,
    dishName: 'Double Truffle Burger',
    dishImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    status: 'Pending Reply',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-10',
    customerName: 'Meera Nair',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    date: '3 weeks ago',
    timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #5',
    rating: 5,
    text: 'Sensational! Truly a masterpiece of dining. Every single bite of the creamy pesto pasta was a beautiful symphony of flavors. Handled by a master chef. A must-visit place for true foodies.',
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    dishName: 'Creamy Pesto Pasta',
    dishImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80',
    status: 'Replied',
    replyText: 'Wow, Meera! We are extremely honored by your review. Chef Marco was beaming with joy when we shared this feedback with him. We hope to delight you with more culinary masterpieces next time!',
    replyDate: '20 days ago',
    diningType: 'Dine-in'
  },
  {
    id: 'rev-11',
    customerName: 'Arjun Reddy',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&auto=format&fit=crop&q=80',
    date: '4 weeks ago',
    timestamp: Date.now() - 28 * 24 * 60 * 60 * 1000,
    tableNo: 'Table #7',
    rating: 2,
    text: 'Not a great experience. The music was way too loud to have a normal conversation, and the pasta was incredibly salty. The staff tried their best, but they were clearly severely understaffed.',
    foodRating: 2,
    serviceRating: 3,
    ambienceRating: 1,
    dishName: 'Creamy Pesto Pasta',
    dishImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80',
    status: 'Pending Reply',
    diningType: 'Dine-in'
  }
];

// --- REAL TRENDING DATA OVER THE LAST MONTH FOR RECHARTS ---
const CHART_TREND_DATA = [
  { date: 'May 15', score: 4.4 },
  { date: 'May 18', score: 4.5 },
  { date: 'May 20', score: 4.3 },
  { date: 'May 22', score: 4.5 },
  { date: 'May 25', score: 4.6 },
  { date: 'May 28', score: 4.4 },
  { date: 'May 30', score: 4.5 },
  { date: 'Jun 02', score: 4.6 },
  { date: 'Jun 05', score: 4.7 },
  { date: 'Jun 08', score: 4.5 },
  { date: 'Jun 10', score: 4.6 },
  { date: 'Jun 12', score: 4.6 },
  { date: 'Jun 13', score: 4.7 }
];

export const OwnerDashboardPage: React.FC<OwnerDashboardPageProps> = ({
  onLogout,
}) => {
  // --- STATE ---
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('resto_reviews_list');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile>(() => {
    const saved = localStorage.getItem('resto_business_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'The Gourmet Kitchen' || parsed.name === 'RestoManager') {
          parsed.name = 'Amber Bistro';
          localStorage.setItem('resto_business_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        // Fallback on parse error
      }
    }
    return {
      name: 'Amber Bistro',
      ownerName: 'Rohit Sharma',
      logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=150&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      cuisine: 'Modern Italian & Artisan Burgers',
      location: 'Connaught Place, New Delhi'
    };
  });

  const [selectedTab, setSelectedTab] = useState<'All' | 'Replied' | 'Unreplied'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'Newest' | 'Highest' | 'Lowest' | 'Critical'>('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals / Dropdowns
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const [selectedDiningFilter, setSelectedDiningFilter] = useState<'Dine-in' | 'Takeaway' | 'Delivery' | null>(null);

  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string } | null>(null);

  // New review form fields
  const [newCustName, setNewCustName] = useState('');
  const [newCustRating, setNewCustRating] = useState(5);
  const [newCustText, setNewCustText] = useState('');
  const [newFoodScore, setNewFoodScore] = useState(5);
  const [newServiceScore, setNewServiceScore] = useState(5);
  const [newAmbienceScore, setNewAmbienceScore] = useState(5);
  const [newDiningType, setNewDiningType] = useState<'Dine-in' | 'Takeaway' | 'Delivery'>('Dine-in');
  const [newDishName, setNewDishName] = useState('Creamy Pesto Pasta');

  const dishOptions = [
    { name: 'Creamy Pesto Pasta', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80' },
    { name: 'Sourdough Margherita Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80' },
    { name: 'Double Truffle Burger', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80' },
    { name: 'Caesar Salad Supreme', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80' },
    { name: 'Molten Lava Cake', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80' }
  ];

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('resto_reviews_list', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('resto_business_profile', JSON.stringify(restaurantProfile));
  }, [restaurantProfile]);

  // --- DERIVED METRICS ---
  const totalReviewsCount = 324 + (reviews.length - INITIAL_REVIEWS.length);

  // Recalculate average rating based on original 4.6 scaling + new additions
  const averageRating = useMemo(() => {
    const sumOriginal = INITIAL_REVIEWS.reduce((acc, r) => acc + r.rating, 0);
    const addedReviews = reviews.filter(r => !INITIAL_REVIEWS.some(init => init.id === r.id));
    const sumAdded = addedReviews.reduce((acc, r) => acc + r.rating, 0);
    const totalCount = INITIAL_REVIEWS.length + addedReviews.length;
    
    // Scale proportionally to match the photo metric 4.6 (which is our base rating)
    const baseScale = 4.6;
    if (addedReviews.length === 0) return baseScale;
    
    const avg = (sumOriginal + sumAdded) / totalCount;
    // Keep it realistic around 4.5 - 4.8
    return Math.min(5.0, Math.max(1.0, parseFloat(avg.toFixed(1))));
  }, [reviews]);

  // Positive rating percentage calculation
  const { positiveCount, negativeCount, positivePercent, negativePercent } = useMemo(() => {
    // 4 and 5 stars are positive, 1 and 2 stars are negative, 3 is neutral
    const originalPositives = 268;
    const originalNegatives = 56;
    
    const addedReviews = reviews.filter(r => !INITIAL_REVIEWS.some(init => init.id === r.id));
    let posAdded = 0;
    let negAdded = 0;
    
    addedReviews.forEach(r => {
      if (r.rating >= 4) posAdded++;
      else if (r.rating <= 2) negAdded++;
    });

    const finalPos = originalPositives + posAdded;
    const finalNeg = originalNegatives + negAdded;
    const finalTotal = totalReviewsCount;

    const posPct = parseFloat(((finalPos / finalTotal) * 100).toFixed(1));
    const negPct = parseFloat(((finalNeg / finalTotal) * 100).toFixed(1));

    return {
      positiveCount: finalPos,
      negativeCount: finalNeg,
      positivePercent: posPct,
      negativePercent: negPct
    };
  }, [reviews, totalReviewsCount]);

  // Distribution chart numbers (5, 4, 3, 2, 1 stars)
  const distributionCounts = useMemo(() => {
    // Base values from screenshot
    const base = {
      5: 166,
      4: 63,
      3: 34,
      2: 12,
      1: 10
    };

    const addedReviews = reviews.filter(r => !INITIAL_REVIEWS.some(init => init.id === r.id));
    addedReviews.forEach(r => {
      const rate = r.rating as 5 | 4 | 3 | 2 | 1;
      if (base[rate] !== undefined) {
        base[rate]++;
      }
    });

    const total = base[5] + base[4] + base[3] + base[2] + base[1];
    
    return [
      { stars: 5, count: base[5], percentage: Math.round((base[5] / total) * 100) },
      { stars: 4, count: base[4], percentage: Math.round((base[4] / total) * 100) },
      { stars: 3, count: base[3], percentage: Math.round((base[3] / total) * 100) },
      { stars: 2, count: base[2], percentage: Math.round((base[2] / total) * 100) },
      { stars: 1, count: base[1], percentage: Math.round((base[1] / total) * 100) }
    ];
  }, [reviews]);

  // Response Rate calculation
  const responseRate = useMemo(() => {
    const totalReplied = reviews.filter(r => r.status === 'Replied').length;
    const rate = Math.round((totalReplied / reviews.length) * 100);
    return Math.min(100, Math.max(0, rate));
  }, [reviews]);

  // --- SEARCH, SORT, FILTER LOGIC ---
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // 1. Tab Status Filter
    if (selectedTab === 'Replied') {
      result = result.filter(r => r.status === 'Replied');
    } else if (selectedTab === 'Unreplied') {
      result = result.filter(r => r.status === 'Pending Reply');
    }

    // 2. Rating Star Filter (from Advanced Filters modal)
    if (selectedRatingFilter !== null) {
      result = result.filter(r => r.rating === selectedRatingFilter);
    }

    // 3. Dining Type Filter
    if (selectedDiningFilter !== null) {
      result = result.filter(r => r.diningType === selectedDiningFilter);
    }

    // 4. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.customerName.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q) ||
        r.dishName.toLowerCase().includes(q) ||
        (r.replyText && r.replyText.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    if (sortOption === 'Newest') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortOption === 'Highest') {
      result.sort((a, b) => b.rating - a.rating || b.timestamp - a.timestamp);
    } else if (sortOption === 'Lowest') {
      result.sort((a, b) => a.rating - b.rating || b.timestamp - a.timestamp);
    } else if (sortOption === 'Critical') {
      // 1 & 2 stars first, then sorted by newest
      result.sort((a, b) => {
        const aCrit = a.rating <= 2 ? 1 : 0;
        const bCrit = b.rating <= 2 ? 1 : 0;
        if (aCrit !== bCrit) return bCrit - aCrit;
        return b.timestamp - a.timestamp;
      });
    }

    return result;
  }, [reviews, selectedTab, selectedRatingFilter, selectedDiningFilter, searchQuery, sortOption]);

  // Paginated chunk
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchQuery, sortOption, selectedRatingFilter, selectedDiningFilter]);

  // --- HANDLERS ---
  const handleAddReply = (id: string) => {
    if (!replyInput.trim()) return;
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Replied',
          replyText: replyInput.trim(),
          replyDate: 'Just now'
        };
      }
      return r;
    }));
    setReplyInput('');
    setReplyingToId(null);
  };

  const handleEditReply = (id: string, currentText: string) => {
    setEditingReplyId(id);
    setEditInput(currentText);
  };

  const handleSaveEditReply = (id: string) => {
    if (!editInput.trim()) return;
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          replyText: editInput.trim(),
          replyDate: 'Edited just now'
        };
      }
      return r;
    }));
    setEditingReplyId(null);
    setEditInput('');
  };

  const handleDeleteReply = (id: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Pending Reply',
          replyText: undefined,
          replyDate: undefined
        };
      }
      return r;
    }));
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Are you sure you want to flag and delete this review from your active dashboard?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSimulateNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustText.trim()) {
      alert('Please fill out customer name and review text!');
      return;
    }

    const matchedDish = dishOptions.find(d => d.name === newDishName) || dishOptions[0];

    const generatedReview: Review = {
      id: `rev-sim-${Date.now()}`,
      customerName: newCustName.trim(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(newCustName)}`,
      date: 'Just now',
      timestamp: Date.now(),
      tableNo: newDiningType === 'Dine-in' ? `Table #${Math.floor(Math.random() * 16) + 1}` : 'N/A',
      rating: newCustRating,
      text: newCustText.trim(),
      foodRating: newFoodScore,
      serviceRating: newServiceScore,
      ambienceRating: newAmbienceScore,
      dishName: matchedDish.name,
      dishImage: matchedDish.image,
      status: 'Pending Reply',
      diningType: newDiningType
    };

    setReviews(prev => [generatedReview, ...prev]);
    setIsSimulationOpen(false);

    // Reset fields
    setNewCustName('');
    setNewCustText('');
    setNewCustRating(5);
    setNewFoodScore(5);
    setNewServiceScore(5);
    setNewAmbienceScore(5);
  };

  const handleResetDemoData = () => {
    if (confirm('Do you want to reset all custom replies, custom simulated reviews, and profile fields back to the original layout preset?')) {
      localStorage.removeItem('resto_reviews_list');
      localStorage.removeItem('resto_business_profile');
      setReviews(INITIAL_REVIEWS);
      setRestaurantProfile({
        name: 'Amber Bistro',
        ownerName: 'Rohit Sharma',
        logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=150&auto=format&fit=crop&q=80',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        cuisine: 'Modern Italian & Artisan Burgers',
        location: 'Connaught Place, New Delhi'
      });
      setSelectedTab('All');
      setSearchQuery('');
      setSortOption('Newest');
      setSelectedRatingFilter(null);
      setSelectedDiningFilter(null);
      alert('Demo successfully re-initialized!');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileOpen(false);
  };

  return (
    <div className="bg-background min-h-screen w-full font-sans text-slate-800 antialiased overflow-x-hidden">
      
      {/* --- MAIN PAGE VIEW --- */}
      <div className="flex flex-col min-w-0 min-h-screen">
        
        {/* TOP HEADER / NAVBAR (MINIMAL SAAS DESIGN WITH COMPREHENSIVE ACTIONS) */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Elegant logo mark */}
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-sm shadow-primary/20">
              <UtensilsCrossed className="w-5.5 h-5.5 font-bold" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                {restaurantProfile.name}
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                  <Award className="w-3 h-3 text-primary" /> Platinum Merchant
                </span>
              </h1>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 hidden sm:block">
                View sentiment distribution curves, log response rates, and reply in real-time.
              </p>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Quick Simulation Trigger */}
            <button
              onClick={() => setIsSimulationOpen(true)}
              className="h-10 px-3 bg-primary hover:bg-primary/90 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden md:inline">Simulate Review</span>
            </button>

            {/* Date Picker Button (Static Visual preset) */}
            <div className="relative">
              <button
                onClick={() => alert('Date filter configured: May 15, 2024 - Jun 13, 2024. Click Reset Data if you wish to wipe metrics.')}
                className="h-10 px-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-[11px]">May 15 - Jun 13</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Reset Sample Data Button */}
            <button
              onClick={handleResetDemoData}
              title="Reset Sample Data"
              className="h-10 px-3 bg-slate-50 hover:bg-secondary hover:text-secondary-foreground text-slate-500 text-xs font-bold rounded-xl border border-slate-200/50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Data</span>
            </button>

            {/* Notification Bell Icon */}
            <button
              onClick={() => alert('No new review alerts currently. Live socket is listening.')}
              className="h-10 w-10 bg-slate-50 hover:bg-slate-100/70 text-slate-500 hover:text-slate-800 rounded-xl transition-all flex items-center justify-center relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>

            {/* Owner Avatar Selector button with quick logout action */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 cursor-pointer group"
                title="Edit Restaurant Information"
              >
                <img
                  src={restaurantProfile.avatar}
                  alt={restaurantProfile.ownerName}
                  className="w-8.5 h-8.5 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all"
                />
                <div className="text-left hidden lg:block">
                  <p className="text-[11px] font-black text-slate-800 leading-none group-hover:text-primary transition-all">
                    {restaurantProfile.ownerName}
                  </p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Console Owner</span>
                </div>
              </div>

              <button
                onClick={() => onLogout?.()}
                title="Exit Console"
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer ml-1"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </header>

        {/* --- MAIN INTERACTIVE CONTAINER --- */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* --- STATISTICS CARDS (4 CARDS GRID) --- */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Reviews */}
            <div className="bg-white border border-slate-100/70 p-5 rounded-2xl shadow-sm flex items-center justify-between text-left hover:translate-y-[-2px] transition-all duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Total Reviews</span>
                <p className="text-2xl font-black text-slate-900 leading-none">{totalReviewsCount}</p>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">All time count</span>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare className="w-4.5 h-4.5 fill-blue-50" />
              </div>
            </div>

            {/* Card 2: Average Rating */}
            <div className="bg-white border border-slate-100/70 p-5 rounded-2xl shadow-sm flex items-center justify-between text-left hover:translate-y-[-2px] transition-all duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Average Rating</span>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-slate-900 leading-none">{averageRating}</p>
                  <span className="text-xs text-slate-400 font-bold">/ 5</span>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(averageRating)
                          ? 'text-[#F59E0B] fill-[#F59E0B]'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center shrink-0">
                <Star className="w-4.5 h-4.5 fill-secondary" />
              </div>
            </div>

            {/* Card 3: Positive Reviews */}
            <div className="bg-white border border-slate-100/70 p-5 rounded-2xl shadow-sm flex items-center justify-between text-left hover:translate-y-[-2px] transition-all duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Positive Reviews</span>
                <p className="text-2xl font-black text-slate-900 leading-none">{positiveCount}</p>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  {positivePercent}% satisfied
                </span>
              </div>
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <Smile className="w-4.5 h-4.5 fill-emerald-50" />
              </div>
            </div>

            {/* Card 4: Negative Reviews */}
            <div className="bg-white border border-slate-100/70 p-5 rounded-2xl shadow-sm flex items-center justify-between text-left hover:translate-y-[-2px] transition-all duration-200">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Negative Reviews</span>
                <p className="text-2xl font-black text-red-600 leading-none">{negativeCount}</p>
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  {negativePercent}% critical
                </span>
              </div>
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <Frown className="w-4.5 h-4.5 fill-red-50" />
              </div>
            </div>

          </section>

          {/* --- DOUBLE COLUMN GRID (OVERVIEW & TREND CHARTS) --- */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* COLUMN LEFT: Rating Overview Distribution (40%) */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs lg:col-span-5 text-left flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Rating Overview</h3>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Horizontal distribution of client feedback satisfaction scores</p>
              </div>

              {/* Progress Bars with Framer Motion entry */}
              <div className="space-y-4">
                {distributionCounts.map((item) => (
                  <div key={item.stars} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-1">
                        <span>{item.stars} Stars</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: item.stars }).map((_, idx) => (
                            <Star key={idx} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <span className="text-slate-700">
                        {item.count} reviews <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Action summary info widget */}
              <div className="p-3.5 bg-accent/40 rounded-xl border border-accent text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <Sparkles className="w-4 h-4 fill-accent" />
                  <span>Interactive Sentiment Insight</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {averageRating >= 4.5 ? (
                    `Your restaurant holds an excellent average of ${averageRating} stars. Response rate stands strong at ${responseRate}% which builds high customer trust!`
                  ) : (
                    `Your current average rating is ${averageRating}. Consider targeting critical 1 and 2 star reviews with fast responses to improve loyalty.`
                  )}
                </p>
              </div>
            </div>

            {/* COLUMN RIGHT: Rating Trend Timeline Line Chart (60%) */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs lg:col-span-7 text-left flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Rating Trend</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Sentiment timeline evolution over the last 30 days</p>
                </div>
                <span className="text-[10px] font-black text-secondary-foreground bg-secondary px-2.5 py-1 rounded-lg">
                  Daily Timeline
                </span>
              </div>

              {/* Recharts Container */}
              <div className="w-full h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CHART_TREND_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="yellowGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#008a66" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#008a66" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={10}
                      fontWeight="600"
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[3.5, 5.0]}
                      ticks={[3.5, 4.0, 4.5, 5.0]}
                      stroke="#94a3b8"
                      fontSize={10}
                      fontWeight="600"
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '11px',
                        fontFamily: 'sans-serif'
                      }}
                      labelStyle={{ fontWeight: 'bold', color: '#008a66' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#008a66"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#008a66', strokeWidth: 2, fill: '#fff' }}
                      activeDot={{ r: 6, fill: '#008a66' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold border-t border-slate-50 pt-3 mt-2">
                <span>Timeline Span: May 15 — Jun 13</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Sentiment is Upwards (+3.1% this week)
                </span>
              </div>
            </div>

          </section>

          {/* --- BOTTOM SECTION: COMPREHENSIVE INTERACTIVE REVIEW LIST --- */}
          <section className="bg-white border border-slate-100 rounded-2xl shadow-xs p-4 sm:p-6 text-left">
            
            {/* Header, Search, Sorting, and Tabs row */}
            <div className="flex flex-col space-y-4 border-b border-slate-100 pb-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">All Reviews</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Filter, examine, reply, and manage active customer testimonials</p>
                </div>

                {/* Simulated action status or filters indicator */}
                {(selectedRatingFilter !== null || selectedDiningFilter !== null) && (
                  <button
                    onClick={() => {
                      setSelectedRatingFilter(null);
                      setSelectedDiningFilter(null);
                    }}
                    className="self-start text-[10px] font-extrabold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-red-100/70 transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear Advanced Filters</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* 1. All/Replied/Unreplied tabs */}
                <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl w-fit">
                  {(['All', 'Replied', 'Unreplied'] as const).map((tab) => {
                    const countMap = {
                      All: reviews.length,
                      Replied: reviews.filter(r => r.status === 'Replied').length,
                      Unreplied: reviews.filter(r => r.status === 'Pending Reply').length
                    };

                    return (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedTab === tab
                            ? 'bg-white text-slate-900 shadow-xs border border-slate-100'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <span>{tab}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          selectedTab === tab ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/50 text-slate-500'
                        }`}>
                          {countMap[tab]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. Interactive Search & Sort */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Search box */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search customer, dish, or text..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-10 pl-9 pr-4 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-slate-300 rounded-xl text-xs font-semibold focus:outline-none transition-all w-full sm:w-56"
                    />
                  </div>

                  {/* Rating Filters Trigger */}
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="h-10 px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer relative"
                  >
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span>Filter</span>
                    {isFilterDropdownOpen && (
                      <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-lg p-3 w-52 z-30 space-y-3.5 text-left">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">By Star Rating</div>
                          <div className="flex flex-wrap gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRatingFilter(selectedRatingFilter === star ? null : star);
                                }}
                                className={`px-2 py-1 text-xs rounded-lg font-bold flex items-center gap-0.5 ${
                                  selectedRatingFilter === star
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                                }`}
                              >
                                {star} <Star className="w-3 h-3 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">By Dining Type</div>
                          <div className="flex flex-col gap-1">
                            {(['Dine-in', 'Takeaway', 'Delivery'] as const).map((t) => (
                              <button
                                key={t}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDiningFilter(selectedDiningFilter === t ? null : t);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg font-bold ${
                                  selectedDiningFilter === t
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Sort order Selector */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-3.5 py-1 rounded-xl">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">Sort:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Newest">Newest First</option>
                      <option value="Highest">Highest Star</option>
                      <option value="Lowest">Lowest Star</option>
                      <option value="Critical">Critical (1-2★)</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>

            {/* LIVE FEED REVIEWS CARDS */}
            <div className="divide-y divide-slate-100">
              {paginatedReviews.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-slate-500 font-bold text-sm">No reviews match your filter parameters.</p>
                  <p className="text-slate-400 text-xs">Try clearing search phrases or reset filters to see your reviews.</p>
                </div>
              ) : (
                paginatedReviews.map((rev) => (
                  <motion.div
                    key={rev.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="py-6 flex flex-col md:flex-row items-start gap-5 hover:bg-slate-50/40 px-2 rounded-2xl transition-all duration-200"
                  >
                    
                    {/* 1. Profile Avatar & Basic Info */}
                    <div className="w-full md:w-44 shrink-0 flex items-start gap-3 md:flex-col md:gap-2.5 text-left">
                      <img
                        src={rev.avatar}
                        alt={rev.customerName}
                        className="w-12 h-12 rounded-full object-cover bg-slate-100 border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          {rev.customerName}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] text-slate-400 font-extrabold">{rev.date}</span>
                          <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                            {rev.diningType}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">
                          {rev.tableNo}
                        </span>
                      </div>
                    </div>

                    {/* 2. Review stars & comments body text */}
                    <div className="flex-1 text-left space-y-3">
                      
                      {/* Star rating bar and sub-scores info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                        {/* Core Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <Star
                              key={st}
                              className={`w-3.5 h-3.5 ${
                                st <= rev.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Split detailed ratings */}
                        <div className="flex items-center gap-3 text-[9px] text-slate-400 font-black uppercase tracking-wider bg-slate-50/75 px-3 py-1 rounded-lg border border-slate-100/50 w-fit">
                          <span>Food: <span className="text-slate-700">{rev.foodRating}</span></span>
                          <span>Service: <span className="text-slate-700">{rev.serviceRating}</span></span>
                          <span>Ambience: <span className="text-slate-700">{rev.ambienceRating}</span></span>
                        </div>
                      </div>

                      {/* Main text */}
                      <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                        {rev.text}
                      </p>

                      {/* OWNERS REPLY (IF EXISTS) */}
                      {rev.status === 'Replied' && rev.replyText && (
                        <div className="bg-slate-50 border-l-4 border-primary p-4 rounded-r-2xl rounded-bl-2xl space-y-1.5 relative group/reply text-left mt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Response from {restaurantProfile.name}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold">• {rev.replyDate}</span>
                            </div>

                            {/* Reply Action tools */}
                            <div className="opacity-0 group-hover/reply:opacity-100 flex items-center gap-1.5 transition-all">
                              <button
                                onClick={() => handleEditReply(rev.id, rev.replyText || '')}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                                title="Edit Response"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteReply(rev.id)}
                                className="p-1 hover:bg-red-100 text-red-500 rounded cursor-pointer"
                                title="Delete Response"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Editable Textbox or static representation */}
                          {editingReplyId === rev.id ? (
                            <div className="space-y-2 mt-1">
                              <textarea
                                value={editInput}
                                onChange={(e) => setEditInput(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-slate-300"
                                rows={2}
                              />
                              <div className="flex items-center gap-1.5 justify-end">
                                <button
                                  onClick={() => setEditingReplyId(null)}
                                  className="h-7 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg transition-all"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEditReply(rev.id)}
                                  className="h-7 px-3 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all"
                                >
                                  Save Response
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-600 font-medium italic">
                              "{rev.replyText}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Inline Reply Box Trigger */}
                      {replyingToId === rev.id && (
                        <div className="bg-accent/20 border border-primary/20 p-4 rounded-2xl space-y-2.5 text-left mt-3">
                          <label className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">
                            Compose Official Response
                          </label>
                          <textarea
                            placeholder="Write a warm, professional response to the customer..."
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-slate-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                            rows={3}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-semibold">
                              Response will be publicly linked to your business account.
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setReplyingToId(null);
                                  setReplyInput('');
                                }}
                                className="h-8 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddReply(rev.id)}
                                className="h-8 px-4 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                              >
                                Submit Response
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* 3. Action Tools & Ordered Dish Picture (Right Column) */}
                    <div className="w-full md:w-36 shrink-0 flex md:flex-col items-center justify-between md:items-end gap-3.5 self-stretch">
                      
                      {/* Ordered Dish thumbnail with zoom interaction */}
                      <div className="text-left md:text-right space-y-1">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Ordered Dish</span>
                        <div
                          onClick={() => setZoomedImage({ src: rev.dishImage, title: rev.dishName })}
                          className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border border-slate-100 cursor-zoom-in group shadow-xs"
                        >
                          <img
                            src={rev.dishImage}
                            alt={rev.dishName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Search className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-slate-700 block max-w-[120px] truncate">
                          {rev.dishName}
                        </span>
                      </div>

                      {/* Reply status badge and controls */}
                      <div className="flex flex-col items-end gap-2.5">
                        
                        {/* Badge */}
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border tracking-wider ${
                          rev.status === 'Replied'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100/70'
                        }`}>
                          {rev.status}
                        </span>

                        {/* Buttons Row */}
                        <div className="flex items-center gap-1">
                          {rev.status === 'Pending Reply' && replyingToId !== rev.id && (
                            <button
                              onClick={() => setReplyingToId(rev.id)}
                              className="h-8 px-3.5 bg-slate-900 hover:bg-black text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                            title="Flag / Remove review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>

                  </motion.div>
                ))
              )}
            </div>

            {/* --- PAGINATION CONTROLS (FULLY FUNCTIONAL) --- */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5 mt-4">
                <span className="text-xs font-semibold text-slate-400">
                  Showing <span className="text-slate-700 font-bold">{Math.min(filteredReviews.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
                  <span className="text-slate-700 font-bold">
                    {Math.min(filteredReviews.length, currentPage * itemsPerPage)}
                  </span>{' '}
                  of <span className="text-slate-700 font-bold">{filteredReviews.length}</span> matching reviews
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </section>

        </main>
      </div>

      {/* --- MODAL 1: NEW SIMULATED CUSTOMER REVIEW (CONTROLLED FORM) --- */}
      <AnimatePresence>
        {isSimulationOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden text-left"
            >
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary fill-accent" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Simulate Incoming Review</h3>
                </div>
                <button
                  onClick={() => setIsSimulationOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSimulateNewReview} className="p-6 space-y-4">
                
                {/* Cust Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Customer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Dining Type</label>
                    <select
                      value={newDiningType}
                      onChange={(e) => setNewDiningType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Dine-in">Dine-in</option>
                      <option value="Takeaway">Takeaway</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                </div>

                {/* Stars and dish selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Overall Stars</label>
                    <div className="flex items-center gap-1.5 h-10">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => {
                            setNewCustRating(st);
                            // Auto align sub-scores for speed
                            setNewFoodScore(st);
                            setNewServiceScore(st);
                            setNewAmbienceScore(st);
                          }}
                          className="p-1 text-slate-300 hover:text-amber-500 cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${st <= newCustRating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-slate-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Dish Ordered</label>
                    <select
                      value={newDishName}
                      onChange={(e) => setNewDishName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none h-10"
                    >
                      {dishOptions.map((d) => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="p-3 bg-slate-50 rounded-xl space-y-3.5 border border-slate-100">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Detailed Satisfaction breakdown</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase">Food (1-5)</label>
                      <input
                        type="number"
                        min={1} max={5}
                        value={newFoodScore}
                        onChange={(e) => setNewFoodScore(parseInt(e.target.value) || 5)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase">Service (1-5)</label>
                      <input
                        type="number"
                        min={1} max={5}
                        value={newServiceScore}
                        onChange={(e) => setNewServiceScore(parseInt(e.target.value) || 5)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-extrabold text-slate-500 uppercase">Ambience (1-5)</label>
                      <input
                        type="number"
                        min={1} max={5}
                        value={newAmbienceScore}
                        onChange={(e) => setNewAmbienceScore(parseInt(e.target.value) || 5)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-center font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Review Comments</label>
                  <textarea
                    required
                    placeholder="Describe the dining experience, taste, speed of service..."
                    value={newCustText}
                    onChange={(e) => setNewCustText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-300"
                    rows={3}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsSimulationOpen(false)}
                    className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Inject Live Review
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: BUSINESS SETTINGS & CONSOLE PROFILE --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden text-left"
            >
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Restaurant Profile Settings</h3>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    value={restaurantProfile.name}
                    onChange={(e) => setRestaurantProfile({ ...restaurantProfile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Cuisine & Tags</label>
                  <input
                    type="text"
                    required
                    value={restaurantProfile.cuisine}
                    onChange={(e) => setRestaurantProfile({ ...restaurantProfile, cuisine: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Owner Name</label>
                  <input
                    type="text"
                    required
                    value={restaurantProfile.ownerName}
                    onChange={(e) => setRestaurantProfile({ ...restaurantProfile, ownerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Avatar Seed URL</label>
                  <input
                    type="text"
                    value={restaurantProfile.avatar}
                    onChange={(e) => setRestaurantProfile({ ...restaurantProfile, avatar: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-accent/20 border border-primary/10 rounded-xl text-xs text-slate-500 font-medium">
                  Your details will update instantly on the sidebar branding block, header panel, and response signatures.
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(false)}
                    className="h-9 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="h-9 px-5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 3: DISH IMAGE ZOOM LIGHTBOX --- */}
      <AnimatePresence>
        {zoomedImage && (
          <div
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-55 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden max-w-lg w-full border border-slate-200 shadow-2xl relative text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 sm:h-80 bg-slate-100">
                <img
                  src={zoomedImage.src}
                  alt={zoomedImage.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setZoomedImage(null)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-xs hover:bg-white rounded-full flex items-center justify-center shadow text-slate-700 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{zoomedImage.title}</h4>
                  <span className="text-[10px] bg-secondary text-secondary-foreground font-extrabold px-3 py-1 rounded-full uppercase">
                    Chef Special Choice
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  This dish is prepared fresh using organic locally-sourced ingredients. It ranks as one of the top orders and generates highly positive sentiment logs across all active client reviews.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default OwnerDashboardPage;
