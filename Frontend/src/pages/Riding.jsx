import React from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'


const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()
    // console.log(ride)

    socket.on("ride-ended", () => {
        navigate('/home')
    })


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
                        ride.captain.vehicle.vehicleType === 'car' ? (
                            <div className="w-12 h-12 bg-gonexi-gradient rounded-xl flex items-center justify-center">
                                <i className="ri-car-line text-white text-xl"></i>
                            </div>
                        ) : ride.captain.vehicle.vehicleType === 'moto' ? (
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
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        {
                            ride.captain.vehicle.vehicleType === 'car' ? (
                                <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                            ) : ride.captain.vehicle.vehicleType === 'moto' ? (
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
                                <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='w-full mt-5 bg-gonexi-gradient text-white font-semibold p-2 rounded-lg'>Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding