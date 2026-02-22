import { useState } from 'react';
import { mockProducts } from '../data/mock';
import type { Product } from '../types';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

const CATEGORIES = ['Dairy', 'Staples', 'Snacks', 'Bakery', 'Vegetables', 'Fruits', 'Beverages'];

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  category: 'Staples',
  price: 0,
  stock_count: 0,
  image_url: '',
  is_active: true,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({ name: product.name, category: product.category, price: product.price, stock_count: product.stock_count, image_url: product.image_url, is_active: product.is_active });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...form } : p))
      );
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        ...form,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setShowModal(false);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h2 className="section-title">Products</h2>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="product-cell">
                      <img src={product.image_url} alt={product.name} className="product-thumb" />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td><span className="category-tag">{product.category}</span></td>
                  <td>₹{product.price}</td>
                  <td>
                    <span className={product.stock_count === 0 ? 'text-red' : ''}>
                      {product.stock_count}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${product.is_active ? 'badge-active' : 'badge-inactive'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(product)}>
                        <Pencil size={16} />
                      </button>
                      <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(product.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="empty-row">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" min={0} required value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Stock Count</label>
                  <input type="number" min={0} required value={form.stock_count} onChange={(e) => setForm({ ...form, stock_count: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
