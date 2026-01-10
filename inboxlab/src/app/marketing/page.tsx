"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  const tools = [
    { name: "Email Warm-up", description: "Build reputation with automated sending", status: "Active" },
    { name: "Template Tester", description: "Preview across 30+ email clients", status: "Active" },
    { name: "Cold Email Validator", description: "Pre-send spam score check", status: "Active" },
    { name: "Unsubscribe Manager", description: "Auto-remove bounces & unsubscribes", status: "Active" },
    { name: "Signature Generator", description: "Drag & drop signature builder", status: "Active" },
    { name: "Deliverability Monitor", description: "Daily inbox placement testing", status: "Active" },
    { name: "Email List Cleaner", description: "Bulk email verification API", status: "Active" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            All-in-One Email Tools Suite
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            7 essential email tools for marketers, sales teams, and businesses.
            Improve deliverability, save time, and grow your business.
          </p>
          <div className="space-x-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/features"
                  className="inline-block px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10"
                >
                  View Features
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">7 Powerful Email Tools</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need for email marketing, deliverability, and compliance in one platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">
                      {index === 0 && "🔥"}
                      {index === 1 && "📧"}
                      {index === 2 && "✅"}
                      {index === 3 && "📋"}
                      {index === 4 && "✍️"}
                      {index === 5 && "📊"}
                      {index === 6 && "🧹"}
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    {tool.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                {user ? (
                  <Link
                    href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-').replace('email-', '')}`}
                    className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center"
                  >
                    Use Tool
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center"
                  >
                    Try for Free
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Email Performance?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our tools to increase email deliverability and save time.
          </p>
          <Link
            href={user ? "/dashboard" : "/auth/register"}
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            {user ? "Go to Dashboard" : "Start Your Free Trial"}
          </Link>
        </div>
      </section>
    </div>
  );
}