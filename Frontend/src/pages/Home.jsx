import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState(localStorage.getItem('pickup') || '')
    const [ destination, setDestination ] = useState(localStorage.getItem('destination') || '')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(localStorage.getItem('vehicleType') || null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    const [liveTrackingZIndex, setLiveTrackingZIndex] = useState('z-1000');
    const [panelZIndex, setPanelZIndex] = useState('z-[-10]');

    useEffect(() => {
        socket.emit("join", { 
            userId: user._id,
            userType: 'user'
        });
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    socket.emit('update-location-user', {
                        userId: user._id,
                        
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude,
                        },
                    });
                });
            }
        };

        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        return () => clearInterval(locationInterval);
    }, [ user, socket ]);

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })

    // Load pickup and destination from localStorage on component mount
    useEffect(() => {
        const storedPickup = localStorage.getItem('pickup');
        const storedDestination = localStorage.getItem('destination');
        if (storedPickup) setPickup(storedPickup);
        if (storedDestination) setDestination(storedDestination);
    }, [])

    const handlePickupChange = async (e) => {
        const value = e.target.value;
        setPickup(value);
        localStorage.setItem('pickup', value);  // Save pickup to localStorage
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        const value = e.target.value;
        setDestination(value);
        localStorage.setItem('destination', value);  // Save destination to localStorage
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }


    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])  

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    const findTrip = async () => {
        if (!pickup || !destination) {
            alert("Please enter both pickup and destination locations.");
            return;
        }
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setFare(response.data)
    }

    const createRide = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType // Include vehicleType in the request
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                setRide(response.data);
                setWaitingForDriver(true);
                setVehicleFound(false);
            }
        } catch (error) {
            console.error("Error creating ride:", error);
        }
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            localStorage.removeItem('token')
            localStorage.removeItem('pickup')  // Optionally clear the saved data on logout
            localStorage.removeItem('destination')
            localStorage.removeItem('vehicleType')
            navigate('/login')
        } catch (error) {
            console.error("Error logging out:", error);
        }
    }

    useEffect(()=>{
        if(panelOpen) {
            setLiveTrackingZIndex('z-10');
            setPanelZIndex('z-1000');
        } else {
            setLiveTrackingZIndex('z-1000');
            setPanelZIndex('z-[-10]');
        }
    },[panelOpen])

    return (
        <div className='h-screen relative overflow-hidden z-0 w-full'>            
            
            {!panelOpen && (
                <div className='absolute p-6 top-0 flex items-center justify-between w-full'>
                    <img className='w-16 z-20' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                    <Link onClick={handleLogout} className='h-10 w-10 z-20 bg-white flex items-center justify-center rounded-full'>
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>
            )}

            
            <div className={`h-3/5 ${liveTrackingZIndex}`}>
                <LiveTracking />
            </div>

            <div className={`flex flex-col justify-end absolute top-0 h-full w-full ${panelZIndex}`}>
                <div className='h-[35%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-1 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white z-10'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {
                vehiclePanel && (
                    <div ref={vehiclePanelRef} className='w-full absolute z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                        <VehiclePanel 
                            selectVehicle={setVehicleType}
                            fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
                    </div>
                )
            }

            {
                confirmRidePanel && (
                    <div ref={confirmRidePanelRef} className='w-full absolute z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                        <ConfirmRide
                            createRide={createRide}
                            pickup={pickup}
                            destination={destination} 
                            fare={fare}
                            vehicleType={vehicleType}

                            setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />  
                    </div>
                )
            }

                {
                    vehicleFound && (
                        <div ref={vehicleFoundRef} className='w-full absolute z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                            <LookingForDriver
                                createRide={createRide}
                                pickup={pickup}
                                destination={destination}
                                fare={fare}
                                vehicleType={vehicleType}
                                setVehicleFound={setVehicleFound} />
                        </div>
                    )
                }

            {
                waitingForDriver && (
                    <div ref={waitingForDriverRef} className='w-full absolute z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                        <WaitingForDriver
                            ride={ride}
                            setVehicleFound={setVehicleFound}
                            setWaitingForDriver={setWaitingForDriver}
                            waitingForDriver={waitingForDriver} 
                            vehicleType={vehicleType}/>                            
                    </div>
                )
            }
        </div>
    )
}

export default Home