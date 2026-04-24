import { useState, useEffect, useRef } from "react"
import Map, { Marker } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"

// Add these constants at the top after imports
const DEFAULT_LOCATION = {
  lat: 28.6139, // New Delhi coordinates as default
  lng: 77.209,
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

// Update the component to handle default location:
const LiveTracking = ({ onLocationUpdate }) => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [viewState, setViewState] = useState(null)
  const mapRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [permissionStatus, setPermissionStatus] = useState("prompt")
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false)
  const watchIdRef = useRef(null)
  const retryTimeoutRef = useRef(null)
  const [retryCount, setRetryCount] = useState(0)
  const autoRetryIntervalRef = useRef(null)

  // Check and request location permission
  const checkLocationPermission = async () => {
    try {
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({ name: "geolocation" })
        setPermissionStatus(permission.state)

        permission.onchange = () => {
          // console.log("📍 Permission changed to:", permission.state)
          setPermissionStatus(permission.state)
        }
      }
    } catch (error) {
      console.error("Error checking permission:", error)
    }
  }

  // Use default location when permission is denied
  const useDefaultLocation = () => {
    // console.log("🌍 Using default location (New Delhi)")
    const newViewState = {
      longitude: DEFAULT_LOCATION.lng,
      latitude: DEFAULT_LOCATION.lat,
      zoom: 12,
    }

    setCurrentPosition(DEFAULT_LOCATION)
    setViewState(newViewState)
    setIsLoading(false)
    setError(null)
    setUsingDefaultLocation(true)

    // Notify parent component with default location
    if (onLocationUpdate) {
      onLocationUpdate(DEFAULT_LOCATION)
    }

    // Set up automatic retry every 30 seconds to check if user enables location
    startAutoRetry()
  }

  // Start automatic retry to check for location permission
  const startAutoRetry = () => {
    if (autoRetryIntervalRef.current) {
      clearInterval(autoRetryIntervalRef.current)
    }

    autoRetryIntervalRef.current = setInterval(() => {
      if (navigator.geolocation && permissionStatus !== "denied") {
        // console.log("🔄 Auto-checking for location permission...")
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // console.log("✅ Location permission granted automatically!")
            const { latitude, longitude } = position.coords
            const newPosition = { lat: latitude, lng: longitude }
            const newViewState = {
              longitude,
              latitude,
              zoom: 15,
            }

            setCurrentPosition(newPosition)
            setViewState(newViewState)
            setUsingDefaultLocation(false)
            setPermissionStatus("granted")

            if (onLocationUpdate) {
              onLocationUpdate(newPosition)
            }

            // Clear auto retry and start watching
            clearInterval(autoRetryIntervalRef.current)
            startWatchingLocation()
          },
          (error) => {
            // Silently continue with default location
            // console.log("📍 Still using default location")
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 60000,
          },
        )
      }
    }, 30000) // Check every 30 seconds
  }

  // Start location tracking with retry logic
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    // Clear any existing watch
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
    }

    // Get initial position with progressive timeout
    const timeout = Math.min(5000 + retryCount * 2000, 15000) // 5s, 7s, 9s, up to 15s

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // console.log("🎯 Location obtained:", {
        //   latitude,
        //   longitude,
        //   accuracy: position.coords.accuracy,
        //   attempt: retryCount + 1,
        // })

        const newPosition = { lat: latitude, lng: longitude }
        const newViewState = {
          longitude,
          latitude,
          zoom: 15,
        }

        setCurrentPosition(newPosition)
        setViewState(newViewState)
        setIsLoading(false)
        setError(null)
        setRetryCount(0) // Reset retry count on success

        // Notify parent component
        if (onLocationUpdate) {
          onLocationUpdate(newPosition)
        }

        // Start watching for changes
        startWatchingLocation()
      },
      (error) => {
        console.error("❌ Location error:", error)
        handleLocationError(error)
      },
      {
        enableHighAccuracy: true,
        timeout: timeout,
        maximumAge: 60000, // Use cached position up to 1 minute old
      },
    )
  }

  // Update the handleLocationError function
  const handleLocationError = (error) => {
    let errorMessage = "Unable to get your location"

    switch (error.code) {
      case error.PERMISSION_DENIED:
        // console.log("❌ Location permission denied, using default location")
        setUsingDefaultLocation(true)
        useDefaultLocation()
        return
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable. Using default location..."
        setUsingDefaultLocation(true)
        useDefaultLocation()
        return
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Retrying..."
        scheduleRetry()
        return
      default:
        errorMessage = "An unknown location error occurred. Retrying..."
        scheduleRetry()
        return
    }
  }

  // Schedule retry with exponential backoff
  const scheduleRetry = () => {
    if (retryCount < 5) {
      // Max 5 retries
      const delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // 1s, 2s, 4s, 8s, 10s
      // console.log(`🔄 Retrying location in ${delay}ms (attempt ${retryCount + 1})`)

      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1)
        startLocationTracking()
      }, delay)
    } else {
      setError("Unable to get location after multiple attempts. Please check your GPS settings.")
      setIsLoading(false)
    }
  }

  // Start watching location changes
  const startWatchingLocation = () => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // console.log("📍 Location updated:", {
        //   latitude,
        //   longitude,
        //   accuracy: position.coords.accuracy,
        //   timestamp: new Date().toLocaleTimeString(),
        // })

        const newPosition = { lat: latitude, lng: longitude }
        setCurrentPosition(newPosition)

        // Update map view smoothly
        setViewState((prevState) => ({
          ...prevState,
          longitude,
          latitude,
        }))

        // Notify parent component
        if (onLocationUpdate) {
          onLocationUpdate(newPosition)
        }
      },
      (error) => {
        console.error("❌ Watch position error:", error)
        // Don't show error for watch position failures, just log them
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    )
  }

  // Update the cleanup in useEffect
  useEffect(() => {
    checkLocationPermission()
    startLocationTracking()

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (autoRetryIntervalRef.current) {
        clearInterval(autoRetryIntervalRef.current)
      }
    }
  }, [])

  const handleMapLoad = () => {
    if (mapRef.current) {
      mapRef.current.resize()
    }
  }

  // Manual retry function
  const retryLocation = () => {
    setRetryCount(0)
    startLocationTracking()
  }

  // Request permission manually
  const requestPermission = () => {
    startLocationTracking()
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e0e7ff",
            borderTop: "4px solid #6366f1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
          }}
        ></div>
        <p style={{ fontSize: "16px", color: "#4b5563", marginBottom: "10px", fontWeight: "500" }}>Getting your location...</p>
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>Attempt {retryCount + 1} of 5</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "300px" }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 20px",
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)"
          }}>
            <i className="ri-map-pin-line" style={{ fontSize: "32px", color: "white" }}></i>
          </div>
          <h3 style={{ color: "#1f2937", marginBottom: "10px", fontWeight: "600" }}>Location Required</h3>
          <p style={{ color: "#6b7280", marginBottom: "20px", lineHeight: "1.4" }}>{error}</p>

          {permissionStatus === "denied" ? (
            <div>
              <p style={{ fontSize: "14px", color: "#9ca3af", marginBottom: "15px" }}>
                Please enable location permissions in your browser settings and refresh the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.3)";
                }}
              >
                Refresh Page
              </button>
            </div>
          ) : (
            <button
              onClick={retryLocation}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(99, 102, 241, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.3)";
              }}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  // Don't render map until we have valid position
  if (!currentPosition || !viewState) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ 
            width: "60px", 
            height: "60px", 
            background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 15px",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
          }}>
            <i className="ri-map-2-line" style={{ fontSize: "24px", color: "white" }}></i>
          </div>
          <p style={{ color: "#6b7280", fontWeight: "500" }}>Initializing map...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={handleMapLoad}
        ref={mapRef}
      >
        <Marker longitude={currentPosition.lng} latitude={currentPosition.lat}>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
              border: "4px solid white",
              boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(99, 102, 241, 0.4)",
              animation: "pulse 2s infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "white",
                animation: "innerPulse 1.5s infinite",
              }}
            ></div>
            <style jsx>{`
              @keyframes pulse {
                0% {
                  box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7), 0 4px 12px rgba(99, 102, 241, 0.4);
                }
                70% {
                  box-shadow: 0 0 0 12px rgba(99, 102, 241, 0), 0 4px 12px rgba(99, 102, 241, 0.4);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(99, 102, 241, 0), 0 4px 12px rgba(99, 102, 241, 0.4);
                }
              }
              @keyframes innerPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
            `}</style>
          </div>
        </Marker>
      </Map>

      {/* Location status indicator */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          padding: "12px 16px",
          borderRadius: "12px",
          fontSize: "12px",
          zIndex: 1000,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(99, 102, 241, 0.1)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: usingDefaultLocation ? "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              animation: "blink 1s infinite",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          ></div>
          <span style={{ fontWeight: "500", color: "#374151" }}>
            {usingDefaultLocation ? "Default Location" : "Live Location"}
          </span>
        </div>
        <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "4px", fontFamily: "monospace" }}>
          {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
        </div>
        <style jsx>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
        `}</style>
      </div>
    </div>
  )
}

export default LiveTracking
