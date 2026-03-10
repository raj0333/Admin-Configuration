import React, { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Shield, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState<UserRole>("admin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isSuperAdmin = role === "super_admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill in all fields");
      return;
    }

    let success: boolean;
    if (isSignup) {
      success = signup(name, email, password, role);
    } else {
      success = login(email, password, role);
    }

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 transition-colors duration-500"
      style={{
        background: isSuperAdmin
          ? "hsl(220, 10%, 94%)"
          : "hsl(var(--background))",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight font-heading">
            TireFleet
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Logistics Command Center
          </p>
        </div>

        {/* Role Toggle */}
        <div className="role-toggle mb-6">
          <div
            className="absolute inset-y-0 transition-all duration-300 rounded-md"
            style={{
              width: "50%",
              left: isSuperAdmin ? "0%" : "50%",
              background: "hsl(var(--primary))",
            }}
          />
          <button
            type="button"
            className={`role-toggle-option ${isSuperAdmin ? "selected" : ""}`}
            onClick={() => setRole("super_admin")}
          >
            <ShieldCheck className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
            Super Admin
          </button>
          <button
            type="button"
            className={`role-toggle-option ${!isSuperAdmin ? "selected" : ""}`}
            onClick={() => setRole("admin")}
          >
            <Shield className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
            Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="data-card">
          <h2 className="text-lg font-semibold text-foreground mb-4 font-heading">
            {isSignup ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@tirefleet.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {isSignup ? (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </form>   

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignup
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignup && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Demo: use any email/password to login
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
