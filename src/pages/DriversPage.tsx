import { useState } from "react";
import { mockDrivers, Driver } from "@/data/mockData";
import { StatusBadge } from "./DashboardOverview";
import { DetailRow } from "./CustomersPage";
import { X, Search, Plus, Star, Pencil } from "lucide-react";
import FormModal, { FormField, formInputClass } from "@/components/FormModal";

const emptyDriver = (): Omit<Driver, "id"> => ({
  name: "", email: "", phone: "", vehicleType: "Truck", licensePlate: "",
  status: "available", rating: 0, deliveriesCompleted: 0,
  joinedAt: new Date().toISOString().split("T")[0],
});

const DriversPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Driver | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState<Omit<Driver, "id">>(emptyDriver());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "suspended" ? "available" : "suspended" }
          : d
      )
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.licensePlate.trim()) e.licensePlate = "License plate is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyDriver());
    setErrors({});
    setShowForm(true);
  };

  const openEdit = (d: Driver) => {
    setEditing(d);
    setForm({ name: d.name, email: d.email, phone: d.phone, vehicleType: d.vehicleType, licensePlate: d.licensePlate, status: d.status, rating: d.rating, deliveriesCompleted: d.deliveriesCompleted, joinedAt: d.joinedAt });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editing) {
      setDrivers((prev) => prev.map((d) => d.id === editing.id ? { ...d, ...form } : d));
      if (selected?.id === editing.id) setSelected({ ...editing, ...form });
    } else {
      const newId = `D${String(drivers.length + 1).padStart(3, "0")}`;
      const newDriver: Driver = { id: newId, ...form };
      setDrivers((prev) => [...prev, newDriver]);
    }
    setShowForm(false);
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  return (
    <div className="flex gap-0 relative">
      <div className={`flex-1 transition-all ${selected ? "lg:mr-[380px]" : ""}`}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-foreground font-heading">Drivers</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search drivers..." value={search} onChange={(e) => setSearch(e.target.value)}
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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Vehicle</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className={`border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${selected?.id === d.id ? "bg-primary/5" : ""}`} onClick={() => setSelected(d)}>
                  <td className="px-4 py-3 font-mono text-xs">{d.id}</td>
                  <td className="px-4 py-3 font-medium">{d.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{d.vehicleType} · {d.licensePlate}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="flex items-center gap-1 font-mono text-xs"><Star className="w-3.5 h-3.5 fill-primary text-primary" /> {d.rating}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openEdit(d); }} className="text-xs font-medium px-2 py-1 rounded text-primary hover:bg-primary/10">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(d.id); }}
                        className={`text-xs font-medium px-2 py-1 rounded ${d.status === "suspended" ? "text-success hover:bg-success/10" : "text-destructive hover:bg-destructive/10"}`}>
                        {d.status === "suspended" ? "Activate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">No drivers found</div>}
        </div>
      </div>

      {selected && (
        <div className="detail-panel w-full lg:w-[380px] top-0 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-heading">Driver Details</h2>
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
            <DetailRow label="Vehicle" value={`${selected.vehicleType} · ${selected.licensePlate}`} />
            <DetailRow label="Rating" value={selected.rating.toString()} mono />
            <DetailRow label="Deliveries" value={selected.deliveriesCompleted.toString()} mono />
            <DetailRow label="Status" value={selected.status} badge />
            <DetailRow label="Joined" value={selected.joinedAt} mono />
          </div>
        </div>
      )}

      <FormModal title={editing ? "Edit Driver" : "Add Driver"} open={showForm} onClose={() => setShowForm(false)}>
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
          <FormField label="Vehicle Type">
            <select className={formInputClass} value={form.vehicleType} onChange={(e) => updateField("vehicleType", e.target.value)}>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Pickup">Pickup</option>
            </select>
          </FormField>
          <FormField label="License Plate" required error={errors.licensePlate}>
            <input className={formInputClass} value={form.licensePlate} onChange={(e) => updateField("licensePlate", e.target.value)} placeholder="LHR-1234" />
          </FormField>
          <FormField label="Status">
            <select className={formInputClass} value={form.status} onChange={(e) => updateField("status", e.target.value as Driver["status"])}>
              <option value="available">Available</option>
              <option value="on_delivery">On Delivery</option>
              <option value="offline">Offline</option>
              <option value="suspended">Suspended</option>
            </select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              {editing ? "Save Changes" : "Add Driver"}
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default DriversPage;
