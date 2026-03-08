"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ROLES } from "@/lib/data";
import Button from "@/components/Button";
import Input, { Textarea } from "@/components/Input";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { currentUser, categories, addCategory, updateCategory, deleteCategory, dbLoading } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "", description: "", basePrice: "" });
  const [errors, setErrors] = useState({});

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <div className="w-8 h-8 border-4 border-[#19e65e] border-t-transparent rounded-full animate-spin mr-3" />
        Loading…
      </div>
    );
  }

  if (!currentUser || currentUser.role !== ROLES.ADMIN) {
    return <div className="max-w-xl mx-auto px-4 py-20 text-center"><Button onClick={() => router.push("/auth/login")}>Sign In</Button></div>;
  }

  function resetForm() {
    setForm({ name: "", icon: "", description: "", basePrice: "" });
    setErrors({});
    setEditId(null);
    setShowForm(false);
  }

  function openEdit(cat) {
    setForm({ name: cat.name, icon: cat.icon, description: cat.description, basePrice: cat.basePrice });
    setEditId(cat.id);
    setShowForm(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.icon.trim()) e.icon = "Icon (emoji) is required";
    if (!form.basePrice || isNaN(form.basePrice)) e.basePrice = "Valid price is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, basePrice: Number(form.basePrice) };
    if (editId) updateCategory(editId, payload);
    else addCategory(payload);
    resetForm();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Categories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#19e65e]/30 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editId ? "Edit Category" : "New Category"}</h2>
            <button onClick={resetForm}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Input label="Category Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Plumbing" error={errors.name} required />
            <Input label="Icon (emoji)" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} placeholder="e.g. 🔧" error={errors.icon} required />
            <Input label="Base Price (₹)" type="number" value={form.basePrice} onChange={(e) => setForm((p) => ({ ...p, basePrice: e.target.value }))} placeholder="500" error={errors.basePrice} required />
            <div className="col-span-2">
              <Textarea label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of the service..." rows={2} />
            </div>
            <div className="col-span-2 flex gap-3">
              <Button type="submit"><Check className="w-4 h-4" /> {editId ? "Save Changes" : "Add Category"}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="text-4xl">{cat.icon}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-xl text-gray-400 hover:text-[#14a84a] hover:bg-[#e8fdf0] transition">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${cat.name}"?`)) deleteCategory(cat.id); }}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{cat.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
            <p className="text-sm font-semibold text-[#14a84a] mt-2">from ₹{cat.basePrice?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
