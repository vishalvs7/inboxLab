"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

// Dashboard card component
function DashboardCard({ title, description, href, toolId }: {
  title: string;
  description: string;
  href: string;
  toolId: number;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Tool #{toolId}
        </span>
        <span className="text-green-600 text-sm font-medium">Active</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-blue-600 font-medium">
        Open tool
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tools");

  // Sample user data
  const userStats = {
    toolsUsed: 3,
    emailsProcessed: 1247,
    successfulChecks: 98,
  };

  const tools = [
    {
      id: 1,
      title: "Email Warm-up Tool",
      description: "Build email reputation with automated daily sending",
      href: "/tools/warmup",
    },
    {
      id: 2,
      title: "Email Template Tester",
      description: "Preview emails across 30+ email clients",
      href: "/tools/tester",
    },
    {
      id: 3,
      title: "Cold Email Validator",
      description: "Pre-send spam score and compliance check",
      href: "/tools/compliance",
    },
    {
      id: 4,
      title: "Unsubscribe Manager",
      description: "Auto-remove bounces and unsubscribes",
      href: "/tools/unsubscribe",
    },
    {
      id: 5,
      title: "Email Signature Generator",
      description: "Drag & drop signature builder",
      href: "/tools/signature",
    },
    {
      id: 6,
      title: "Email Deliverability Monitor",
      description: "Daily inbox placement testing",
      href: "/tools/deliverability",
    },
    {
      id: 7,
      title: "Email List Cleaner",
      description: "Bulk email verification API",
      href: "/tools/cleaner",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage all your email tools from one dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Tools</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.toolsUsed}/7</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Emails Processed</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.emailsProcessed.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.successfulChecks}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("tools")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tools"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Tools
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "recent"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Account Settings
            </button>
          </nav>
        </div>

        {/* Tools Grid */}
        {activeTab === "tools" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <DashboardCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                toolId={tool.id}
              />
            ))}
          </div>
        )}

        {/* Recent Activity (Sample) */}
        {activeTab === "recent" && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <div className="p-2 bg-green-100 rounded">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-900">Email list cleaned successfully</p>
                  <p className="text-sm text-gray-500">2 hours ago • 1,247 emails processed</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded">
                <div className="p-2 bg-blue-100 rounded">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-900">Daily warm-up sent</p>
                  <p className="text-sm text-gray-500">5 hours ago • 50 emails sent</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === "settings" && user && (
          <div className="bg-white rounded-lg shadow border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Profile Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <input
                      type="text"
                      value={user.metadata.creationTime || 'N/A'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Danger Zone</h4>
                <button
                  onClick={() => {
                    // Handle delete account
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      // Implement account deletion
                    }
                  }}
                  className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}