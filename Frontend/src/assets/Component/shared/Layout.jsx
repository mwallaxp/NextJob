import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "../Footer";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider
import LoadingOverlay from "./LoadingOverlay";

const Layout = () => { // Renamed to avoid conflict with `LayoutWithNavFooter` in App.jsx
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AuthProvider> {/* Wrap the main content with AuthProvider */} 
        <LoadingOverlay />
        <NavBar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
};

export default Layout;
