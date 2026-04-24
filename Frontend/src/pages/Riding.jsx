import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'

const Riding = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const [ride, setRide] = useState(() => {
        const stateRide = location.state?.ride

        if (stateRide) {
            localStorage.setItem('activeRide', JSON.stringify(stateRide))
            return stateRide
        }

        const storedRide = localStorage.getItem('activeRide')
        return storedRide ? JSON.parse(storedRide) : null
    })
    const [isStartingPayment, setIsStartingPayment] = useState(false)
    const [rideMessage, setRideMessage] = useState('')
    const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])

    const persistRide = useCallback((nextRide) => {
        setRide(nextRide)

        if (nextRide) {
            localStorage.setItem('activeRide', JSON.stringify(nextRide))
        } else {
            localStorage.removeItem('activeRide')
        }
    }, [])

    useEffect(() => {
        const stateRide = location.state?.ride

        if (stateRide) {
            persistRide(stateRide)
        }
    }, [location.state, persistRide])

    useEffect(() => {
        const rideIdFromQuery = searchParams.get('ride_id')
        const paymentCancelled = searchParams.get('payment') === 'cancelled'

        if (paymentCancelled) {
            setRideMessage('Payment was cancelled. You can try again whenever you are ready.')
        }

        if (!rideIdFromQuery || ride?._id === rideIdFromQuery) {
            return
        }

        const fetchRide = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/${rideIdFromQuery}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })

                persistRide(response.data)
            } catch (error) {
                console.error('Error fetching ride details:', error)
                navigate('/home')
            }
        }

        fetchRide()
    }, [navigate, persistRide, ride?._id, searchParams])

    useEffect(() => {
        const handleRideEnded = (updatedRide) => {
            persistRide(updatedRide)

            if (updatedRide?.paymentStatus === 'paid') {
                localStorage.removeItem('activeRide')
                navigate('/home')
                return
            }

            setRideMessage('Ride completed. Please complete payment to finish your trip.')
        }

        socket.on('ride-ended', handleRideEnded)

        return () => {
            socket.off('ride-ended', handleRideEnded)
        }
    }, [navigate, persistRide, socket])

    const handlePayment = async () => {
        if (!ride?._id) {
            return
        }

        try {
            setIsStartingPayment(true)
            setRideMessage('')

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/payment/checkout-session`, {
                rideId: ride._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            if (response.data.ride) {
                persistRide(response.data.ride)
            }

            if (response.data.alreadyPaid) {
                localStorage.removeItem('activeRide')
                navigate('/home')
                return
            }

            if (response.data.sessionUrl) {
                window.location.href = response.data.sessionUrl
            }
        } catch (error) {
            console.error('Error starting payment:', error)
            const message = error.response?.data?.message || 'Unable to start Stripe payment right now.'
            setRideMessage(message)
        } finally {
            setIsStartingPayment(false)
        }
    }

    if (!ride) {
        return (
            <div className='h-screen flex items-center justify-center bg-gray-50 px-6 text-center'>
                <div>
                    <p className='text-lg font-medium text-gray-700'>No active ride found.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className='mt-4 rounded-lg bg-gonexi-gradient px-5 py-3 font-semibold text-white'
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    const paymentLabel = ride.paymentStatus === 'paid' ? 'Paid with Stripe' : 'Stripe payment pending'
    const paymentButtonLabel = isStartingPayment
        ? 'Redirecting to Stripe...'
        : ride.paymentStatus === 'paid'
            ? 'Payment Completed'
            : 'Make a Payment'

    return (
        <div className='h-screen relative overflow-hidden z-0 w-full'>
            <Link to='/home' className='fixed top-3 ml-2 z-20 h-10 w-10 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full shadow-gonexi'>
                <i className="text-lg font-medium ri-home-5-line text-gray-700"></i>
            </Link>
            <div className='h-1/2'>
                <LiveTracking />
            </div>
            <div className='h-1/2 p-4'>   
            
                <div className='flex items-center justify-between'>
                    {
                        ride.captain?.vehicle?.vehicleType === 'car' ? (
                            <div className="w-12 h-12 bg-gonexi-gradient rounded-xl flex items-center justify-center">
                                <i className="ri-car-line text-white text-xl"></i>
                            </div>
                        ) : ride.captain?.vehicle?.vehicleType === 'moto' ? (
                            <div className="w-12 h-12 bg-gonexi-secondary rounded-xl flex items-center justify-center">
                                <i className="ri-motorbike-line text-white text-xl"></i>
                            </div>
                        ) : (
                            <div className="w-12 h-12 bg-gonexi-accent rounded-xl flex items-center justify-center">
                                <i className="ri-truck-line text-white text-xl"></i>
                            </div>
                        )
                    }
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain?.fullname?.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain?.vehicle?.plate}</h4>
                        {
                            ride.captain?.vehicle?.vehicleType === 'car' ? (
                                <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                            ) : ride.captain?.vehicle?.vehicleType === 'moto' ? (
                                <p className='text-sm text-gray-600'>Splendor</p>
                            ) : (
                                <p className='text-sm text-gray-600'>Bajaj Auto RE</p>
                            )
                        }
                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill text-gonexi-secondary"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Destination</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line text-gonexi-accent"></i>
                            <div>
                                <h3 className='text-lg font-medium'>Rs. {ride?.fare}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{paymentLabel}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {rideMessage && (
                    <p className='mt-4 rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-700'>
                        {rideMessage}
                    </p>
                )}
                <button
                    onClick={handlePayment}
                    disabled={isStartingPayment || ride.paymentStatus === 'paid'}
                    className='w-full mt-5 bg-gonexi-gradient text-white font-semibold p-3 rounded-lg disabled:cursor-not-allowed disabled:opacity-60'
                >
                    {paymentButtonLabel}
                </button>
            </div>
        </div>
    )
}

export default Riding
