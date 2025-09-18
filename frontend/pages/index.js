import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V9a4 4 0 118 0v2"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">EventManager</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href="/events" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors">
                    Events
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md transition-colors">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-indigo-600">EventManager</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover, manage, and participate in amazing events. 
              Whether you're organizing or attending, we've got you covered.
            </p>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/events" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                  View Events
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
                    Manage Events
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
                <Link href="/login" className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose EventManager?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage events effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Event Discovery</h3>
              <p className="text-gray-600">
                Browse and discover events with detailed information, dates, and descriptions all in one place.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100-4m0 4v2m0-6V4"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Control</h3>
              <p className="text-gray-600">
                Full CRUD operations for administrators to create, edit, update, and delete events seamlessly.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Role-based authentication ensures proper access control and data security for all users.
              </p>
            </div>
          </div>
        </div>
        {!isAuthenticated && (
          <div className="bg-indigo-600 rounded-2xl p-12 text-center text-white mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust EventManager for their event needs
            </p>
            <Link href="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Create Your Account Today
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 EventManager. Built with Next.js and FastAPI.
          </p>
        </div>
      </footer>
    </div>
  );
}