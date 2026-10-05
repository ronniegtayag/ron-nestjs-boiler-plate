import { useEffect, useState, type FormEvent } from 'react';
import { api } from '../api';

type Category = {
  id: number;
  name: string;
  createdAt: string;
};

type Paginated<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number };
};

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setError('');
    try {
      const res = await api<Paginated<Category>>('/categories?limit=50');
      setCategories(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() }),
      });
      setName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number, categoryName: string) {
    if (!window.confirm(`Delete category "${categoryName}"?`)) return;
    setError('');
    try {
      await api(`/categories/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Categories</h1>
        <p className="text-sm text-slate-500">Add and remove shop categories.</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          required
          minLength={3}
        />
        <button
          type="submit"
          disabled={saving || name.trim().length < 3}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Adding…' : 'Add category'}
        </button>
      </form>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-slate-500">Loading categories…</p>}

      {!loading && categories.length === 0 && !error && (
        <p className="text-sm text-slate-500">No categories yet. Add one above.</p>
      )}

      {!loading && categories.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-md border border-slate-200 bg-white">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{category.name}</p>
                <p className="text-xs text-slate-500">
                  {new Date(category.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void onDelete(category.id, category.name)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
