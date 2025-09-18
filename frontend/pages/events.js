import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Events() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchEvents();
  }, [isAuthenticated, router]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <button 
            onClick={fetchEvents}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <p className="text-gray-600 mt-1">
                {isAdmin ? 'Admin View' : 'Discover upcoming events'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <Link href="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Manage Events
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V9a4 4 0 118 0v2"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events available</h3>
            <p className="text-gray-600">Check back later for upcoming events!</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {event.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V9a4 4 0 118 0v2"/>
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      {event.time}
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}