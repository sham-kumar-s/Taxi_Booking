'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  bookingRef: string
  pickupLocation: string
  dropoffLocation: string
  distance: number
  fare: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
    phone: string
  }
  vehicle: {
    type: string
    model: string
    licensePlate: string
  }
}

export default function BookingsManagement() {
  const router = useRouter()
  const { logout, isAuthenticated, isAdmin } = useAuthStore()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login')
      return
    }
    fetchBookings()
  }, [filter])

  const fetchBookings = async () => {
    try {
      const url = filter ? `/admin/bookings?status=${filter}` : '/admin/bookings'
      const response = await api.get(url)
      setBookings(response.data.data)
    } catch (error) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/bookings/${id}/status`, { status })
      toast.success('Status updated successfully')
      fetchBookings()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">🚕 Admin Panel</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/admin/vehicles')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Vehicles
              </button>
              <button onClick={() => { logout(); router.push('/') }} className="text-gray-600 hover:text-gray-800">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h2>
          <p className="text-gray-600">View and manage all bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Booking Reference</p>
                    <p className="font-mono font-semibold text-lg">{booking.bookingRef}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Details</h4>
                    <p className="text-sm"><span className="text-gray-500">Name:</span> {booking.user.name}</p>
                    <p className="text-sm"><span className="text-gray-500">Email:</span> {booking.user.email}</p>
                    <p className="text-sm"><span className="text-gray-500">Phone:</span> {booking.user.phone}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Vehicle Details</h4>
                    <p className="text-sm"><span className="text-gray-500">Type:</span> {booking.vehicle.type}</p>
                    <p className="text-sm"><span className="text-gray-500">Model:</span> {booking.vehicle.model}</p>
                    <p className="text-sm"><span className="text-gray-500">License:</span> {booking.vehicle.licensePlate}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Pickup</p>
                    <p className="font-medium">{booking.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dropoff</p>
                    <p className="font-medium">{booking.dropoffLocation}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-medium">{booking.distance.toFixed(2)} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fare</p>
                    <p className="font-medium text-lg">${booking.fare.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Booked On</p>
                    <p className="font-medium">{new Date(booking.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateStatus(booking.id, 'CONFIRMED')}
                    disabled={booking.status === 'CONFIRMED'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, 'IN_PROGRESS')}
                    disabled={booking.status === 'IN_PROGRESS'}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, 'COMPLETED')}
                    disabled={booking.status === 'COMPLETED'}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateStatus(booking.id, 'CANCELLED')}
                    disabled={booking.status === 'CANCELLED'}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
