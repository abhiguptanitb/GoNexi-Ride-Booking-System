import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import LiveTracking from '../components/LiveTracking';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [vehicleType, setVehicleType] = useState(null);
    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);
    const [ride, setRide] = useState(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain',
        });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
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
    }, [captain, socket]);

    const fetchVehicleType = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/captains/${captain._id}/vehicle/vehicleType`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setVehicleType(response.data.vehicleType);
        } catch (error) {
            console.error('Error fetching vehicle type:', error);
        }
    };

    useEffect(() => {
        fetchVehicleType();
    }, []);

    useEffect(() => {
        socket.on('new-ride', (data) => {
            const isMatching = data.vehicleType === vehicleType;
            setRide({ ...data, vehicleType: data.vehicleType || vehicleType });
            setRidePopupPanel(isMatching);
        });
    
        // Clean up listener
        return () => {
            socket.off('new-ride');
        };
    }, [socket, vehicleType]);
    

    const confirmRide = async () => {
        await axios.post(
            `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
            {
                rideId: ride._id,
                captainId: captain._id,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        );

        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
    };

    const onFindRide = () => {
        if (ride?.vehicleType === vehicleType) {
            setRidePopupPanel(true);
        } else {
            setRidePopupPanel(false); // Reset if not matching
        }
    };
    

    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, {
            transform: ridePopupPanel ? 'translateY(0)' : 'translateY(100%)',
        });
    }, [ridePopupPanel]);

    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, {
            transform: confirmRidePopupPanel ? 'translateY(0)' : 'translateY(100%)',
        });
    }, [confirmRidePopupPanel]);

    const saveStateToLocalStorage = () => {
        const state = {
            ridePopupPanel,
            confirmRidePopupPanel,
            ride,
            vehicleType,
        };
        localStorage.setItem('captainHomeState', JSON.stringify(state));
    };

    useEffect(() => {
        const savedState = localStorage.getItem('captainHomeState');
        if (savedState) {
            const { ridePopupPanel, confirmRidePopupPanel, ride, vehicleType } = JSON.parse(savedState);
            setRidePopupPanel(ridePopupPanel);
            setConfirmRidePopupPanel(confirmRidePopupPanel);
            setRide(ride);
            setVehicleType(vehicleType);
        }
    }, []);

    useEffect(() => {
        saveStateToLocalStorage();
    }, [ridePopupPanel, confirmRidePopupPanel, ride, vehicleType]);
    

    const handleLogout = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            localStorage.removeItem('token');
            localStorage.removeItem('captainHomeState'); // Clear saved state
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="h-screen relative overflow-hidden z-0 w-full">
                <div className="absolute p-6 top-0 flex items-center justify-between w-full">
                    <img
                        className="w-16 z-20"
                        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                        alt=""
                    />
                    <Link
                        onClick={handleLogout}
                        className="h-10 w-10 z-20 bg-white flex items-center justify-center rounded-full"
                    >
                        <i className="text-lg font-medium ri-logout-box-r-line"></i>
                    </Link>
                </div>
            <div className="h-3/5">
                <LiveTracking />
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
            <button
                onClick={onFindRide}
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-3 px-6 rounded-lg z-1000"
            >
                Find a Ride
            </button>
        </div>
    );
};

export default CaptainHome;
