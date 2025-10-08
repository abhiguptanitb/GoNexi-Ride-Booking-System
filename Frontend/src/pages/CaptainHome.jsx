import { useRef, useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import CaptainDetails from "../components/CaptainDetails"
import RidePopUp from "../components/RidePopUp"
import ConfirmRidePopUp from "../components/ConfirmRidePopUp"
import LiveTracking from "../components/LiveTracking"
import { SocketContext } from "../context/SocketContext"
import { CaptainDataContext } from "../context/CaptainContext"
import axios from "axios"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useLocationPermission } from "../hooks/useLocationPermission"

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false)
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
  const [vehicleType, setVehicleType] = useState(null)
  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ride, setRide] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)
  const { permissionStatus, requestLocationPermission, currentLocation } = useLocationPermission()

  const navigate = useNavigate()

  // Auto-request location permission on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // console.log("🚗 Initializing location for captain...")
        await requestLocationPermission()
      } catch (error) {
        console.error("Failed to get initial location:", error)
        // Just continue without showing popup
      }
    }

    initializeLocation()
  }, [requestLocationPermission])

  // Handle location updates from LiveTracking component
  const handleLocationUpdate = (location) => {
    // console.log("📍 Captain location updated:", location)

    // Send location to server via socket
    socket.emit("update-location-captain", {
      userId: captain._id,
      location: location,
    })
  }

  // Socket setup and location tracking
  useEffect(() => {
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    })

    // Set up periodic location updates if we have permission
    let locationInterval
    if (permissionStatus === "granted" && currentLocation) {
      locationInterval = setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const locationData = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }

              socket.emit("update-location-captain", {
                userId: captain._id,
                location: locationData,
              })
            },
            (error) => {
              console.error("Error in periodic captain location update:", error)
            },
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 60000,
            },
          )
        }
      }, 30000) // Update every 30 seconds
    }

    return () => {
      if (locationInterval) {
        clearInterval(locationInterval)
      }
    }
  }, [captain, socket, permissionStatus, currentLocation])

  const fetchVehicleType = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found in localStorage")
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/${captain._id}/vehicle/vehicleType`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setVehicleType(response.data.vehicleType)
          // console.log("🚗 Captain vehicle type:", response.data.vehicleType)
    } catch (error) {
      console.error("Error fetching vehicle type:", error)
    }
  }

  useEffect(() => {
    fetchVehicleType()
  }, [])

  useEffect(() => {
    socket.on("new-ride", (data) => {
        // console.log("🔔 New ride received:", data)
        const isMatching = data.vehicleType === vehicleType
        // console.log("🔍 Vehicle type match:", {
        //   rideVehicleType: data.vehicleType,
        //   captainVehicleType: vehicleType,
        //   isMatching,
        // })

      setRide({ ...data, vehicleType: data.vehicleType || vehicleType })
      setRidePopupPanel(isMatching)
    })

    return () => {
      socket.off("new-ride")
    }
  }, [socket, vehicleType])

  const confirmRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      setRidePopupPanel(false)
      setConfirmRidePopupPanel(true)
          // console.log("✅ Ride confirmed")
    } catch (error) {
      console.error("❌ Error confirming ride:", error)
    }
  }

  useGSAP(() => {
    gsap.to(ridePopupPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
    })
  }, [ridePopupPanel])

  useGSAP(() => {
    gsap.to(confirmRidePopupPanelRef.current, {
      transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
    })
  }, [confirmRidePopupPanel])

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      localStorage.removeItem("token")
      navigate("/captain-login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="h-screen relative overflow-hidden z-0 w-full">
      <div className="absolute p-6 top-0 flex items-center justify-between w-full">
        <div className="flex items-center space-x-3 z-20">
          <div className="w-12 h-12 bg-gonexi-gradient rounded-xl flex items-center justify-center shadow-gonexi">
            <i className="ri-steering-2-line text-white text-xl"></i>
          </div>
            <div>
              <h1 className="text-white text-lg font-bold">GoNexi Driver</h1>
              <p className="text-white/80 text-xs">Ready to drive</p>
            </div>
        </div>
        
        <Link onClick={handleLogout} className="h-10 w-10 z-20 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full shadow-gonexi hover:shadow-gonexi-lg transition-all duration-200">
          <i className="text-lg font-medium ri-logout-box-r-line text-gray-700"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <LiveTracking onLocationUpdate={handleLocationUpdate} />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails ride={ride} vehicleType={vehicleType} />
      </div>

      {ride?.vehicleType === vehicleType && (
        <div
          ref={ridePopupPanelRef}
          className="absolute w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
        >
          <RidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            confirmRide={confirmRide}
          />
        </div>
      )}

      <div
        ref={confirmRidePopupPanelRef}
        className="absolute w-full z-10 bottom-0 top-20 translate-y-full bg-white px-3 py-6 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome
