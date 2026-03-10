import { useState } from "react";
import { mockCustomers, Customer } from "@/data/mockData";
import { StatusBadge } from "./DashboardOverview";
import { X, Search, Plus, Pencil } from "lucide-react";
import FormModal, { FormField, formInputClass } from "@/components/FormModal";

const emptyCustomer = (): Omit<Customer, "id"> => ({
  name: "", email: "", phone: "", address: "", ordersCount: 0,
  status: "active", joinedAt: new Date().toISOString().split("T")[0],
});

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<Omit<Customer, "id">>(emptyCustomer());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "blocked" : "active" }
          : c
      )
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyCustomer());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, ordersCount: c.ordersCount, status: c.status, joinedAt: c.joinedAt });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editing) {
      setCustomers((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...form } : c));
      if (selected?.id === editing.id) setSelected({ ...editing, ...form });
    } else {
      const newId = `C${String(customers.length + 1).padStart(3, "0")}`;
      const newCustomer: Customer = { id: newId, ...form };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setShowForm(false);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="flex gap-0 relative">
      <div className={`flex-1 transition-all ${selected ? "lg:mr-[380px]" : ""}`}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-foreground font-heading">Customers</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-md border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-48 md:w-64" />
            </div>
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Orders</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${selected?.id === c.id ? "bg-primary/5" : ""}`} onClick={() => setSelected(c)}>
                  <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{c.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell font-mono">{c.ordersCount}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }} className="text-xs font-medium px-2 py-1 rounded text-primary hover:bg-primary/10">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(c.id); }}
                        className={`text-xs font-medium px-2 py-1 rounded ${c.status === "active" ? "text-destructive hover:bg-destructive/10" : "text-success hover:bg-success/10"}`}>
                        {c.status === "active" ? "Block" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No customers found</div>}
        </div>
      </div>

      {selected && (
        <div className="detail-panel w-full lg:w-[380px] top-0 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-heading">Customer Details</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(selected)} className="p-1 rounded hover:bg-muted"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="space-y-4">
            <DetailRow label="ID" value={selected.id} mono />
            <DetailRow label="Name" value={selected.name} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Phone" value={selected.phone} mono />
            <DetailRow label="Address" value={selected.address} />
            <DetailRow label="Orders" value={selected.ordersCount.toString()} mono />
            <DetailRow label="Status" value={selected.status} badge />
            <DetailRow label="Joined" value={selected.joinedAt} mono />
          </div>
        </div>
      )}

      <FormModal title={editing ? "Edit Customer" : "Add Customer"} open={showForm} onClose={() => setShowForm(false)}>
        <div className="space-y-4">
          <FormField label="Name" required error={errors.name}>
            <input className={formInputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Full name" />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <input className={formInputClass} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="email@example.com" />
          </FormField>
          <FormField label="Phone" required error={errors.phone}>
            <input className={formInputClass} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+92-300-1234567" />
          </FormField>
          <FormField label="Address" required error={errors.address}>
            <input className={formInputClass} value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Full address" />
          </FormField>
          <FormField label="Status">
            <select className={formInputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              {editing ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export const DetailRow = ({ label, value, mono, badge }: { label: string; value: string; mono?: boolean; badge?: boolean }) => (
  <div>
    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
    {badge ? (
      <div className="mt-1"><StatusBadge status={value} /></div>
    ) : (
      <p className={`mt-0.5 text-sm text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    )}
  </div>
);

export default CustomersPage;
