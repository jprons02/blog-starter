"use client";

import { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid session
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify-session");
        if (res.ok) {
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
