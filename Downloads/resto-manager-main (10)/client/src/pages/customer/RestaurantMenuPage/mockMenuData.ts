export type MockMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  ingredients?: string[];
};

export const mockMenuItems: MockMenuItem[] = [
  {
    id: "burger-01",
    name: "Cedar Smash Burger",
    description: "Double smashed beef, aged cheddar, pickles, and smoky house sauce on brioche.",
    price: 14.5,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900&auto=format&fit=crop",
    category: "Burgers",
    isAvailable: true,
    ingredients: ["Beef", "Aged cheddar", "Pickles", "House sauce", "Brioche bun"],
  },
  {
    id: "burger-02",
    name: "Crispy Chicken Burger",
    description: "Buttermilk chicken, cabbage slaw, dill pickles, and chili honey.",
    price: 13,
    imageUrl: "https://images.unsplash.com/photo-1615297928064-24977384d0da?q=80&w=900&auto=format&fit=crop",
    category: "Burgers",
    isAvailable: false,
    ingredients: ["Chicken breast", "Cabbage slaw", "Dill pickles", "Chili honey"],
  },
  {
    id: "pizza-01",
    name: "Fire-Roasted Margherita",
    description: "San Marzano tomato, fresh mozzarella, basil, and extra-virgin olive oil.",
    price: 12.75,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=900&auto=format&fit=crop",
    category: "Pizza",
    isAvailable: true,
    ingredients: ["Tomato", "Fresh mozzarella", "Basil", "Olive oil"],
  },
  {
    id: "pizza-02",
    name: "Wild Mushroom Pizza",
    description: "Roasted mushrooms, caramelized onion, thyme, mozzarella, and truffle cream.",
    price: 16.25,
    imageUrl: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?q=80&w=900&auto=format&fit=crop",
    category: "Pizza",
    isAvailable: true,
    ingredients: ["Wild mushrooms", "Caramelized onion", "Thyme", "Mozzarella", "Truffle cream"],
  },
  {
    id: "salad-01",
    name: "Charred Halloumi Salad",
    description: "Baby greens, tomato, cucumber, herbs, toasted seeds, and lemon sumac dressing.",
    price: 11.5,
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=900&auto=format&fit=crop",
    category: "Salads",
    isAvailable: true,
    ingredients: ["Halloumi", "Baby greens", "Tomato", "Cucumber", "Sumac"],
  },
  {
    id: "salad-02",
    name: "Herby Fattoush",
    description: "A crisp Lebanese classic with radish, purslane, pomegranate, and toasted pita.",
    price: 8.5,
    category: "Salads",
    isAvailable: true,
    ingredients: ["Romaine", "Radish", "Purslane", "Pomegranate", "Toasted pita"],
  },
  {
    id: "drink-01",
    name: "Rose Lemonade",
    description: "Fresh lemon, rose water, mint, and sparkling water served over ice.",
    price: 4.75,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=900&auto=format&fit=crop",
    category: "Drinks",
    isAvailable: true,
    ingredients: ["Lemon", "Rose water", "Mint", "Sparkling water"],
  },
  {
    id: "drink-02",
    name: "Cold Brew Tonic",
    description: "House cold brew with tonic, orange peel, and a touch of vanilla.",
    price: 5.25,
    category: "Drinks",
    isAvailable: false,
    ingredients: ["Cold brew coffee", "Tonic", "Orange", "Vanilla"],
  },
  {
    id: "dessert-01",
    name: "Pistachio Tiramisu",
    description: "Espresso-soaked sponge, mascarpone, pistachio cream, and cocoa.",
    price: 7.5,
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=900&auto=format&fit=crop",
    category: "Desserts",
    isAvailable: true,
    ingredients: ["Mascarpone", "Espresso", "Pistachio", "Cocoa"],
  },
  {
    id: "dessert-02",
    name: "Warm Date Cake",
    description: "Soft date cake with tahini caramel and a scoop of vanilla ice cream.",
    price: 8,
    imageUrl: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=900&auto=format&fit=crop",
    category: "Desserts",
    isAvailable: true,
    ingredients: ["Dates", "Tahini", "Caramel", "Vanilla ice cream"],
  },
];
