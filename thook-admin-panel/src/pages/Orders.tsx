import { useState } from 'react';
import { mockOrders } from '../data/mock';
import type { Order, OrderStatus } from '../types';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const STATUS_FLOW: Record<string, OrderStatus | null> = {
  PENDING: 'ACCEPTED',
  ACCEPTED: 'DISPATCHED',
  DISPATCHED: 'DELIVERED',
  DELIVERED: null,
  FAILED: null,
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Accept',
  ACCEPTED: 'Dispatch',
  DISPATCHED: 'Mark Delivered',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user_phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = STATUS_FLOW[o.status];
        return next ? { ...o, status: next } : o;
      })
    );
  };

  return (
    <div className="orders-page">
      <h2 className="section-title">Orders</h2>

      <div className="orders-toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by order ID or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {['ALL', 'PENDING', 'ACCEPTED', 'DISPATCHED', 'DELIVERED', 'FAILED'].map((s) => (
            <button
              key={s}
              className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              {s !== 'ALL' && (
                <span className="filter-count">
                  {orders.filter((o) => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filtered.map((order) => (
          <div key={order.id} className="order-card card">
            <div
              className="order-summary"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div className="order-main">
                <span className="mono order-id">{order.id}</span>
                <span className="order-phone">{order.user_phone}</span>
                <span className="order-amount">₹{order.total_amount}</span>
                <StatusBadge status={order.status} />
                <span className="order-date">
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="order-actions-row">
                {STATUS_FLOW[order.status] && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => { e.stopPropagation(); advanceStatus(order.id); }}
                  >
                    {STATUS_LABELS[order.status]}
                  </button>
                )}
                {expandedId === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {expandedId === order.id && (
              <div className="order-details">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price_at_purchase}</td>
                        <td>₹{item.quantity * item.price_at_purchase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">No orders match your criteria</div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}
