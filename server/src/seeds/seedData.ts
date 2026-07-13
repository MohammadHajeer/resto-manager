export type SeedStatus = "approved" | "pending" | "rejected" | "suspended";

export type SeedImageKind =
  | "lebanese"
  | "grill"
  | "pizza"
  | "pasta"
  | "burger"
  | "sushi"
  | "salad"
  | "bowl"
  | "dessert"
  | "drink"
  | "coffee";

export type SeedMenuItem = {
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  availableAddons: Array<{ name: string; price: number }>;
  isAvailable?: boolean;
  imageKind: SeedImageKind;
};

export type SeedCategory = {
  name: string;
  description: string;
  items: SeedMenuItem[];
};

export type SeedRestaurant = {
  owner: { name: string; email: string; phone: string };
  name: string;
  slug: string;
  initials: string;
  colors: [string, string];
  description: string;
  cuisineTypes: string[];
  contact: { phone: string; email: string };
  address: {
    city: string;
    street: string;
    building: string;
    floor: string;
    locationUrl: string;
  };
  status: SeedStatus;
  isOpen: boolean;
  rejectionReason?: string;
  suspensionReason?: string;
  bannerKind: SeedImageKind;
  categories: SeedCategory[];
};

export const SEED_PASSWORD = "password";

const addons = {
  sauce: [{ name: "Extra sauce", price: 1.25 }],
  cheese: [{ name: "Extra cheese", price: 2 }],
  chicken: [{ name: "Extra chicken", price: 3.5 }],
  patty: [{ name: "Additional patty", price: 4.5 }],
  avocado: [{ name: "Avocado", price: 2.5 }],
  mushrooms: [{ name: "Mushrooms", price: 2 }],
  sushi: [{ name: "Extra sushi pieces", price: 4 }],
};

const item = (
  name: string,
  description: string,
  price: number,
  imageKind: SeedImageKind,
  ingredients: string[],
  availableAddons: SeedMenuItem["availableAddons"] = [],
  isAvailable = true,
): SeedMenuItem => ({
  name,
  description,
  price,
  imageKind,
  ingredients,
  availableAddons,
  isAvailable,
});

const allWeek = (weekday: [string, string], weekend: [string, string]) =>
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
    (day) => ({
      day,
      openTime: day === "Friday" || day === "Saturday" ? weekend[0] : weekday[0],
      closeTime: day === "Friday" || day === "Saturday" ? weekend[1] : weekday[1],
      isClosed: false,
    }),
  );

export const OPENING_HOURS = {
  dining: allWeek(["11:00", "23:00"], ["11:00", "23:30"]),
  cafe: allWeek(["08:00", "21:30"], ["09:00", "22:00"]),
};

export const REMOTE_IMAGE_URLS: Record<SeedImageKind, string> = {
  lebanese: "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=1400&q=80",
  grill: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
  pizza: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1400&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80",
  sushi: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1400&q=80",
  salad: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=80",
  bowl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
  dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1400&q=80",
  drink: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1400&q=80",
  coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=80",
};

export const SEED_RESTAURANTS: SeedRestaurant[] = [
  {
    owner: { name: "Maya Khoury", email: "owner1@resto.com", phone: "+961 71 410 101" },
    name: "Cedar & Stone", slug: "cedar-and-stone", initials: "CS", colors: ["#7C2D12", "#F59E0B"],
    description: "A warm Lebanese kitchen serving generous mezze, charcoal grills, and time-honored family recipes with a polished contemporary touch.",
    cuisineTypes: ["Lebanese", "Middle Eastern", "Grills"], contact: { phone: "+961 1 410 101", email: "hello@cedarandstone.test" },
    address: { city: "Beirut", street: "Armenia Street, Mar Mikhael", building: "Cedar House", floor: "Ground floor", locationUrl: "https://maps.google.com/?q=Mar+Mikhael+Beirut" },
    status: "approved", isOpen: true, bannerKind: "lebanese",
    categories: [
      { name: "Cold Mezze", description: "Classic chilled plates made for sharing.", items: [
        item("Silky Hummus", "Chickpeas blended with tahini, lemon, and olive oil.", 5.5, "lebanese", ["Chickpeas", "Tahini", "Lemon", "Olive oil"], addons.sauce),
        item("Smoky Moutabal", "Charred eggplant folded with tahini and pomegranate.", 6, "lebanese", ["Eggplant", "Tahini", "Pomegranate"]),
        item("Warak Enab", "Vine leaves filled with rice, tomato, parsley, and herbs.", 6.5, "lebanese", ["Vine leaves", "Rice", "Tomato", "Parsley"]),
        item("Labneh Garden", "Strained yogurt with cucumber, mint, olives, and zaatar.", 5, "lebanese", ["Labneh", "Cucumber", "Mint", "Zaatar"]),
      ]},
      { name: "Lebanese Grills", description: "Charcoal-fired meats served with grilled vegetables.", items: [
        item("Shish Taouk", "Marinated chicken skewers with garlic cream and pickles.", 14, "grill", ["Chicken", "Garlic", "Lemon", "Pickles"], addons.sauce),
        item("Kafta Meshwi", "Parsley-seasoned beef kafta grilled over charcoal.", 15, "grill", ["Beef", "Parsley", "Onion", "Spices"]),
        item("Mixed Grill", "Taouk, kafta, and lamb cubes with grilled vegetables.", 22, "grill", ["Chicken", "Beef", "Lamb", "Vegetables"], addons.sauce),
        item("Lamb Chops", "Herb-marinated lamb chops with sumac onions.", 24, "grill", ["Lamb", "Sumac", "Onion", "Herbs"], [], false),
      ]},
      { name: "Desserts & Drinks", description: "Traditional sweets and refreshing house drinks.", items: [
        item("Osmalieh", "Crisp kataifi layered with ashta and orange blossom syrup.", 7, "dessert", ["Kataifi", "Ashta", "Orange blossom"]),
        item("Mafroukeh", "Pistachio semolina sweet topped with fresh ashta.", 7.5, "dessert", ["Pistachio", "Semolina", "Ashta"]),
        item("Jallab", "Date and grape molasses drink with pine nuts.", 4, "drink", ["Date molasses", "Grape molasses", "Pine nuts"]),
        item("Mint Lemonade", "Fresh lemon blended with mint and crushed ice.", 4.5, "drink", ["Lemon", "Mint", "Ice"]),
      ]},
    ],
  },
  {
    owner: { name: "Luca Haddad", email: "owner2@resto.com", phone: "+961 70 420 202" },
    name: "Forno Rosso", slug: "forno-rosso", initials: "FR", colors: ["#991B1B", "#166534"],
    description: "A neighborhood Italian trattoria centered on blistered sourdough pizza, handmade pasta, and relaxed hospitality inspired by southern Italy.",
    cuisineTypes: ["Italian", "Pizza", "Pasta"], contact: { phone: "+961 4 420 202", email: "ciao@fornodelrosso.test" },
    address: { city: "Metn", street: "Main Road, Broummana", building: "Villa Rosso", floor: "1st floor", locationUrl: "https://maps.google.com/?q=Broummana+Lebanon" },
    status: "approved", isOpen: true, bannerKind: "pizza",
    categories: [
      { name: "Antipasti", description: "Small Italian plates to begin the table.", items: [
        item("Tomato Bruschetta", "Grilled country bread with tomato, basil, and garlic.", 7, "pizza", ["Bread", "Tomato", "Basil", "Garlic"], addons.cheese),
        item("Burrata Pugliese", "Creamy burrata with cherry tomatoes and basil oil.", 12, "salad", ["Burrata", "Tomato", "Basil oil"]),
        item("Arancini", "Crisp saffron risotto balls with mozzarella centers.", 9, "pasta", ["Risotto", "Saffron", "Mozzarella"]),
        item("Melanzane Parmigiana", "Baked eggplant layered with tomato and parmesan.", 10, "pasta", ["Eggplant", "Tomato", "Parmesan"]),
      ]},
      { name: "Pizza", description: "Long-fermented pizzas baked in a stone oven.", items: [
        item("Margherita", "San Marzano tomato, fior di latte, basil, and olive oil.", 11, "pizza", ["Tomato", "Mozzarella", "Basil"], addons.cheese),
        item("Funghi", "Roasted mushrooms, mozzarella, thyme, and parmesan.", 14, "pizza", ["Mushrooms", "Mozzarella", "Thyme"], addons.mushrooms),
        item("Diavola", "Spicy salami, tomato, mozzarella, and chili honey.", 15, "pizza", ["Salami", "Tomato", "Mozzarella", "Chili"]),
        item("Quattro Formaggi", "Mozzarella, gorgonzola, fontina, and parmesan.", 16, "pizza", ["Mozzarella", "Gorgonzola", "Fontina", "Parmesan"], addons.cheese),
      ]},
      { name: "Pasta", description: "House sauces paired with traditional pasta shapes.", items: [
        item("Tagliatelle Ragu", "Slow-cooked beef ragu with fresh tagliatelle.", 16, "pasta", ["Beef", "Tomato", "Tagliatelle", "Parmesan"]),
        item("Penne Arrabbiata", "Tomato, garlic, parsley, and Calabrian chili.", 12, "pasta", ["Penne", "Tomato", "Garlic", "Chili"]),
        item("Truffle Mushroom Rigatoni", "Creamy mushroom sauce with truffle and parmesan.", 18, "pasta", ["Rigatoni", "Mushrooms", "Truffle", "Parmesan"], addons.mushrooms),
        item("Lemon Shrimp Linguine", "Shrimp, lemon, garlic, parsley, and olive oil.", 19, "pasta", ["Shrimp", "Linguine", "Lemon", "Garlic"], [], false),
      ]},
    ],
  },
  {
    owner: { name: "Rami Daher", email: "owner3@resto.com", phone: "+961 76 430 303" },
    name: "Beast & Bun", slug: "beast-and-bun", initials: "BB", colors: ["#111827", "#F97316"],
    description: "A playful burger joint smashing fresh beef on the griddle and pairing crisp chicken, loaded fries, and bold house sauces with every order.",
    cuisineTypes: ["Burgers", "American", "Fast Food"], contact: { phone: "+961 9 430 303", email: "orders@beastandbun.test" },
    address: { city: "Jounieh", street: "Old Souk Street", building: "The Foundry", floor: "Ground floor", locationUrl: "https://maps.google.com/?q=Jounieh+Old+Souk" },
    status: "approved", isOpen: true, bannerKind: "burger",
    categories: [
      { name: "Smash Burgers", description: "Fresh beef smashed hard for crisp, lacy edges.", items: [
        item("Classic Smash", "Double beef, American cheese, pickles, and beast sauce.", 10, "burger", ["Beef", "Cheese", "Pickles", "House sauce"], [...addons.patty, ...addons.cheese]),
        item("Onion Jam Beast", "Double beef with onion jam, cheddar, and mustard mayo.", 12, "burger", ["Beef", "Onion jam", "Cheddar", "Mustard"]),
        item("Mushroom Melt", "Beef, sauteed mushrooms, Swiss cheese, and garlic aioli.", 12.5, "burger", ["Beef", "Mushrooms", "Swiss cheese"], addons.mushrooms),
        item("Firehouse", "Beef, jalapeno, pepper jack, crispy onion, and hot sauce.", 13, "burger", ["Beef", "Jalapeno", "Pepper jack", "Hot sauce"], addons.sauce),
      ]},
      { name: "Chicken & Veggie", description: "Crisp chicken and satisfying meat-free sandwiches.", items: [
        item("Crispy Chicken", "Buttermilk chicken, slaw, pickles, and ranch.", 10.5, "burger", ["Chicken", "Slaw", "Pickles", "Ranch"], addons.sauce),
        item("Hot Honey Chicken", "Crispy chicken glazed with chili honey and cool slaw.", 11.5, "burger", ["Chicken", "Honey", "Chili", "Slaw"]),
        item("Halloumi Stack", "Grilled halloumi, tomato, rocket, and basil mayo.", 10, "burger", ["Halloumi", "Tomato", "Rocket", "Basil"]),
        item("Portobello Crunch", "Crisp portobello, cheddar, lettuce, and smoky sauce.", 9.5, "burger", ["Portobello", "Cheddar", "Lettuce"], addons.cheese),
      ]},
      { name: "Sides & Shakes", description: "Loaded sides and hand-spun milkshakes.", items: [
        item("Beast Fries", "Skin-on fries loaded with cheese sauce and crispy onion.", 6, "burger", ["Potato", "Cheese sauce", "Crispy onion"], addons.cheese),
        item("Sweet Potato Fries", "Crisp sweet potato fries with chipotle mayo.", 6.5, "burger", ["Sweet potato", "Chipotle mayo"], addons.sauce),
        item("Salted Caramel Shake", "Vanilla ice cream blended with salted caramel.", 6, "drink", ["Vanilla ice cream", "Caramel", "Milk"]),
        item("Chocolate Brownie Shake", "Chocolate ice cream, brownie crumbs, and fudge.", 6.5, "dessert", ["Chocolate ice cream", "Brownie", "Fudge"]),
      ]},
    ],
  },
  {
    owner: { name: "Yuki Mansour", email: "owner4@resto.com", phone: "+961 81 440 404" },
    name: "Mizu Table", slug: "mizu-table", initials: "MT", colors: ["#0F172A", "#0EA5E9"],
    description: "A focused Japanese kitchen preparing sushi to order, bright rice bowls, and delicate small plates with carefully sourced ingredients.",
    cuisineTypes: ["Japanese", "Sushi", "Asian"], contact: { phone: "+961 1 440 404", email: "hello@mizutable.test" },
    address: { city: "Beirut", street: "Abdel Wahab El Inglizi, Achrafieh", building: "Mizu Court", floor: "2nd floor", locationUrl: "https://maps.google.com/?q=Achrafieh+Beirut" },
    status: "pending", isOpen: false, bannerKind: "sushi",
    categories: [
      { name: "Small Plates", description: "Japanese starters for sharing or snacking.", items: [
        item("Sea Salt Edamame", "Steamed soybeans finished with flaky sea salt.", 5, "sushi", ["Edamame", "Sea salt"]),
        item("Chicken Gyoza", "Pan-seared dumplings with ginger soy dipping sauce.", 8, "sushi", ["Chicken", "Cabbage", "Ginger", "Soy"]),
        item("Crispy Shrimp", "Lightly battered shrimp with spicy sesame mayo.", 10, "sushi", ["Shrimp", "Sesame", "Chili mayo"], addons.sauce),
        item("Miso Aubergine", "Glazed roasted eggplant with sesame and scallion.", 8.5, "sushi", ["Eggplant", "Miso", "Sesame", "Scallion"]),
      ]},
      { name: "Sushi Rolls", description: "Eight-piece rolls prepared fresh to order.", items: [
        item("Salmon Avocado Roll", "Salmon, avocado, cucumber, and toasted sesame.", 12, "sushi", ["Salmon", "Avocado", "Cucumber", "Rice"], addons.sushi),
        item("Spicy Tuna Roll", "Tuna, chili, cucumber, scallion, and sesame.", 13, "sushi", ["Tuna", "Chili", "Cucumber", "Rice"], addons.sushi),
        item("Crispy Crab Roll", "Crab, avocado, crisp tempura flakes, and eel sauce.", 14, "sushi", ["Crab", "Avocado", "Tempura", "Rice"]),
        item("Garden Maki", "Avocado, asparagus, cucumber, carrot, and shiso.", 10, "sushi", ["Avocado", "Asparagus", "Cucumber", "Carrot"]),
      ]},
      { name: "Rice Bowls", description: "Seasoned rice bowls with colorful toppings.", items: [
        item("Salmon Poke", "Salmon, avocado, edamame, cucumber, and ponzu rice.", 16, "bowl", ["Salmon", "Rice", "Avocado", "Edamame"], addons.avocado),
        item("Teriyaki Chicken Don", "Grilled chicken, teriyaki glaze, rice, and pickles.", 14, "bowl", ["Chicken", "Rice", "Teriyaki", "Pickles"], addons.chicken),
        item("Beef Yakiniku Don", "Seared beef, onion, sesame, scallion, and steamed rice.", 17, "bowl", ["Beef", "Rice", "Onion", "Sesame"]),
        item("Tofu Rainbow Bowl", "Miso tofu, vegetables, avocado, and sesame rice.", 13, "bowl", ["Tofu", "Rice", "Vegetables", "Avocado"], addons.avocado, false),
      ]},
    ],
  },
  {
    owner: { name: "Nour Saad", email: "owner5@resto.com", phone: "+961 79 450 505" },
    name: "Good Day Kitchen", slug: "good-day-kitchen", initials: "GD", colors: ["#166534", "#A3E635"],
    description: "An all-day healthy cafe serving abundant salads, nourishing grain bowls, fresh breakfast, smoothies, and specialty coffee without compromise.",
    cuisineTypes: ["Healthy", "Cafe", "Vegetarian"], contact: { phone: "+961 5 450 505", email: "team@gooddaykitchen.test" },
    address: { city: "Baabda", street: "Damascus Road, Hazmieh", building: "Garden Square", floor: "Ground floor", locationUrl: "https://maps.google.com/?q=Hazmieh+Lebanon" },
    status: "suspended", isOpen: false, suspensionReason: "Development sample: food-safety certificate renewal is pending.", bannerKind: "bowl",
    categories: [
      { name: "Breakfast", description: "Wholesome breakfast served throughout the day.", items: [
        item("Avocado Sourdough", "Smashed avocado, cherry tomato, seeds, and lemon.", 9, "coffee", ["Sourdough", "Avocado", "Tomato", "Seeds"], addons.avocado),
        item("Berry Granola Bowl", "Greek yogurt, berries, house granola, and raw honey.", 8, "bowl", ["Yogurt", "Berries", "Granola", "Honey"]),
        item("Green Omelette", "Eggs, spinach, herbs, feta, and a seasonal side salad.", 10, "salad", ["Eggs", "Spinach", "Feta", "Herbs"], addons.cheese),
        item("Peanut Banana Oats", "Overnight oats with banana, peanut butter, and cacao.", 7.5, "bowl", ["Oats", "Banana", "Peanut butter", "Cacao"]),
      ]},
      { name: "Salads & Bowls", description: "Balanced bowls built from fresh produce and grains.", items: [
        item("Green Goddess Bowl", "Quinoa, broccoli, avocado, edamame, and herb dressing.", 12, "bowl", ["Quinoa", "Broccoli", "Avocado", "Edamame"], addons.avocado),
        item("Chicken Harvest Salad", "Roast chicken, greens, sweet potato, apple, and walnuts.", 13, "salad", ["Chicken", "Greens", "Sweet potato", "Apple"], addons.chicken),
        item("Mediterranean Quinoa", "Quinoa, tomato, cucumber, chickpeas, feta, and mint.", 11, "salad", ["Quinoa", "Tomato", "Cucumber", "Chickpeas"], addons.cheese),
        item("Tahini Falafel Bowl", "Baked falafel, brown rice, cabbage, pickles, and tahini.", 11.5, "bowl", ["Falafel", "Brown rice", "Cabbage", "Tahini"]),
      ]},
      { name: "Smoothies & Coffee", description: "Blended fruit, functional drinks, and specialty coffee.", items: [
        item("Berry Boost", "Berries, banana, yogurt, chia, and almond milk.", 6.5, "drink", ["Berries", "Banana", "Chia", "Almond milk"]),
        item("Green Glow", "Spinach, mango, pineapple, ginger, and coconut water.", 6.5, "drink", ["Spinach", "Mango", "Pineapple", "Ginger"]),
        item("Iced Oat Latte", "Double espresso over ice with creamy oat milk.", 4.5, "coffee", ["Espresso", "Oat milk", "Ice"]),
        item("Date Cacao Shake", "Dates, cacao, banana, tahini, and almond milk.", 7, "drink", ["Dates", "Cacao", "Banana", "Tahini"], [], false),
      ]},
    ],
  },
];
