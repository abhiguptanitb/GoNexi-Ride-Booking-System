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
  const [earningsToday, setEarningsToday] = useState(0)
  const [ridesToday, setRidesToday] = useState(0)
  const [paidRidesToday, setPaidRidesToday] = useState(0)
  const ridePopupPanelRef = useRef(null)
  const confirmRidePopupPanelRef = useRef(null)
  const [ride, setRide] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)
  const { permissionStatus, requestLocationPermission, currentLocation } = useLocationPermission()

  const navigate = useNavigate()

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        await requestLocationPermission()
      } catch (error) {
        console.error("Failed to get initial location:", error)
      }
    }
    initializeLocation()
  }, [requestLocationPermission])

  const handleLocationUpdate = (location) => {
    socket.emit("update-location-captain", {
      userId: captain._id,
      location: location,
    })
  }

  useEffect(() => {
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    })

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
      }, 30000)
    }

    return () => {
      if (locationInterval) clearInterval(locationInterval)
    }
  }, [captain, socket, permissionStatus, currentLocation])

  const fetchVehicleType = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/${captain._id}/vehicle/vehicleType`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setVehicleType(response.data.vehicleType)
    } catch (error) {
      console.error("Error fetching vehicle type:", error)
    }
  }

  const fetchCaptainEarnings = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/captains/earnings/today`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setEarningsToday(response.data.earningsToday || 0)
      setRidesToday(response.data.ridesToday || 0)
      setPaidRidesToday(response.data.paidRidesToday || 0)
    } catch (error) {
      console.error("Error fetching captain earnings:", error)
    }
  }

  useEffect(() => {
    fetchVehicleType()
    fetchCaptainEarnings()
  }, [])

  useEffect(() => {
    socket.on("new-ride", (data) => {
      const isMatching = data.vehicleType === vehicleType
      setRide({ ...data, vehicleType: data.vehicleType || vehicleType })
      setRidePopupPanel(isMatching)
    })

    return () => socket.off("new-ride")
  }, [socket, vehicleType])

  useEffect(() => {
    const handleRidePaymentCompleted = (updatedRide) => {
      if (updatedRide?._id === ride?._id) {
        setRide(updatedRide)
      }
      fetchCaptainEarnings()
    }

    socket.on("ride-payment-completed", handleRidePaymentCompleted)
    return () => socket.off("ride-payment-completed", handleRidePaymentCompleted)
  }, [ride, socket])

  const confirmRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )

      setRidePopupPanel(false)
      setConfirmRidePopupPanel(true)
    } catch (error) {
      console.error("Error confirming ride:", error)
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      localStorage.removeItem("token")
      navigate("/captain-login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <div className="h-screen relative overflow-hidden z-0 w-full">
      
      {/* Header */}
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

        <Link
          onClick={handleLogout}
          className="h-10 w-10 z-20 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full shadow-gonexi hover:shadow-gonexi-lg transition-all duration-200"
        >
          <i className="text-lg font-medium ri-logout-box-r-line text-gray-700"></i>
        </Link>
      </div>

      {/* Map */}
      <div className="h-3/5">
        <LiveTracking onLocationUpdate={handleLocationUpdate} />
      </div>

      {/* Captain Info */}
      <CaptainDetails
        ride={ride}
        vehicleType={vehicleType}
        earningsToday={earningsToday}
        ridesToday={ridesToday}
        paidRidesToday={paidRidesToday}
      />

      {/* Ride Popup */}
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

      {/* Confirm Ride Popup */}
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
