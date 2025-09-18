import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const { user, isAdmin, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    image_url: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (!isAdmin) {
      window.location.href = '/events';
      return;
    }
    fetchEvents();
  }, [user, isAdmin]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };
      if (editingEvent) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/events/${editingEvent.id}`, formData, config);
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events`, formData, config);
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to save event. Please try again.');
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      image_url: event.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchEvents();
    } catch (error) {
      setError(error.response?.data?.detail || 'Error deleting event.');
      console.error('Error deleting event:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      image_url: ''
    });
    setEditingEvent(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Event
              </button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-bold mb-4">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <textarea
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  required
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {event.image_url && (
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-3">{event.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>📅 {event.date}</p>
                  <p>🕒 {event.time}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found. Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  );
}