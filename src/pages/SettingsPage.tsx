import { useAuth } from "@/contexts/AuthContext";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6 font-heading">Settings</h1>

      <div className="data-card max-w-lg">
        <h2 className="text-lg font-semibold mb-4 font-heading">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Name</label>
            <p className="mt-0.5 text-sm text-foreground">{user?.name}</p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Email</label>
            <p className="mt-0.5 text-sm text-foreground font-mono">{user?.email}</p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Role</label>
            <p className="mt-0.5 text-sm text-primary font-mono uppercase">{user?.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>

      <div className="data-card max-w-lg mt-6">
        <h2 className="text-lg font-semibold mb-4 font-heading">Platform Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Platform settings and configuration options will be available here. Connect this dashboard to your logistics backend to manage real data.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
