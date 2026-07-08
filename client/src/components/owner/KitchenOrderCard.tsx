import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Order } from '../../types/order';
import { formatCurrency } from '../../utils/orderHelpers';
import { Clock, Info } from 'lucide-react';

interface KitchenOrderCardProps {
  order: Order;
  onProgress: (id: string) => void;
  onRegress: (id: string) => void;
  onArchive: (id: string) => void;
  onOpenDetails: (order: Order) => void;
}

export const KitchenOrderCard: React.FC<KitchenOrderCardProps> = ({
  order,
  onProgress,
  onRegress,
  onArchive,
  onOpenDetails,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: order.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const isDelayed = order.createdAt.includes('25') || order.createdAt.includes('45');

  const getActionButtonContent = () => {
    switch (order.status) {
      case 'NEW':
        return {
          text: 'Start Preparing',
          icon: (
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ),
          handler: () => onProgress(order.id)
        };
      case 'PREPARING':
        return {
          text: 'Mark as Ready',
          icon: (
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          ),
          handler: () => onProgress(order.id)
        };
      case 'READY':
      default:
        return {
          text: 'Dispatch Order',
          icon: (
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          handler: () => onArchive(order.id)
        };
    }
  };

  const action = getActionButtonContent();

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`order-card-${order.id}`}
      {...attributes}
      {...listeners}
      className={`group bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all text-left relative cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'ring-2 ring-slate-400/20 shadow-lg opacity-40' : 'hover:shadow-sm hover:border-slate-200/60'
      }`}
    >
      {isDelayed && (
        <div className="absolute right-0 top-0 bottom-0 w-[5px] bg-[#f87171] rounded-r-3xl" />
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 font-mono tracking-tight">
          {order.orderNumber}
        </span>
        <div className="flex items-center gap-1">
          <Clock className={`w-3 h-3 ${isDelayed ? 'text-[#f87171]' : 'text-slate-400'}`} />
          <span className={`text-[10px] font-bold ${isDelayed ? 'text-[#f87171]' : 'text-slate-400'}`}>
            {order.createdAt}
          </span>
        </div>
        <span className="text-[9px] font-extrabold px-2.5 py-0.5 border border-slate-200 text-slate-500 rounded-full tracking-wider uppercase bg-white">
          {order.orderType}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {order.avatar ? (
          <img src={order.avatar} alt={order.customerName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-100 shadow-3xs" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-100">
            {order.customerName[0]}
          </div>
        )}
        <div className="min-w-0 text-left">
          <h4 className="text-xs font-black text-slate-800 truncate leading-snug">
            {order.customerName}
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items • {formatCurrency(order.total)}
          </p>
        </div>
      </div>

      <div className="space-y-1 pt-1.5 pb-2">
        {order.items.map((item, index) => (
          <div key={item.id || `${item.name}-${index}`} className="flex items-center text-[11px] text-slate-600 font-medium">
            <span className="text-slate-900 font-extrabold mr-1.5 shrink-0">{item.quantity}x</span>
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100/60 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            action.handler();
          }}
          className="flex-1 h-9 bg-slate-900 hover:bg-black text-white text-[11px] font-black rounded-full transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          {action.icon}
          <span>{action.text}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(order);
          }}
          className="w-9 h-9 flex items-center justify-center border border-slate-200 hover:border-slate-400 text-slate-400 hover:text-slate-800 rounded-full transition-all shrink-0 cursor-pointer"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};