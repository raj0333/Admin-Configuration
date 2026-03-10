import { useAuth } from "@/contexts/AuthContext";
import { mockCustomers, mockDrivers, mockOrders, mockAdmins } from "@/data/mockData";
import { Package, Users, Truck, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";

const DashboardOverview = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const activeCustomers = mockCustomers.filter((c) => c.status === "active").length;
  const availableDrivers = mockDrivers.filter((d) => d.status === "available").length;
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length;
  const inTransit = mockOrders.filter((o) => o.status === "in_transit").length;
  const totalRevenue = mockOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);

  const stats = [
    ...(isSuperAdmin
      ? [{ label: "Total Admins", value: mockAdmins.length.toString(), icon: Users, color: "text-primary" }]
      : []),
    { label: "Active Customers", value: activeCustomers.toString(), icon: Users, color: "text-success" },
    { label: "Available Drivers", value: availableDrivers.toString(), icon: Truck, color: "text-primary" },
    { label: "Pending Orders", value: pendingOrders.toString(), icon: ShoppingCart, color: "text-destructive" },
    { label: "In Transit", value: inTransit.toString(), icon: Package, color: "text-primary" },
    { label: "Revenue (Delivered)", value: `₨${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-success" },
  ];

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 font-heading">
        {isSuperAdmin ? "Super Admin Dashboard" : "Admin Dashboard"}
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between">
              <span className="stat-label">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="data-card">
        <h2 className="text-lg font-semibold text-foreground mb-4 font-heading">Recent Orders</h2>
        <div className="table-container">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Driver</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{order.driverName || <span className="text-muted-foreground italic">Unassigned</span>}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono">₨{order.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    active: "bg-success/10 text-success",
    available: "bg-success/10 text-success",
    delivered: "bg-success/10 text-success",
    confirmed: "bg-primary/10 text-primary",
    in_transit: "bg-primary/10 text-primary",
    on_delivery: "bg-primary/10 text-primary",
    pending: "bg-muted text-muted-foreground",
    offline: "bg-muted text-muted-foreground",
    inactive: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
    blocked: "bg-destructive/10 text-destructive",
    suspended: "bg-destructive/10 text-destructive",
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium font-mono uppercase ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default DashboardOverview;
