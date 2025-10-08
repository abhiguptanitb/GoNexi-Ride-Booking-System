import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = (props) => {

    const { captain } = useContext(CaptainDataContext)

    // Check if vehicle type of both (ride and captain) are equal
    const fare = props.ride?.vehicleType === props.vehicleType ? props.ride?.fare : 0.0;

    return (
        <div className="bg-white rounded-2xl shadow-gonexi-lg p-6">
            {/* Driver Profile */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-4'>
                    <div className="w-12 h-12 bg-gonexi-gradient rounded-xl flex items-center justify-center">
                        <i className="ri-user-line text-white text-xl"></i>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h4 className='text-lg font-semibold capitalize text-gray-800'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                            <p className='text-sm text-gray-600'>GoNexi Driver</p>
                        </div>
                        {/* Vehicle Icon - Right after captain name */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-gonexi">
                                {captain?.vehicle?.vehicleType === 'car' ? (
                                    <div className="w-8 h-8 bg-gonexi-gradient rounded-lg flex items-center justify-center">
                                        <i className="ri-car-line text-white text-sm"></i>
                                    </div>
                                ) : captain?.vehicle?.vehicleType === 'moto' ? (
                                    <div className="w-8 h-8 bg-gonexi-secondary rounded-lg flex items-center justify-center">
                                        <i className="ri-motorbike-line text-white text-sm"></i>
                                    </div>
                                ) : captain?.vehicle?.vehicleType === 'auto' ? (
                                    <div className="w-8 h-8 bg-gonexi-accent rounded-lg flex items-center justify-center">
                                        <i className="ri-truck-line text-white text-sm"></i>
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                                        <i className="ri-question-line text-white text-sm"></i>
                                    </div>
                                )}
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-gray-500">Vehicle</p>
                                <p className="text-sm font-semibold text-gray-700 capitalize">
                                    {captain?.vehicle?.vehicleType || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <h4 className='text-2xl font-bold text-gonexi-primary'>₹{fare}</h4>
                    <p className='text-sm text-gray-600'>Earned Today</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-3 gap-4'>
                <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className="w-10 h-10 bg-gonexi-primary rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="ri-timer-2-line text-white text-lg"></i>
                    </div>
                    <h5 className='text-lg font-semibold text-gray-800'>10.2</h5>
                    <p className='text-xs text-gray-600'>Hours Online</p>
                </div>
                <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className="w-10 h-10 bg-gonexi-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="ri-speed-up-line text-white text-lg"></i>
                    </div>
                    <h5 className='text-lg font-semibold text-gray-800'>24</h5>
                    <p className='text-xs text-gray-600'>Rides Today</p>
                </div>
                <div className='bg-gray-50 rounded-xl p-4 text-center'>
                    <div className="w-10 h-10 bg-gonexi-accent rounded-lg flex items-center justify-center mx-auto mb-2">
                        <i className="ri-star-line text-white text-lg"></i>
                    </div>
                    <h5 className='text-lg font-semibold text-gray-800'>4.8</h5>
                    <p className='text-xs text-gray-600'>Rating</p>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 flex items-center justify-center">
                <div className="bg-gonexi-success text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    Online & Ready
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails
