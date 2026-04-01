'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, isAuthenticated, isAdmin } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface Stats {
  totalBookings: number
  activeBookings: number
  completedBookings: number
  totalRevenue: number
  totalVehicles: number
  availableVehicles: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/login')
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard')
      setStats(response.data.data)
    } catch (error) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">🚕 Admin Panel</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hi, {user?.name}</span>
              <button
                onClick={() => {
                  logout()
                  router.push('/')
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Overview of your taxi booking platform</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings}</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Bookings</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.activeBookings}</p>
                  </div>
                  <div className="text-4xl">🚗</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-3xl font-bold text-green-600">{stats?.completedBookings}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600">${stats?.totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Vehicles</p>
                    <p className="text-3xl font-bold text-gray-900">{stats?.totalVehicles}</p>
                  </div>
                  <div className="text-4xl">🚙</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Available Vehicles</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.availableVehicles}</p>
                  </div>
                  <div className="text-4xl">✨</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => router.push('/admin/vehicles')}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition text-left"
              >
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-bold mb-2">Manage Vehicles</h3>
                <p className="text-gray-600">Add, edit, or remove vehicles from your fleet</p>
              </button>

              <button
                onClick={() => router.push('/admin/bookings')}
                className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition text-left"
              >
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold mb-2">Manage Bookings</h3>
                <p className="text-gray-600">View and update booking statuses</p>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
