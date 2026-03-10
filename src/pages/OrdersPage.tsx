import { useState } from "react";
import { mockOrders, Order } from "@/data/mockData";
import { StatusBadge } from "./DashboardOverview";
import { DetailRow } from "./CustomersPage";
import { X, Search } from "lucide-react";

const OrdersPage = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses = ["all", "pending", "confirmed", "in_transit", "delivered", "cancelled"];

  return (
    <div className="flex gap-0 relative">
      <div className={`flex-1 transition-all ${selected ? "lg:mr-[380px]" : ""}`}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-foreground font-heading">Orders</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-md border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-48 md:w-64"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium font-mono uppercase transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Driver</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className={`border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${selected?.id === o.id ? "bg-primary/5" : ""}`}
                  onClick={() => setSelected(o)}
                >
                  <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{o.driverName || <span className="text-muted-foreground italic">Unassigned</span>}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-right font-mono">₨{o.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">No orders found</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="detail-panel w-full lg:w-[380px] top-0 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-heading">Order Details</h2>
            <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <DetailRow label="Order ID" value={selected.id} mono />
            <DetailRow label="Customer" value={selected.customerName} />
            <DetailRow label="Driver" value={selected.driverName || "Unassigned"} />
            <DetailRow label="Items" value={selected.items} />
            <DetailRow label="Total" value={`₨${selected.total.toLocaleString()}`} mono />
            <DetailRow label="Status" value={selected.status} badge />
            <DetailRow label="Pickup" value={selected.pickupAddress} />
            <DetailRow label="Delivery" value={selected.deliveryAddress} />
            <DetailRow label="Created" value={selected.createdAt} mono />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
