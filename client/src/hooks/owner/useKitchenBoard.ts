import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types/order';
import { INITIAL_ORDERS } from '../../data/orders';
import { moveOrderInList } from '../../utils/orderHelpers';
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const useKitchenBoard = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('resto_kitchen_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'ALL' | 'DELIVERY' | 'PICKUP'>('ALL');

  useEffect(() => {
    localStorage.setItem('resto_kitchen_orders', JSON.stringify(orders));
  }, [orders]);

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
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const handleResetBoard = () => {
    setOrders(INITIAL_ORDERS);
  };

  const handleAddManualOrder = (newOrderData: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      createdAt: 'just now',
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveDragId(active.id as string);
    const foundOrder = orders.find((o) => o.id === active.id);
    if (foundOrder) setActiveOrder(foundOrder);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeIndex = orders.findIndex((o) => o.id === activeId);
    if (activeIndex === -1) return;
    const activeOrderObj = orders[activeIndex];

    let targetStatus: OrderStatus | null = null;
    if (['NEW', 'PREPARING', 'READY'].includes(overId)) {
      targetStatus = overId as OrderStatus;
    } else {
      const overOrder = orders.find((o) => o.id === overId);
      if (overOrder) targetStatus = overOrder.status;
    }

    if (targetStatus && activeOrderObj.status !== targetStatus) {
      setOrders((prev) => {
        const overIndex = prev.findIndex((o) => o.id === overId);
        const updated = prev.map((o) =>
          o.id === activeId ? { ...o, status: targetStatus! } : o
        );
        if (overIndex !== -1) {
          const activeIdxInUpdated = updated.findIndex((o) => o.id === activeId);
          return arrayMove(updated, activeIdxInUpdated, overIndex);
        }
        return updated;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    setActiveOrder(null);
    if (!over) return;
    setOrders((prev) => moveOrderInList(prev, active.id as string, over.id as string));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.includes(searchQuery);
    const matchesType = orderTypeFilter === 'ALL' || order.orderType === orderTypeFilter;
    return matchesSearch && matchesType;
  });

  return {
    orders: filteredOrders,
    activeOrder,
    handleProgressOrder,
    handleRegressOrder,
    handleArchiveOrder,
    handleResetBoard,
    handleAddManualOrder,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
};