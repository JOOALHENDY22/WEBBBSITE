"use client";

import { adminLogout } from "@/app/actions";

export default function AdminSidebar() {
  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden absolute top-0 left-0 right-0 flex justify-between items-center bg-white p-4 border-b border-border z-10">
        <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
        <button onClick={() => adminLogout()} className="text-red-500 text-sm font-medium">Sign Out</button>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-border p-6 hidden md:block min-h-screen">
        <h2 className="text-2xl font-bold text-primary mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block text-gray-700 font-medium hover:text-primary">
            Dashboard
          </a>
          <button 
            onClick={() => adminLogout()}
            className="block text-red-500 font-medium hover:text-red-700 mt-12 w-full text-left"
          >
            Sign Out
          </button>
        </nav>
      </aside>
    </>
  );
}
