import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div className="bg-white rounded-t-3xl shadow-gonexi-lg">
            <div className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false)
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </div>
            
            <div className="pt-8 pb-6 px-6">
                <h3 className='text-2xl font-bold mb-6 text-gray-800'>Confirm Your Ride</h3>

                <div className='flex gap-4 justify-between flex-col items-center'>
                    {/* Vehicle Icon */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-gonexi-lg mb-4">
                        {props.vehicleType === 'car' ? (
                            <div className="w-20 h-20 bg-gonexi-gradient rounded-2xl flex items-center justify-center">
                                <i className="ri-car-line text-white text-3xl"></i>
                            </div>
                        ) : props.vehicleType === 'moto' ? (
                            <div className="w-20 h-20 bg-gonexi-secondary rounded-2xl flex items-center justify-center">
                                <i className="ri-motorbike-line text-white text-3xl"></i>
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-gonexi-accent rounded-2xl flex items-center justify-center">
                                <i className="ri-truck-line text-white text-3xl"></i>
                            </div>
                        )}
                    </div>

                    <div className='w-full space-y-4'>
                        <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                            <div className="w-10 h-10 bg-gonexi-primary rounded-lg flex items-center justify-center">
                                <i className="ri-map-pin-user-fill text-white"></i>
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800'>Pickup Location</h3>
                                <p className='text-sm text-gray-600'>{props.pickup}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                            <div className="w-10 h-10 bg-gonexi-secondary rounded-lg flex items-center justify-center">
                                <i className="ri-map-pin-2-fill text-white"></i>
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800'>Destination</h3>
                                <p className='text-sm text-gray-600'>{props.destination}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                            <div className="w-10 h-10 bg-gonexi-accent rounded-lg flex items-center justify-center">
                                <i className="ri-currency-line text-white"></i>
                            </div>
                            <div>
                                <h3 className='text-lg font-semibold text-gray-800'>₹{props.fare[props.vehicleType]}</h3>
                                <p className='text-sm text-gray-600'>Cash Payment</p>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            props.setVehicleFound(true)
                            props.setConfirmRidePanel(false)
                            props.createRide()
                        }} 
                        className='w-full mt-6 mb-4 bg-gonexi-gradient text-white font-semibold py-4 rounded-2xl shadow-gonexi hover:shadow-gonexi-lg transform hover:scale-105 transition-all duration-200'
                    >
                        Confirm Ride
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRide