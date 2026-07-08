import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Plus,
  Trash2,
  Info,
  Clock,
  LayoutGrid,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu,
  Inbox,
  Flame,
  CheckCircle2,
  Package,
  GripVertical,
  MessageSquare,
  Truck,
  ShoppingBag,
  ChefHat,
  Minimize2,
  Maximize2,
} from 'lucide-react';

// --- INLINED TYPES ---
export type OrderStatus = 'NEW' | 'PREPARING' | 'READY';
export type OrderType = 'DELIVERY' | 'PICKUP';

export interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  orderType: OrderType;
  status: OrderStatus;
  customerName: string;
  avatar?: string;
  total: number;
  items: OrderItem[];
  notes?: string;
}

interface OwnerOrdersPageProps {
  userEmail: string | null;
  onLogout: () => void;
}

// --- INITIAL MOCK DATA ---
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8291',
    orderNumber: '#RM-8291',
    createdAt: '4m ago',
    orderType: 'DELIVERY',
    status: 'NEW',
    customerName: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
    total: 42.50,
    items: [
      { name: 'Truffle Mushroom Burger', quantity: 2 },
      { name: 'Sweet Potato Fries', quantity: 1 }
    ],
    notes: 'Please leave at the door and ring the bell.'
  },
  {
    id: 'ord-8292',
    orderNumber: '#RM-8292',
    createdAt: '12m ago',
    orderType: 'PICKUP',
    status: 'NEW',
    customerName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
    total: 28.00,
    items: [
      { name: 'Avocado Toast', quantity: 1 },
      { name: 'Iced Latte', quantity: 2 }
    ]
  },
  {
    id: 'ord-8293',
    orderNumber: '#RM-8293',
    createdAt: '2m ago',
    orderType: 'DELIVERY',
    status: 'NEW',
    customerName: 'David Miller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
    total: 55.00,
    items: [
      { name: 'Steak Frites', quantity: 1 },
      { name: 'Red Wine Glass', quantity: 1 }
    ]
  },
  {
    id: 'ord-8288',
    orderNumber: '#RM-8288',
    createdAt: '25m ago',
    orderType: 'DELIVERY',
    status: 'PREPARING',
    customerName: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60',
    total: 36.20,
    items: [
      { name: 'Spicy Miso Ramen', quantity: 2 },
      { name: 'Pork Gyoza', quantity: 1 }
    ],
    notes: 'Extra spicy level 5!'
  },
  {
    id: 'ord-8285',
    orderNumber: '#RM-8285',
    createdAt: '45m ago',
    orderType: 'PICKUP',
    status: 'READY',
    customerName: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    total: 31.50,
    items: [
      { name: 'Margherita Pizza', quantity: 1 },
      { name: 'Caesar Salad', quantity: 1 }
    ]
  }
];

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const OwnerOrdersPage: React.FC<OwnerOrdersPageProps> = ({
  userEmail,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- CORE STATE ---
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('resto_kitchen_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [profile, setProfile] = useState({
    name: 'The Bistro Lounge',
    cuisineType: 'Modern Fusion Italian',
    email: 'manager@bistrolounge.com',
    phone: '+1 (555) 234-5678',
    address: '420 Broadway, New York, NY 10013',
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('resto_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('resto_kitchen_orders', JSON.stringify(orders));
  }, [orders]);

  // --- INTERACTIVE DIALOG MODALS ---
  const [newOrderOpen, setNewOrderOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<Order | null>(null);
  const [completedTickets, setCompletedTickets] = useState<Order[]>([]);

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(true);

  // Filter and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'ALL' | 'DELIVERY' | 'PICKUP'>('ALL');
  const [mobileActiveTab, setMobileActiveTab] = useState<OrderStatus>('NEW');

  // --- NATIVE DRAG & DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: targetStatus } : order
      )
    );
  };

  // --- ACTIONS ---
  const handleProgressOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        let newStatus: OrderStatus = order.status;
        if (order.status === 'NEW') newStatus = 'PREPARING';
        else if (order.status === 'PREPARING') newStatus = 'READY';
        return { ...order, status: newStatus };
      })
    );
  };

  const handleRegressOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        let newStatus: OrderStatus = order.status;
        if (order.status === 'READY') newStatus = 'PREPARING';
        else if (order.status === 'PREPARING') newStatus = 'NEW';
        return { ...order, status: newStatus };
      })
    );
  };

  const handleArchiveOrder = (orderId: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      setCompletedTickets((prev) => [{ ...target, status: 'READY' }, ...prev]);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleResetBoard = () => {
    setOrders(INITIAL_ORDERS);
    setSettingsOpen(false);
  };

  // --- STATEFUL MANUAL ORDER FORM ---
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formOrderType, setFormOrderType] = useState<OrderType>('DELIVERY');
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<OrderItem[]>([{ name: '', quantity: 1 }]);
  const [formError, setFormError] = useState('');

  const handleAddFormItem = () => {
    setFormItems((prev) => [...prev, { name: '', quantity: 1 }]);
  };

  const handleRemoveFormItem = (index: number) => {
    if (formItems.length === 1) return;
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormItemChange = (index: number, field: 'name' | 'quantity', value: any) => {
    setFormItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomerName.trim()) {
      setFormError('Please enter a customer name.');
      return;
    }
    const cleanItems = formItems.filter((i) => i.name.trim() !== '');
    if (cleanItems.length === 0) {
      setFormError('Please enter at least one item name.');
      return;
    }

    const calculatedTotal = cleanItems.reduce((acc, current) => acc + current.quantity * 12.5, 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#RM-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      orderType: formOrderType,
      status: 'NEW',
      customerName: formCustomerName,
      total: calculatedTotal,
      items: cleanItems,
      notes: formNotes,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reset Form
    setFormCustomerName('');
    setFormOrderType('DELIVERY');
    setFormNotes('');
    setFormItems([{ name: '', quantity: 1 }]);
    setFormError('');
    setNewOrderOpen(false);
  };

  // --- PROFILE FORM STATES ---
  const [profName, setProfName] = useState(profile.name);
  const [profCuisine, setProfCuisine] = useState(profile.cuisineType);
  const [profEmail, setProfEmail] = useState(profile.email);
  const [profPhone, setProfPhone] = useState(profile.phone);
  const [profAddress, setProfAddress] = useState(profile.address);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: profName,
      cuisineType: profCuisine,
      email: profEmail,
      phone: profPhone,
      address: profAddress,
    };
    setProfile(updated);
    localStorage.setItem('resto_profile', JSON.stringify(updated));
    setProfileOpen(false);
  };

  // Sync profile editing fields when profile changes
  useEffect(() => {
    setProfName(profile.name);
    setProfCuisine(profile.cuisineType);
    setProfEmail(profile.email);
    setProfPhone(profile.phone);
    setProfAddress(profile.address);
  }, [profile]);

  // Filter calculations
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = orderTypeFilter === 'ALL' || order.orderType === orderTypeFilter;
    return matchesSearch && matchesType;
  });

  const newOrdersList = filteredOrders.filter((o) => o.status === 'NEW');
  const preparingOrdersList = filteredOrders.filter((o) => o.status === 'PREPARING');
  const readyOrdersList = filteredOrders.filter((o) => o.status === 'READY');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f9fafb] w-full font-sans antialiased text-[#111827]">
      {/* --- INLINED SIDEBAR --- */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-slate-150 flex flex-col justify-between p-6 lg:h-screen lg:sticky lg:top-0 shrink-0 z-10">
        <div className="flex flex-col gap-8 w-full">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3.5 px-1 text-left">
            <div className="w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M12 4L4 12l8 8 8-8-8-8z" />
              </svg>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-lg font-black tracking-tight text-[#111827] leading-none">RestoManager</h2>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1.5">
                OWNER PORTAL
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shrink-0 cursor-pointer"
            >
              <LayoutGrid className="w-4.5 h-4.5" />
              <span className="hidden lg:inline">Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/kitchen')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold bg-[#f3f4f6] text-[#111827] transition-all shrink-0 cursor-pointer"
            >
              <ClipboardList className="w-4.5 h-4.5 text-[#111827]" />
              <span className="hidden lg:inline">Orders</span>
            </button>
            <button
              onClick={() => navigate('/menu-management')}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shrink-0 cursor-pointer"
            >
              <UtensilsCrossed className="w-4.5 h-4.5" />
              <span className="hidden lg:inline">Menu Editor</span>
            </button>
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all shrink-0 cursor-pointer"
            >
              <Settings className="w-4.5 h-4.5" />
              <span className="hidden lg:inline">Restaurant Profile</span>
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="hidden lg:block pt-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-[#111827] hover:bg-slate-50 rounded-2xl text-[14px] font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 flex flex-col p-6 lg:p-8 max-w-7xl mx-auto w-full gap-6">
        
        {/* Header Title with Counters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 text-left">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Kitchen Display System</h1>
            <p className="text-xs text-slate-400 font-bold mt-1">
              Active Store: <span className="text-slate-700 font-extrabold">{profile.name}</span> • {profile.cuisineType}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setHistoryOpen(true)}
              className="h-10 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>History ({completedTickets.length})</span>
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="h-10 w-10 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-2xl transition-all cursor-pointer flex items-center justify-center"
              title="Alert configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setNewOrderOpen(true)}
              className="h-10 px-4.5 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-2xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* --- STATS COUNTER SLATE --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Total Tickets</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">{orders.length}</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">New orders</span>
            <span className="text-xl font-black text-amber-600 mt-1 block">{orders.filter(o => o.status === 'NEW').length}</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">In prep</span>
            <span className="text-xl font-black text-[#d97706] mt-1 block">{orders.filter(o => o.status === 'PREPARING').length}</span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">Dispatched</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">{completedTickets.length}</span>
          </div>
        </div>

        {/* --- SEARCH AND FILTERS --- */}
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full bg-white border border-slate-100 p-3 rounded-3xl">
          <div className="relative flex-1 w-full">
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by ID, guest name, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-transparent border-0 text-xs focus:ring-0 placeholder-slate-400 font-semibold"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setOrderTypeFilter('ALL')}
              className={`flex-1 sm:flex-initial px-4 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                orderTypeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setOrderTypeFilter('DELIVERY')}
              className={`flex-1 sm:flex-initial px-4 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                orderTypeFilter === 'DELIVERY' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setOrderTypeFilter('PICKUP')}
              className={`flex-1 sm:flex-initial px-4 py-2 text-[11px] font-black rounded-xl transition-all cursor-pointer ${
                orderTypeFilter === 'PICKUP' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pickup
            </button>
          </div>
        </div>

        {/* --- MOBILE STATION SELECTOR --- */}
        <div className="md:hidden flex bg-slate-100 p-1 rounded-2xl border border-slate-200/40 mb-2">
          <button
            onClick={() => setMobileActiveTab('NEW')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mobileActiveTab === 'NEW'
                ? 'bg-white text-slate-800 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 shrink-0" />
            <span>New ({newOrdersList.length})</span>
          </button>
          <button
            onClick={() => setMobileActiveTab('PREPARING')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mobileActiveTab === 'PREPARING'
                ? 'bg-white text-slate-800 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span>Prep ({preparingOrdersList.length})</span>
          </button>
          <button
            onClick={() => setMobileActiveTab('READY')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mobileActiveTab === 'READY'
                ? 'bg-white text-slate-800 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Ready ({readyOrdersList.length})</span>
          </button>
        </div>

        {/* --- KITCHEN BOARD COLUMNS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start w-full">
          
          {/* COLUMN 1: NEW ORDERS */}
          <div
            className={`flex-1 flex flex-col pb-4 ${mobileActiveTab === 'NEW' ? 'block' : 'hidden md:block'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'NEW')}
          >
            <div className="flex items-center justify-between p-4 px-5 rounded-2xl mb-4 border border-slate-100 bg-slate-100 select-none">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-800" />
                <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">New Orders</h3>
              </div>
              <span className="text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full bg-slate-200/60 text-slate-700">
                {newOrdersList.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {newOrdersList.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-4 bg-white/50">
                  <p className="text-[11px] font-bold text-slate-400">No new orders</p>
                </div>
              ) : (
                newOrdersList.map((order) => (
                  <div
                    key={order.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order.id)}
                    className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs flex flex-col gap-4 text-left cursor-grab active:cursor-grabbing hover:border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 font-mono">{order.orderNumber}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 border border-slate-200 text-slate-500 rounded-full bg-slate-50">
                        {order.orderType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.avatar ? (
                        <img src={order.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-150" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-150 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {order.customerName[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{order.customerName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{order.items.length} items • {formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600 font-medium">
                          <span className="text-slate-900 font-extrabold mr-1.5">x{item.quantity}</span>
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleProgressOrder(order.id)}
                        className="flex-1 h-9 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Start Preparing</span>
                      </button>
                      <button
                        onClick={() => { setSelectedTicket(order); setDetailsOpen(true); }}
                        className="w-9 h-9 border border-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 2: PREPARING */}
          <div
            className={`flex-1 flex flex-col pb-4 ${mobileActiveTab === 'PREPARING' ? 'block' : 'hidden md:block'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'PREPARING')}
          >
            <div className="flex items-center justify-between p-4 px-5 rounded-2xl mb-4 border border-slate-100 bg-[#ffebd9] select-none">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-[#d97706]" />
                <h3 className="text-xs font-black uppercase tracking-tight text-[#d97706]">Preparing</h3>
              </div>
              <span className="text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full bg-[#ffcfb0]/40 text-[#c2410c]">
                {preparingOrdersList.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {preparingOrdersList.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-4 bg-white/50">
                  <p className="text-[11px] font-bold text-slate-400">No active prep</p>
                </div>
              ) : (
                preparingOrdersList.map((order) => (
                  <div
                    key={order.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order.id)}
                    className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs flex flex-col gap-4 text-left cursor-grab active:cursor-grabbing hover:border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 font-mono">{order.orderNumber}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 border border-slate-200 text-slate-500 rounded-full bg-slate-50">
                        {order.orderType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.avatar ? (
                        <img src={order.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-150" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-150 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {order.customerName[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{order.customerName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{order.items.length} items • {formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600 font-medium">
                          <span className="text-slate-900 font-extrabold mr-1.5">x{item.quantity}</span>
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleRegressOrder(order.id)}
                        className="w-9 h-9 border border-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center cursor-pointer"
                        title="Move Back"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleProgressOrder(order.id)}
                        className="flex-1 h-9 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Mark as Ready</span>
                      </button>
                      <button
                        onClick={() => { setSelectedTicket(order); setDetailsOpen(true); }}
                        className="w-9 h-9 border border-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 3: READY FOR PICKUP */}
          <div
            className={`flex-1 flex flex-col pb-4 ${mobileActiveTab === 'READY' ? 'block' : 'hidden md:block'}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'READY')}
          >
            <div className="flex items-center justify-between p-4 px-5 rounded-2xl mb-4 border border-slate-100 bg-[#ecfdf5] select-none">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-800" />
                <h3 className="text-xs font-black uppercase tracking-tight text-emerald-800">Ready for Pickup</h3>
              </div>
              <span className="text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                {readyOrdersList.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              {readyOrdersList.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-4 bg-white/50">
                  <p className="text-[11px] font-bold text-slate-400">No ready orders</p>
                </div>
              ) : (
                readyOrdersList.map((order) => (
                  <div
                    key={order.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order.id)}
                    className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs flex flex-col gap-4 text-left cursor-grab active:cursor-grabbing hover:border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 font-mono">{order.orderNumber}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 border border-slate-200 text-slate-500 rounded-full bg-slate-50">
                        {order.orderType}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.avatar ? (
                        <img src={order.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-150" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-150 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {order.customerName[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{order.customerName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{order.items.length} items • {formatCurrency(order.total)}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center text-xs text-slate-600 font-medium">
                          <span className="text-slate-900 font-extrabold mr-1.5">x{item.quantity}</span>
                          <span className="truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleRegressOrder(order.id)}
                        className="w-9 h-9 border border-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center cursor-pointer"
                        title="Move Back"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleArchiveOrder(order.id)}
                        className="flex-1 h-9 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Dispatch Order</span>
                      </button>
                      <button
                        onClick={() => { setSelectedTicket(order); setDetailsOpen(true); }}
                        className="w-9 h-9 border border-slate-200 text-slate-400 hover:text-slate-700 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      {/* --- MODAL 1: MANUAL ORDER CREATION --- */}
      {newOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setNewOrderOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" />
          <form
            onSubmit={handleCreateOrderSubmit}
            className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-md shadow-2xl relative z-10 text-left space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Create Manual Order</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Simulate customer orders arriving at the display</p>
              </div>
              <button
                type="button"
                onClick={() => setNewOrderOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 text-red-600 border border-red-150 p-2.5 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formCustomerName}
                  onChange={(e) => setFormCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Order Fulfillment</label>
                <select
                  value={formOrderType}
                  onChange={(e) => setFormOrderType(e.target.value as OrderType)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                >
                  <option value="DELIVERY">Delivery</option>
                  <option value="PICKUP">Pickup</option>
                </select>
              </div>

              {/* Items List inside Form */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider">Ordered Dishes</label>
                  <button
                    type="button"
                    onClick={handleAddFormItem}
                    className="text-[10px] font-black text-slate-900 hover:underline cursor-pointer"
                  >
                    + Add Dish
                  </button>
                </div>

                <div className="space-y-2">
                  {formItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="e.g. Truffle Pizza"
                        value={item.name}
                        onChange={(e) => handleFormItemChange(idx, 'name', e.target.value)}
                        className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleFormItemChange(idx, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16 h-9 px-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-center focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFormItem(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Special Chef Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Allergy warning, extra spicy..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold h-16 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setNewOrderOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Launch Order
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 2: RESTAURANT PROFILE EDITOR --- */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setProfileOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" />
          <form
            onSubmit={handleSaveProfile}
            className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative z-10 text-left space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Edit Restaurant Profile</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Update store branding and metadata</p>
              </div>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Store Name</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Cuisine Accent</label>
                <input
                  type="text"
                  required
                  value={profCuisine}
                  onChange={(e) => setProfCuisine(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Telephone</label>
                <input
                  type="text"
                  required
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-400 tracking-wider mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={profAddress}
                  onChange={(e) => setProfAddress(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: DISPATCH HISTORY LOGS --- */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setHistoryOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" />
          <div className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-md shadow-2xl relative z-10 text-left flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <h3 className="text-sm font-black text-slate-900">Dispatched Logs</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Historically completed tickets in this terminal session</p>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 space-y-1 py-3">
              {completedTickets.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-xs font-bold text-slate-800">No history logged yet</p>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto leading-normal">
                    Complete and dispatch tickets from the "Ready" column to populate logs.
                  </p>
                </div>
              ) : (
                completedTickets.map((ticket, index) => (
                  <div key={index} className="py-3.5 flex justify-between items-start text-xs font-medium">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-slate-900">{ticket.orderNumber}</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 px-1.5 py-0.2 rounded font-bold">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">Customer: {ticket.customerName} ({ticket.orderType})</p>
                      <ul className="text-[10px] text-slate-400 space-y-0.5">
                        {ticket.items.map((item, idx) => (
                          <li key={idx}>• {item.name} <span className="font-bold font-mono">x{item.quantity}</span></li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 font-mono text-xs">{formatCurrency(ticket.total)}</span>
                      <p className="text-[9px] text-slate-400 mt-1">Dispatched</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setHistoryOpen(false)}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: SYSTEM SETTINGS --- */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSettingsOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs" />
          <div className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative z-10 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-sans">Settings & Demo Controls</h3>
                <p className="text-[10px] text-slate-400 font-semibold">Terminal setup and demo resets</p>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-left max-w-[70%]">
                  <span className="block text-xs font-bold text-slate-800">Alert Sound Notification</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">Sound chime alert when new ticket is launched</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-950"
                />
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-left max-w-[70%]">
                  <span className="block text-xs font-bold text-slate-800">Expedition Glow Pulse</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">Visual flash for urgent delayed tickets</span>
                </div>
                <input
                  type="checkbox"
                  checked={flashEnabled}
                  onChange={(e) => setFlashEnabled(e.target.checked)}
                  className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-950"
                />
              </div>
            </div>

            <div className="flex gap-2 shrink-0 pt-3 border-t border-slate-100">
              <button
                onClick={handleResetBoard}
                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reset Demo Data
              </button>
              <button
                onClick={() => setSettingsOpen(false)}
                className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: ORDER TICKET DETAILS SPECIFICATIONS --- */}
      {detailsOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => { setDetailsOpen(false); setSelectedTicket(null); }}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
          />
          <div className="bg-white border border-slate-100 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative z-10 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-left">
                <h3 className="text-sm font-black text-slate-900 font-mono">Ticket {selectedTicket.orderNumber}</h3>
                <span className="text-[10px] text-slate-400 font-bold mt-0.5 block font-mono">Fulfillment Mode: {selectedTicket.orderType}</span>
              </div>
              <button
                onClick={() => { setDetailsOpen(false); setSelectedTicket(null); }}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Customer Name</span>
                <p className="text-xs font-black text-slate-800">{selectedTicket.customerName}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Ordered Dishes</span>
                <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {selectedTicket.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex justify-between items-center bg-white text-xs">
                      <span className="font-bold text-slate-700">{item.name}</span>
                      <span className="font-mono text-slate-400 font-black bg-slate-50 px-2.5 py-0.5 rounded-md">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTicket.notes && (
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">Prep Notes</span>
                  <p className="text-[11px] text-amber-950 font-medium leading-normal italic">
                    "{selectedTicket.notes}"
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-black text-slate-800 border-t border-slate-100 pt-3">
                <span>Total charged:</span>
                <span className="font-mono text-sm">{formatCurrency(selectedTicket.total)}</span>
              </div>
            </div>

            <button
              onClick={() => { setDetailsOpen(false); setSelectedTicket(null); }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              Return to Display
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerOrdersPage;
