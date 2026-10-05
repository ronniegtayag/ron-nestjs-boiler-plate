import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api';

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number | string;
  stock: number;
  categoryId: number;
  createdAt: string;
  category?: { id: number; name: string };
};

type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number };
};

const LIMIT = 10;

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT, total: 0 });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');

  async function loadProducts() {
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });
      if (search) params.set('search', search);
      if (categoryFilter) params.set('categoryId', categoryFilter);
      const res = await api<Paginated<Product>>(`/products?${params.toString()}`);
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await api<Paginated<Category>>('/categories?limit=50');
      setCategories(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [page, search, categoryFilter]);

  function onFilter(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          sku: sku.trim(),
          price: Number(price),
          stock: Number(stock),
          categoryId: Number(categoryId),
        }),
      });
      setName('');
      setSku('');
      setPrice('');
      setStock('0');
      setCategoryId('');
      setPage(1);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number, productName: string) {
    if (!window.confirm(`Delete product "${productName}"?`)) return;
    setError('');
    try {
      await api(`/products/${id}`, { method: 'DELETE' });
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  }

  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));
  const inputClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500';

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="text-sm text-slate-500">Search, filter, add, and delete products.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={inputClass}
          required
        />
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="SKU"
          className={inputClass}
          required
        />
        <input
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className={inputClass}
          required
        />
        <input
          type="number"
          min={0}
          step={1}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className={inputClass}
          required
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add product'}
        </button>
      </form>

      <form onSubmit={onFilter} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search name or SKU"
          className={`flex-1 ${inputClass}`}
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setPage(1);
            setCategoryFilter(e.target.value);
          }}
          className={inputClass}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-slate-500">Loading products…</p>}

      {!loading && products.length === 0 && !error && (
        <p className="text-sm text-slate-500">No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">SKU</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Stock</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-200">
                  <td className="px-3 py-2">{product.name}</td>
                  <td className="px-3 py-2">{product.sku}</td>
                  <td className="px-3 py-2">{Number(product.price).toFixed(2)}</td>
                  <td className="px-3 py-2">{product.stock}</td>
                  <td className="px-3 py-2">{product.category?.name ?? '—'}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void onDelete(product.id, product.name)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && meta.total > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <p>
            Page {meta.page} of {totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-slate-300 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
