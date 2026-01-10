"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

// Sidebar navigation items
const navItems = [
  { name: "Email Warm-up", href: "/tools/warmup", icon: "🔥" },
  { name: "Template Tester", href: "/tools/tester", icon: "📧" },
  { name: "Cold Email Validator", href: "/tools/compliance", icon: "✅" },
  { name: "Unsubscribe Manager", href: "/tools/unsubscribe", icon: "📋" },
  { name: "Signature Generator", href: "/tools/signature", icon: "✍️" },
  { name: "Deliverability Monitor", href: "/tools/deliverability", icon: "📊" },
  { name: "Email List Cleaner", href: "/tools/cleaner", icon: "🧹" },
];

export default function ToolsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden bg-white border-b px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center text-gray-600"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Tools Menu
          </button>
        </div>

        <div className="flex">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
            <div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
              {/* User info */}
              <div className="px-6 pb-4 border-b">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">Email Tools Pro</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 space-y-1 mt-6">
                <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Email Tools
                </div>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom links */}
              <div className="border-t px-4 py-4">
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  {/* Mobile user info */}
                  <div className="px-6 pb-4 border-b">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.displayName || user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500">Email Tools Pro</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile navigation */}
                  <nav className="mt-6 px-4 space-y-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="lg:pl-64 flex flex-col flex-1">
            <main className="flex-1 pb-8">
              {/* Top bar for tools */}
              <div className="bg-white shadow">
                <div className="px-4 sm:px-6 lg:px-8">
                  <div className="py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {navItems.find(item => item.href === pathname)?.name || "Email Tools"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                          {navItems.find(item => item.href === pathname)?.name === "Email Warm-up" && "Build email reputation with automated daily sending"}
                          {navItems.find(item => item.href === pathname)?.name === "Template Tester" && "Preview emails across 30+ email clients"}
                          {navItems.find(item => item.href === pathname)?.name === "Cold Email Validator" && "Pre-send spam score and compliance check"}
                          {navItems.find(item => item.href === pathname)?.name === "Unsubscribe Manager" && "Auto-remove bounces and unsubscribes"}
                          {navItems.find(item => item.href === pathname)?.name === "Signature Generator" && "Drag & drop signature builder"}
                          {navItems.find(item => item.href === pathname)?.name === "Deliverability Monitor" && "Daily inbox placement testing"}
                          {navItems.find(item => item.href === pathname)?.name === "Email List Cleaner" && "Bulk email verification API"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Link
                          href="/dashboard"
                          className="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool content */}
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}