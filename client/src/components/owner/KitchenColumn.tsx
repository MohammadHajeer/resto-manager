import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Order, OrderStatus } from '../../types/order';
import { KitchenOrderCard } from './KitchenOrderCard';
import { Clock, ChefHat, Package } from 'lucide-react';

interface KitchenColumnProps {
  status: OrderStatus;
  title: string;
  orders: Order[];
  accentColor: 'gray' | 'orange' | 'green';
  onProgress: (id: string) => void;
  onRegress: (id: string) => void;
  onArchive: (id: string) => void;
  onOpenDetails: (order: Order) => void;
}

export const KitchenColumn: React.FC<KitchenColumnProps> = ({
  status,
  title,
  orders,
  accentColor,
  onProgress,
  onRegress,
  onArchive,
  onOpenDetails,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const headerStyles = {
    gray: {
      headerBg: 'bg-slate-100',
      headerText: 'text-slate-800',
      badgeBg: 'bg-slate-200/60 text-slate-700',
      icon: <Clock className="w-4 h-4 text-slate-800" />
    },
    orange: {
      headerBg: 'bg-[#ffebd9]',
      headerText: 'text-[#d97706]',
      badgeBg: 'bg-[#ffcfb0]/40 text-[#c2410c]',
      icon: <ChefHat className="w-4 h-4 text-[#d97706]" />
    },
    green: {
      headerBg: 'bg-[#ecfdf5]',
      headerText: 'text-emerald-800',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: <Package className="w-4 h-4 text-emerald-800" />
    }
  };

  const currentStyle = headerStyles[accentColor];

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex flex-col min-h-[500px] lg:min-h-[65vh] transition-colors duration-200 pb-4 ${
        isOver ? 'bg-slate-50/50 rounded-2xl' : ''
      }`}
    >
      <div className={`flex items-center justify-between p-4 px-5 rounded-2xl mb-5 border border-slate-100/50 select-none ${currentStyle.headerBg}`}>
        <div className="flex items-center gap-2.5">
          {currentStyle.icon}
          <h3 className={`text-xs font-extrabold tracking-tight ${currentStyle.headerText}`}>
            {title}
          </h3>
        </div>
        <span className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full ${currentStyle.badgeBg}`}>
          {orders.length}
        </span>
      </div>

      <div className="flex-1 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {orders.length === 0 ? (
          <div className="h-44 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center p-4">
            <p className="text-[11px] font-bold text-slate-400">No orders at this station</p>
          </div>
        ) : (
          <SortableContext items={orders.map((o) => o.id)} strategy={verticalListSortingStrategy}>
            {orders.map((order) => (
              <KitchenOrderCard
                key={order.id}
                order={order}
                onProgress={onProgress}
                onRegress={onRegress}
                onArchive={onArchive}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};