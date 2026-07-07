import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  FolderPlus,
  ArrowUpDown,
  LayoutDashboard,
  Sparkles,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Award,
  Layers,
  X,
  Search,
  Check,
  DollarSign,
  Clock,
  Package,
  CheckSquare,
  AlertTriangle
} from 'lucide-react';

// --- INLINED TYPES & INTERFACES ---
export interface CategoryData {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface MenuItemFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  preparationTime: number;
  inventory: number;
  availability: boolean;
  bestSeller?: boolean;
  featured?: boolean;
  imageUrl?: string;
}

interface MenuManagementPageProps {
  userEmail: string | null;
  onLogout: () => void;
}

// --- INITIAL MOCK DATA ---
const INITIAL_CATEGORIES: CategoryData[] = [
  { id: 'cat-1', name: 'Appetizers', description: 'Fresh starters to share', order: 0 },
  { id: 'cat-2', name: 'Main Courses', description: 'Delicious main courses', order: 1 },
  { id: 'cat-3', name: 'Beverages', description: 'Refreshing cold and hot drinks', order: 2 },
];

const INITIAL_MENU_ITEMS: MenuItemFormData[] = [
  {
    id: 'item-1',
    name: 'Garlic Herb Bread',
    description: 'Warm toasted bread with garlic butter and fresh herbs.',
    category: 'Appetizers',
    price: 6.99,
    preparationTime: 8,
    inventory: 40,
    availability: true,
    bestSeller: true,
  },
  {
    id: 'item-2',
    name: 'Crispy Calamari',
    description: 'Lightly battered calamari rings served with garlic aioli and lemon.',
    category: 'Appetizers',
    price: 12.99,
    preparationTime: 12,
    inventory: 30,
    availability: true,
  },
  {
    id: 'item-3',
    name: 'Truffle Mushroom Pasta',
    description: 'Creamy fettuccine with wild forest mushrooms and truffle oil infusion.',
    category: 'Main Courses',
    price: 18.99,
    preparationTime: 15,
    inventory: 25,
    availability: true,
    featured: true,
  },
  {
    id: 'item-4',
    name: 'Gourmet Angus Burger',
    description: 'Juicy Angus beef patty, sharp cheddar, fresh lettuce, tomato, and house burger sauce.',
    category: 'Main Courses',
    price: 16.50,
    preparationTime: 10,
    inventory: 50,
    availability: true,
    bestSeller: true,
  },
  {
    id: 'item-5',
    name: 'Iced Matcha Latte',
    description: 'Premium stone-ground Japanese matcha whisked with oat milk and honey.',
    category: 'Beverages',
    price: 5.50,
    preparationTime: 5,
    inventory: 80,
    availability: true,
  },
  {
    id: 'item-6',
    name: 'Classic Passionfruit Mojito',
    description: 'Fresh mint leaves, passionfruit pulp, lime juice, and a splash of club soda.',
    category: 'Beverages',
    price: 7.50,
    preparationTime: 5,
    inventory: 100,
    availability: true,
  },
];

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();

  // --- LOCAL PERSISTED STATES (NO EXTERNAL HOOKS/FILES REQUIRED) ---
  const [categories, setCategories] = useState<CategoryData[]>(() => {
    const stored = localStorage.getItem('resto_categories');
    return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
  });

  const [menuItems, setMenuItems] = useState<MenuItemFormData[]>(() => {
    const stored = localStorage.getItem('resto_menu_items');
    return stored ? JSON.parse(stored) : INITIAL_MENU_ITEMS;
  });

  // Save updates helper
  const saveCategoriesToStorage = (newCats: CategoryData[]) => {
    setCategories(newCats);
    localStorage.setItem('resto_categories', JSON.stringify(newCats));
  };

  const saveMenuItemsToStorage = (newItems: MenuItemFormData[]) => {
    setMenuItems(newItems);
    localStorage.setItem('resto_menu_items', JSON.stringify(newItems));
  };

  // --- FILTERING AND SEARCH STATES ---
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);

  // --- MODAL & DRAWER STATES ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemFormData | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<CategoryData | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItemFormData | null>(null);

  // Collapse / Expand Categories state
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (categoryId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Check login
  if (!userEmail) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 min-h-[80vh]">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
          <h2 className="text-lg font-black text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            You must be authenticated to access the RestoManager Menu Management system.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-slate-950 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // --- MENU ITEM ACTIONS ---
  const handleCreateNewItemClick = (categoryName?: string) => {
    setSelectedMenuItem({
      name: '',
      description: '',
      category: categoryName || (categories[0]?.name || ''),
      availability: true,
      price: 0,
      preparationTime: 10,
      inventory: 50,
      customizationGroups: [],
    } as any);
    setDrawerOpen(true);
  };

  const handleEditItemClick = (item: MenuItemFormData) => {
    setSelectedMenuItem({ ...item });
    setDrawerOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuItem) return;

    if (selectedMenuItem.id) {
      // Edit existing
      const updated = menuItems.map(item => item.id === selectedMenuItem.id ? selectedMenuItem : item);
      saveMenuItemsToStorage(updated);
    } else {
      // Create new
      const newItem: MenuItemFormData = {
        ...selectedMenuItem,
        id: `item-${Date.now()}`
      };
      saveMenuItemsToStorage([...menuItems, newItem]);
    }
    setDrawerOpen(false);
    setSelectedMenuItem(null);
  };

  const handleDeleteItemClick = (item: MenuItemFormData) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updated = menuItems.filter(item => item.id !== itemToDelete.id);
      saveMenuItemsToStorage(updated);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleDuplicateItem = (item: MenuItemFormData) => {
    const copy: MenuItemFormData = {
      ...item,
      id: `item-${Date.now()}`,
      name: `${item.name} (Copy)`,
      availability: true,
    };
    saveMenuItemsToStorage([...menuItems, copy]);
  };

  const handleToggleHideItem = (item: MenuItemFormData) => {
    const updated = menuItems.map(x => x.id === item.id ? { ...x, availability: !x.availability } : x);
    saveMenuItemsToStorage(updated);
  };

  // --- CATEGORY ACTIONS ---
  const handleCreateCategoryClick = () => {
    setSelectedCategoryData({ id: '', name: '', description: '' });
    setCategoryDialogOpen(true);
  };

  const handleEditCategoryClick = (cat: CategoryData) => {
    setSelectedCategoryData({ ...cat });
    setCategoryDialogOpen(true);
  };

  const handleCategoryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryData) return;

    if (selectedCategoryData.id) {
      // Edit existing
      const updated = categories.map(cat => cat.id === selectedCategoryData.id ? selectedCategoryData : cat);
      saveCategoriesToStorage(updated);
    } else {
      // Create new
      const newCat: CategoryData = {
        ...selectedCategoryData,
        id: `cat-${Date.now()}`,
        order: categories.length,
      };
      saveCategoriesToStorage([...categories, newCat]);
    }
    setCategoryDialogOpen(false);
    setSelectedCategoryData(null);
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (window.confirm(`Are you sure you want to delete "${catName}"? All its items will be kept but set to uncategorized.`)) {
      const updatedCats = categories.filter(x => x.id !== catId);
      saveCategoriesToStorage(updatedCats);

      // Also set category of orphaned items to empty string
      const updatedItems = menuItems.map(item => {
        if (item.category === catName) {
          return { ...item, category: '' };
        }
        return item;
      });
      saveMenuItemsToStorage(updatedItems);
    }
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const updated = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      const reordered = updated.map((cat, idx) => ({ ...cat, order: idx }));
      saveCategoriesToStorage(reordered);
    }
  };

  const handleReorderAllCategories = () => {
    const sorted = [...categories]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((cat, idx) => ({ ...cat, order: idx }));
    saveCategoriesToStorage(sorted);
  };

  // --- FILTERING AND SEARCH LOGIC ---
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPublished = !showOnlyPublished || item.availability;
    return matchesSearch && matchesCategory && matchesPublished;
  });

  // --- CALCULATING STATS VALUES ---
  const totalItemsCount = menuItems.length;
  const activeItemsCount = menuItems.filter(x => x.availability).length;
  const totalCategoriesCount = categories.length;
  const avgPrice = totalItemsCount > 0 
    ? (menuItems.reduce((acc, curr) => acc + Number(curr.price || 0), 0) / totalItemsCount).toFixed(2)
    : '0.00';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-none">
        <div className="text-left">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Menu Editor</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your restaurant categories, items, and pricing.
          </p>
        </div>

        {/* Categories action triggers */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleReorderAllCategories}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer h-9 shadow-xs"
            title="Auto sort categories alphabetically"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Reorder All</span>
          </button>
          <button
            onClick={handleCreateCategoryClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer h-9 shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-200" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* STATISTICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Items</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalItemsCount}</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Items</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{activeItemsCount}</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Categories</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalCategoriesCount}</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg Price</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">${avgPrice}</p>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-medium focus:bg-white focus:ring-1 focus:ring-slate-400 outline-hidden transition-all"
          />
        </div>

        {/* Filter categories pills / selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="h-5 w-[1px] bg-slate-200 mx-2" />

          {/* Toggle Drafts / Published */}
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyPublished}
              onChange={(e) => setShowOnlyPublished(e.target.checked)}
              className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span className="text-xs font-bold text-slate-600">Active only</span>
          </label>
        </div>
      </div>

      {/* CATEGORIES SECTIONS */}
      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-black text-slate-800">No Categories Configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Every menu item requires a category. Please create your first category to get started.
          </p>
          <button
            onClick={handleCreateCategoryClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5" /> Create First Category
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((cat, catIdx) => {
            // Find items belonging to this category
            const categoryItems = filteredMenuItems.filter(item => item.category === cat.name);

            // Skip showing empty categories if a search query is active
            if (categoryItems.length === 0 && (search.trim() !== '' || selectedCategory !== 'all')) {
              return null;
            }

            const isCollapsed = !!collapsedCategories[cat.id];

            return (
              <div key={cat.id} className="space-y-4">
                {/* Category Header */}
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-200/75 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-left">
                    <button
                      onClick={() => toggleCategoryCollapse(cat.id)}
                      className="p-1 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">{cat.name}</h2>
                        <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full font-black">
                          {categoryItems.length}
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    {/* Move Up/Down Controls */}
                    <button
                      disabled={catIdx === 0}
                      onClick={() => handleMoveCategory(catIdx, 'up')}
                      className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
                      title="Move Category Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={catIdx === categories.length - 1}
                      onClick={() => handleMoveCategory(catIdx, 'down')}
                      className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
                      title="Move Category Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />

                    {/* Edit / Delete */}
                    <button
                      onClick={() => handleEditCategoryClick(cat)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit Category Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Cards Grid */}
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`bg-white border p-4 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4 text-left ${
                          item.availability ? 'border-slate-200' : 'border-slate-200 opacity-75 bg-slate-50/20'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Image & Badges line */}
                          <div className="flex justify-between items-start">
                            <div className="flex flex-wrap gap-1">
                              {!item.availability && (
                                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md font-bold">
                                  Draft
                                </span>
                              )}
                              {item.bestSeller && (
                                <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                                  <TrendingUp className="w-2.5 h-2.5" /> Best Seller
                                </span>
                              )}
                              {item.featured && (
                                <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                                  <Award className="w-2.5 h-2.5" /> Featured
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-black text-slate-900">
                              ${Number(item.price || 0).toFixed(2)}
                            </span>
                          </div>

                          {/* Title & Desc */}
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">{item.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                              {item.description || 'No description provided.'}
                            </p>
                          </div>

                          {/* Details Row */}
                          <div className="flex items-center gap-3.5 text-[10px] text-slate-400 font-medium">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-300" />
                              <span>{item.preparationTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3 text-slate-300" />
                              <span>Stock: {item.inventory}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick action buttons line */}
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/80">
                          <button
                            onClick={() => handleToggleHideItem(item)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              item.availability 
                                ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700' 
                                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                            }`}
                            title={item.availability ? 'Set to Draft / Unpublish' : 'Publish / Set to Available'}
                          >
                            {item.availability ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleDuplicateItem(item)}
                              className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg transition-all cursor-pointer"
                              title="Duplicate Item"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditItemClick(item)}
                              className="p-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItemClick(item)}
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add New Item card */}
                    <button
                      onClick={() => handleCreateNewItemClick(cat.name)}
                      className="border border-dashed border-slate-300 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 transition-all cursor-pointer min-h-[160px]"
                    >
                      <PlusCircle className="w-7 h-7 text-slate-300" />
                      <span className="text-xs font-extrabold text-slate-600">Add Menu Item</span>
                      <span className="text-[10px] text-slate-400">Add a new item to {cat.name}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SLIDING FORMS DRAWER (MODAL) */}
      {drawerOpen && selectedMenuItem && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => { setDrawerOpen(false); setSelectedMenuItem(null); }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-200 z-10 p-6 space-y-6">
            <div className="space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-sm font-black text-slate-900">
                  {selectedMenuItem.id ? 'Edit Menu Item' : 'New Menu Item'}
                </h3>
                <button
                  onClick={() => { setDrawerOpen(false); setSelectedMenuItem(null); }}
                  className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form elements */}
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold text-slate-700">
                <div className="space-y-1.5 text-left">
                  <label className="block text-slate-600 font-bold">Item Name*</label>
                  <input
                    type="text"
                    required
                    value={selectedMenuItem.name}
                    onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400"
                    placeholder="e.g. Classic Margherita Pizza"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-slate-600 font-bold">Description*</label>
                  <textarea
                    required
                    rows={3}
                    value={selectedMenuItem.description}
                    onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400 resize-none"
                    placeholder="Describe ingredients, taste, or size..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1.5">
                    <label className="block text-slate-600 font-bold">Price ($)*</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      value={selectedMenuItem.price}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-600 font-bold">Category*</label>
                    <select
                      value={selectedMenuItem.category}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="space-y-1.5">
                    <label className="block text-slate-600 font-bold">Prep Time (min)*</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={selectedMenuItem.preparationTime}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, preparationTime: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-600 font-bold">Stock Inventory*</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={selectedMenuItem.inventory}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, inventory: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Additional Toggles */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3 mt-2 text-left">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedMenuItem.availability}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, availability: e.target.checked })}
                      className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <div className="text-left">
                      <span className="block text-xs font-black text-slate-700">Available / Published</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Show item to diners immediately.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!selectedMenuItem.bestSeller}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, bestSeller: e.target.checked })}
                      className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <div className="text-left">
                      <span className="block text-xs font-black text-slate-700">Best Seller Badge</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Displays amber popularity badge.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!selectedMenuItem.featured}
                      onChange={(e) => setSelectedMenuItem({ ...selectedMenuItem, featured: e.target.checked })}
                      className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <div className="text-left">
                      <span className="block text-xs font-black text-slate-700">Featured Special Badge</span>
                      <span className="block text-[10px] text-slate-400 font-normal">Displays indigo special badge.</span>
                    </div>
                  </label>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => { setDrawerOpen(false); setSelectedMenuItem(null); }}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY DIALOG (MODAL) */}
      {categoryDialogOpen && selectedCategoryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => { setCategoryDialogOpen(false); setSelectedCategoryData(null); }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal content */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">
                {selectedCategoryData.id ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => { setCategoryDialogOpen(false); setSelectedCategoryData(null); }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCategoryFormSubmit} className="space-y-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5 text-left">
                <label className="block text-slate-600">Category Name*</label>
                <input
                  type="text"
                  required
                  value={selectedCategoryData.name}
                  onChange={(e) => setSelectedCategoryData({ ...selectedCategoryData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400"
                  placeholder="e.g. Desserts, Pizza, Cocktails"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-slate-600">Description</label>
                <textarea
                  rows={2}
                  value={selectedCategoryData.description || ''}
                  onChange={(e) => setSelectedCategoryData({ ...selectedCategoryData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800 outline-hidden focus:border-slate-400 resize-none"
                  placeholder="e.g. Sweet treats and hot coffee"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setCategoryDialogOpen(false); setSelectedCategoryData(null); }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOG MODAL */}
      {deleteDialogOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => { setDeleteDialogOpen(false); setItemToDelete(null); }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          <div className="bg-white border border-slate-200 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative z-10 text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-slate-900">Delete Menu Item?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-700">"{itemToDelete.name}"</span>? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setDeleteDialogOpen(false); setItemToDelete(null); }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                No, Keep It
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuManagementPage;
