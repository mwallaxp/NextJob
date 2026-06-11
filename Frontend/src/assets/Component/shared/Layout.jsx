import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "../Footer";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AuthProvider> {/* Wrap the main content with AuthProvider */}
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
