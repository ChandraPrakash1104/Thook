import { useMemo } from 'react';
import { mockProducts, mockOrders } from '../data/mock';
import { ShoppingCart, IndianRupee, Package, Clock } from 'lucide-react';
import type { DashboardStats } from '../types';

export default function Dashboard() {
  const stats: DashboardStats = useMemo(() => ({
    totalOrders: mockOrders.length,
    totalRevenue: mockOrders
      .filter((o) => o.status !== 'FAILED')
      .reduce((sum, o) => sum + o.total_amount, 0),
    totalProducts: mockProducts.length,
    pendingOrders: mockOrders.filter((o) => o.status === 'PENDING').length,
  }), []);

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="dashboard">
      <h2 className="section-title">Dashboard</h2>

      <div className="stats-grid">
        <StatCard icon={<ShoppingCart size={24} />} label="Total Orders" value={stats.totalOrders} color="blue" />
        <StatCard icon={<IndianRupee size={24} />} label="Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="green" />
        <StatCard icon={<Package size={24} />} label="Products" value={stats.totalProducts} color="purple" />
        <StatCard icon={<Clock size={24} />} label="Pending" value={stats.pendingOrders} color="orange" />
      </div>

      <div className="card">
        <h3 className="card-title">Recent Orders</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="mono">{order.id}</td>
                  <td>{order.user_phone}</td>
                  <td>₹{order.total_amount}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>;
}
