import { useState } from "react";
import { mockAdmins, AdminUser } from "@/data/mockData";
import { StatusBadge } from "./DashboardOverview";
import { DetailRow } from "./CustomersPage";
import { X, Search, Plus, Pencil } from "lucide-react";
import FormModal, { FormField, formInputClass } from "@/components/FormModal";

const emptyAdmin = (): Omit<AdminUser, "id"> => ({
  name: "", email: "", role: "admin", status: "active",
  createdAt: new Date().toISOString().split("T")[0],
});

const AdminsPage = () => {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<Omit<AdminUser, "id">>(emptyAdmin());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "suspended" : "active" }
          : a
      )
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyAdmin());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (a: AdminUser) => {
    setEditing(a);
    setForm({ name: a.name, email: a.email, role: a.role, status: a.status, createdAt: a.createdAt });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editing) {
      setAdmins((prev) => prev.map((a) => a.id === editing.id ? { ...a, ...form } : a));
      if (selected?.id === editing.id) setSelected({ ...editing, ...form });
    } else {
      const newId = `A${String(admins.length + 1).padStart(3, "0")}`;
      const newAdmin: AdminUser = { id: newId, ...form };
      setAdmins((prev) => [...prev, newAdmin]);
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
          <h1 className="text-2xl font-bold text-foreground font-heading">Admin Management</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search admins..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-md border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-48 md:w-64" />
            </div>
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              <Plus className="w-4 h-4" /> Add Admin
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${selected?.id === a.id ? "bg-primary/5" : ""}`} onClick={() => setSelected(a)}>
                  <td className="px-4 py-3 font-mono text-xs">{a.id}</td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(a); }} className="text-xs font-medium px-2 py-1 rounded text-primary hover:bg-primary/10">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(a.id); }}
                        className={`text-xs font-medium px-2 py-1 rounded ${a.status === "suspended" ? "text-success hover:bg-success/10" : "text-destructive hover:bg-destructive/10"}`}>
                        {a.status === "suspended" ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="detail-panel w-full lg:w-[380px] top-0 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-heading">Admin Details</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(selected)} className="p-1 rounded hover:bg-muted"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="space-y-4">
            <DetailRow label="ID" value={selected.id} mono />
            <DetailRow label="Name" value={selected.name} />
            <DetailRow label="Email" value={selected.email} />
            <DetailRow label="Role" value={selected.role} mono />
            <DetailRow label="Status" value={selected.status} badge />
            <DetailRow label="Created" value={selected.createdAt} mono />
          </div>
        </div>
      )}

      <FormModal title={editing ? "Edit Admin" : "Add Admin"} open={showForm} onClose={() => setShowForm(false)}>
        <div className="space-y-4">
          <FormField label="Name" required error={errors.name}>
            <input className={formInputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Admin name" />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <input className={formInputClass} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="admin@example.com" />
          </FormField>
          <FormField label="Status">
            <select className={formInputClass} value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              {editing ? "Save Changes" : "Add Admin"}
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default AdminsPage;
