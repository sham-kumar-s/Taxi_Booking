'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, isAuthenticated } from '@/lib/store'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Vehicle {
  vehicleId: string
  vehicleType: string
  model: string
  capacity: number
  distance: number
  fare: number
  imageUrl?: string
}

export default function BookingPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [estimates, setEstimates] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  
  const [locationData, setLocationData] = useState({
    pickupLocation: '',
    pickupLat: 0,
    pickupLng: 0,
    dropoffLocation: '',
    dropoffLat: 0,
    dropoffLng: 0,
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [])

  const handleGetEstimate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/bookings/estimate', {
        pickupLat: locationData.pickupLat,
        pickupLng: locationData.pickupLng,
        dropoffLat: locationData.dropoffLat,
        dropoffLng: locationData.dropoffLng,
      })

      setEstimates(response.data.data.estimates)
      setStep(2)
      toast.success('Fare estimates calculated!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get estimates')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedVehicle) return

    setLoading(true)
    try {
      const response = await api.post('/bookings', {
        vehicleId: selectedVehicle.vehicleId,
        ...locationData,
      })

      const booking = response.data.data
      toast.success(`Booking confirmed! Ref: ${booking.bookingRef}`)
      router.push('/bookings')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Demo coordinates for testing
  const useDemoLocations = () => {
    setLocationData({
      pickupLocation: 'Times Square, New York',
      pickupLat: 40.758896,
      pickupLng: -73.985130,
      dropoffLocation: 'Central Park, New York',
      dropoffLat: 40.785091,
      dropoffLng: -73.968285,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">🚕 TaxiBook</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hi, {user?.name}</span>
              <button
                onClick={() => router.push('/bookings')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                My Bookings
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>
            
            <form onSubmit={handleGetEstimate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    value={locationData.pickupLocation}
                    onChange={(e) => setLocationData({ ...locationData, pickupLocation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter pickup address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Location
                  </label>
                  <input
                    type="text"
                    required
                    value={locationData.dropoffLocation}
                    onChange={(e) => setLocationData({ ...locationData, dropoffLocation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter dropoff address"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={locationData.pickupLat || ''}
                    onChange={(e) => setLocationData({ ...locationData, pickupLat: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="40.7589"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={locationData.pickupLng || ''}
                    onChange={(e) => setLocationData({ ...locationData, pickupLng: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="-73.9851"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={locationData.dropoffLat || ''}
                    onChange={(e) => setLocationData({ ...locationData, dropoffLat: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="40.7851"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dropoff Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={locationData.dropoffLng || ''}
                    onChange={(e) => setLocationData({ ...locationData, dropoffLng: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="-73.9683"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={useDemoLocations}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Use Demo Locations
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Calculating...' : 'Get Fare Estimates'}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Change Locations
            </button>

            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Select Your Vehicle</h2>
              
              <div className="space-y-4">
                {estimates.map((vehicle) => (
                  <div
                    key={vehicle.vehicleId}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      selectedVehicle?.vehicleId === vehicle.vehicleId
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {vehicle.imageUrl && (
                          <div className="relative w-20 h-16">
                            <Image
                              src={vehicle.imageUrl}
                              alt={vehicle.vehicleType}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.vehicleType}</h3>
                          <p className="text-gray-600 text-sm">{vehicle.model}</p>
                          <p className="text-gray-500 text-sm">Capacity: {vehicle.capacity} passengers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${vehicle.fare.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{vehicle.distance.toFixed(2)} km</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedVehicle || loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
