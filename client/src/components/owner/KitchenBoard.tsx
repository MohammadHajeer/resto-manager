import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { Order, OrderStatus } from '../../types/order';
import { KitchenColumn } from './KitchenColumn';
import { DragOverlayCard } from '../DragOverlayCard';
import { useDragSensors } from '../../hooks/owner/useDragSensors';
import { Inbox, Flame, CheckCircle2 } from 'lucide-react';

interface KitchenBoardProps {
  orders: Order[];
  activeOrder: Order | null;
  onDragStart: (event: any) => void;
  onDragEnd: (event: any) => void;
  onDragOver?: (event: any) => void;
  onProgress: (id: string) => void;
  onRegress: (id: string) => void;
  onArchive: (id: string) => void;
  onOpenDetails: (order: Order) => void;
}

export const KitchenBoard: React.FC<KitchenBoardProps> = ({
  orders,
  activeOrder,
  onDragStart,
  onDragEnd,
  onDragOver,
  onProgress,
  onRegress,
  onArchive,
  onOpenDetails,
}) => {
  const [mobileActiveTab, setMobileActiveTab] = useState<OrderStatus>('NEW');
  const sensors = useDragSensors();

  const newOrders = orders.filter((o) => o.status === 'NEW');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex flex-col flex-1 w-full mt-2">
        {/* Mobile Tabs */}
        <div className="md:hidden flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 mb-5 mx-1">
          <button
            onClick={() => setMobileActiveTab('NEW')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              mobileActiveTab === 'NEW' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-500'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 shrink-0" />
            <span>New ({newOrders.length})</span>
          </button>
          <button
            onClick={() => setMobileActiveTab('PREPARING')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              mobileActiveTab === 'PREPARING' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-500'
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span>Preparing ({preparingOrders.length})</span>
          </button>
          <button
            onClick={() => setMobileActiveTab('READY')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              mobileActiveTab === 'READY' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-500'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Ready ({readyOrders.length})</span>
          </button>
        </div>

        {/* Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-start w-full">
          <div className={mobileActiveTab === 'NEW' ? 'block' : 'hidden md:block'}>
            <KitchenColumn
              status="NEW"
              title="New Orders"
              orders={newOrders}
              accentColor="gray"
              onProgress={onProgress}
              onRegress={onRegress}
              onArchive={onArchive}
              onOpenDetails={onOpenDetails}
            />
          </div>

          <div className={mobileActiveTab === 'PREPARING' ? 'block' : 'hidden md:block'}>
            <KitchenColumn
              status="PREPARING"
              title="Preparing"
              orders={preparingOrders}
              accentColor="orange"
              onProgress={onProgress}
              onRegress={onRegress}
              onArchive={onArchive}
              onOpenDetails={onOpenDetails}
            />
          </div>

          <div className={mobileActiveTab === 'READY' ? 'block' : 'hidden md:block'}>
            <KitchenColumn
              status="READY"
              title="Ready for Pickup"
              orders={readyOrders}
              accentColor="green"
              onProgress={onProgress}
              onRegress={onRegress}
              onArchive={onArchive}
              onOpenDetails={onOpenDetails}
            />
          </div>
        </div>

        <DragOverlay adjustScale={false}>
          {activeOrder ? <DragOverlayCard order={activeOrder} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};