export type RestaurantListItem = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  bannerUrl?: string;
  logoUrl?: string;
  cuisineTypes: string[];
  isOpen: boolean;
  status: "approved";
  rating: number;
  reviewsCount: number;
  priceLevel: 1 | 2 | 3;
  deliveryTime: string;
  deliveryFee: number;
  featured?: boolean;
  offer?: string;
  location: string;
};

export const restaurants: RestaurantListItem[] = [
  {
    _id: "rest_001",
    name: "Pizza Palace",
    slug: "pizza-palace",
    description: "Fresh Italian pizza made with authentic ingredients.",
    bannerUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
    cuisineTypes: ["Italian", "Pizza"],
    isOpen: true,
    status: "approved",
    rating: 4.8,
    reviewsCount: 342,
    priceLevel: 2,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    featured: true,
    offer: "Free delivery on orders over $30",
    location: "Hamra Street, Beirut",
  },
  {
    _id: "rest_002",
    name: "Burger House",
    slug: "burger-house",
    description: "Juicy burgers with crispy fries and fresh ingredients.",

    logoUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    cuisineTypes: ["American", "Fast Food"],
    isOpen: false,
    status: "approved",
    rating: 4.7,
    reviewsCount: 289,
    priceLevel: 2,
    deliveryTime: "15-25 min",
    deliveryFee: 1.49,
    offer: "Complimentary onion rings above $25",
    location: "Riad El Solh, Sidon",
  },
  {
    _id: "rest_003",
    name: "Sushi World",
    slug: "sushi-world",
    description: "Authentic Japanese sushi prepared by professional chefs.",
    bannerUrl:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png",
    cuisineTypes: ["Japanese", "Sushi"],
    isOpen: true,
    status: "approved",
    rating: 4.9,
    reviewsCount: 512,
    priceLevel: 3,
    deliveryTime: "25-35 min",
    deliveryFee: 2.99,
    featured: true,
    offer: "20% off with code SAKURA20",
    location: "Downtown, Beirut",
  },
  {
    _id: "rest_004",
    name: "Lebanese Grill",
    slug: "lebanese-grill",
    description: "Traditional Lebanese BBQ, shawarma, and mezze.",
    bannerUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    cuisineTypes: ["Lebanese", "BBQ"],
    isOpen: true,
    status: "approved",
    rating: 4.6,
    reviewsCount: 224,
    priceLevel: 2,
    deliveryTime: "20-30 min",
    deliveryFee: 1.99,
    offer: "10% off selected grill platters",
    location: "Saida Old Road, Sidon",
  },
  {
    _id: "rest_005",
    name: "Sweet Bakery",
    slug: "sweet-bakery",
    description: "Fresh pastries, cakes, coffee, and desserts.",
    bannerUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3082/3082011.png",
    cuisineTypes: ["Bakery", "Desserts"],
    isOpen: true,
    status: "approved",
    rating: 4.8,
    reviewsCount: 167,
    priceLevel: 1,
    deliveryTime: "10-20 min",
    deliveryFee: 0,
    offer: "Buy five macarons and get one free",
    location: "Main Road, Tyre",
  },
];
