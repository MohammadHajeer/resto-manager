import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FolderPlus, 
  ArrowUpDown, 
  LayoutDashboard, 
  Sparkles, 
  RefreshCw, 
  PlusCircle,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../../services/menu.service';
import { categoryService } from '../../services/category.service';
import { MenuItemFormData, CategoryData, CategoryFormData } from '../../validators'; 

// Local self-contained hooks
export function useMenu() {
  const queryClient = useQueryClient();

  const menuQuery = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => menuService.getMenuItems(),
  });

  const createMutation = useMutation({
    mutationFn: (item: MenuItemFormData) => menuService.createMenuItem(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, item }: { id: string; item: MenuItemFormData }) =>
      menuService.updateMenuItem(id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuService.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  return {
    menuItems: menuQuery.data || [],
    isLoading: menuQuery.isLoading,
    isError: menuQuery.isError,
    refetch: menuQuery.refetch,
    createItem: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateItem: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteItem: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    select: (data) => [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  });

  const createMutation = useMutation({
    mutationFn: (category: CategoryFormData) => categoryService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, category }: { id: string; category: CategoryFormData }) =>
      categoryService.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (categories: CategoryData[]) => categoryService.reorderCategories(categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    createCategory: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCategory: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCategory: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    reorderCategories: reorderMutation.mutateAsync,
    isReordering: reorderMutation.isPending,
  };
}

// Sub-components
import { MenuStats } from '../../components/menu/MenuStats';
import { MenuToolbar } from '../../components/menu/MenuToolbar';
import { CategoryHeader } from '../../components/menu/CategoryHeader';
import { MenuCard } from '../../components/menu/MenuCard';
import { AddMenuCard } from '../../components/menu/AddMenuCard';
import { MenuDrawer } from '../../components/menu/MenuDrawer';
import { MenuForm } from '../../components/menu/MenuForm';
import { CategoryDialog } from '../../components/menu/CategoryDialog';
import { DeleteDialog } from '../../components/menu/DeleteDialog';

interface MenuManagementPageProps {
  userEmail: string | null;
  onLogout: () => void;
}

export const MenuManagementPage: React.FC<MenuManagementPageProps> = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();

  // Load menu query hooks
  const { menuItems, isLoading: isMenuLoading, createItem, updateItem, deleteItem } = useMenu();
  const { categories, isLoading: isCatLoading, createCategory, updateCategory, deleteCategory, reorderCategories } = useCategories();

  // Local state for filters and search queries
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyPublished, setShowOnlyPublished] = useState(false);

  // Modal & Drawer management state
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
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-md text-center space-y-4">
          <h2 className="text-lg font-black text-foreground">Access Denied</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You must be authenticated to access the RestoManager Menu Management system.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-all cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // --- MENU ITEM OPERATIONS ---

  const handleCreateNewItemClick = (categoryName?: string) => {
    setSelectedMenuItem({
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
    setSelectedMenuItem(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = async (data: MenuItemFormData) => {
    try {
      if (selectedMenuItem?.id) {
        // Update existing item
        await updateItem({ id: selectedMenuItem.id, item: data });
      } else {
        // Create new item
        await createItem(data);
      }
      setDrawerOpen(false);
      setSelectedMenuItem(null);
    } catch (err) {
      console.error('Failed to save menu item:', err);
    }
  };

  const handleDeleteItemClick = (item: MenuItemFormData) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete?.id) {
      try {
        await deleteItem(itemToDelete.id);
        setItemToDelete(null);
      } catch (err) {
        console.error('Failed to delete item:', err);
      }
    }
  };

  const handleDuplicateItem = async (item: MenuItemFormData) => {
    try {
      const copy: MenuItemFormData = {
        ...item,
        id: undefined, // Create as new
        name: `${item.name} (Copy)`,
        availability: true,
      };
      await createItem(copy);
    } catch (err) {
      console.error('Failed to duplicate menu item:', err);
    }
  };

  const handleToggleHideItem = async (item: MenuItemFormData) => {
    if (item.id) {
      try {
        const updated = {
          ...item,
          availability: !item.availability,
        };
        await updateItem({ id: item.id, item: updated });
      } catch (err) {
        console.error('Failed to toggle item state:', err);
      }
    }
  };

  // --- CATEGORY OPERATIONS ---

  const handleCreateCategoryClick = () => {
    setSelectedCategoryData(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategoryClick = (cat: CategoryData) => {
    setSelectedCategoryData(cat);
    setCategoryDialogOpen(true);
  };

  const handleCategoryFormSubmit = async (data: CategoryFormData) => {
    try {
      if (selectedCategoryData?.id) {
        await updateCategory({ id: selectedCategoryData.id, category: data });
      } else {
        await createCategory(data);
      }
      setCategoryDialogOpen(false);
      setSelectedCategoryData(null);
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (confirm('Are you sure you want to delete this category? All its items will be kept but set to uncategorized.')) {
      try {
        await deleteCategory(catId);
      } catch (err) {
        console.error('Failed to delete category:', err);
      }
    }
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
    const updated = [...categories];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      await reorderCategories(updated);
    }
  };

  const handleReorderAllCategories = async () => {
    // Sort alphabetically for instant alphabetical reordering
    const sorted = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    await reorderCategories(sorted);
  };

  // --- FILTERING AND SEARCH LOGIC ---

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPublished = !showOnlyPublished || item.availability;
    return matchesSearch && matchesCategory && matchesPublished;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 select-none border-none">
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
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-border hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer h-9 shadow-2xs"
            title="Auto sort categories alphabetically"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Reorder All</span>
          </button>
          <button
            onClick={handleCreateCategoryClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer h-9 shadow-sm"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-200" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* STATISTICS ROW */}
      <MenuStats items={menuItems} />

      {/* FILTER TOOLBAR */}
      <MenuToolbar
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        showOnlyPublished={showOnlyPublished}
        onPublishedToggle={setShowOnlyPublished}
      />

      {/* CATEGORIES SECTIONS */}
      {isMenuLoading || isCatLoading ? (
        <div className="text-center py-24 space-y-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-semibold">Synchronizing catalog database...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-2xl space-y-3">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-black text-foreground">No Categories Configured</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Every menu item requires a category. Please create your first category to get started.
          </p>
          <button
            onClick={handleCreateCategoryClick}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer shadow-sm"
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
              <div key={cat.id} className="space-y-5">
                {/* Section Header */}
                <CategoryHeader
                  category={cat}
                  itemCount={categoryItems.length}
                  onEdit={() => handleEditCategoryClick(cat)}
                  onDelete={() => handleDeleteCategory(cat.id!)}
                  onMoveUp={() => handleMoveCategory(catIdx, 'up')}
                  onMoveDown={() => handleMoveCategory(catIdx, 'down')}
                  isFirst={catIdx === 0}
                  isLast={catIdx === categories.length - 1}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={() => toggleCategoryCollapse(cat.id)}
                />

                {/* Cards Grid */}
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        onEdit={() => handleEditItemClick(item)}
                        onDelete={() => handleDeleteItemClick(item)}
                        onDuplicate={() => handleDuplicateItem(item)}
                        onToggleHide={() => handleToggleHideItem(item)}
                      />
                    ))}
                    
                    {/* Append AddNewItem card to current grid */}
                    <AddMenuCard onClick={() => handleCreateNewItemClick(cat.name)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SLIDING FORMS DRAWER */}
      <MenuDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedMenuItem(null);
        }}
        title={selectedMenuItem?.id ? 'Edit Menu Item' : 'Create New Menu Item'}
      >
        {selectedMenuItem && (
          <MenuForm
            initialValues={selectedMenuItem}
            categories={categories}
            onSubmit={handleFormSubmit}
          />
        )}
      </MenuDrawer>

      {/* CATEGORY FORM DIALOG */}
      <CategoryDialog
        isOpen={categoryDialogOpen}
        onClose={() => {
          setCategoryDialogOpen(false);
          setSelectedCategoryData(null);
        }}
        initialValues={selectedCategoryData || undefined}
        onSubmit={handleCategoryFormSubmit}
      />

      {/* DELETE DIALOG */}
      {itemToDelete && (
        <DeleteDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
          }}
          itemName={itemToDelete.name}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};
