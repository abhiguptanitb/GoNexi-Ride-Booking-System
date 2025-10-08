import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className="bg-white rounded-t-3xl shadow-gonexi-lg">
            <div className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setRidePopupPanel(false)
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </div>
            
            <div className="pt-8 pb-6 px-6">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gonexi-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i className="ri-car-line text-white text-2xl"></i>
                    </div>
                    <h3 className='text-2xl font-bold text-gray-800 mb-2'>New Ride Available!</h3>
                    <p className="text-gray-600">A passenger needs a ride</p>
                </div>

                {/* Passenger Info */}
                <div className='flex items-center justify-between p-4 bg-gonexi-gradient rounded-2xl mb-6'>
                    <div className='flex items-center gap-3'>
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <i className="ri-user-line text-white text-lg"></i>
                        </div>
                        <div>
                            <h2 className='text-lg font-semibold text-white'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                            <p className="text-white/80 text-sm">Passenger</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className='text-xl font-bold text-white'>₹{props.ride?.fare}</h3>
                        <p className="text-white/80 text-sm">Fare</p>
                    </div>
                </div>

                {/* Ride Details */}
                <div className='space-y-4 mb-6'>
                    <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                        <div className="w-10 h-10 bg-gonexi-primary rounded-lg flex items-center justify-center">
                            <i className="ri-map-pin-user-fill text-white"></i>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800'>Pickup Location</h3>
                            <p className='text-sm text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    
                    <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-xl'>
                        <div className="w-10 h-10 bg-gonexi-secondary rounded-lg flex items-center justify-center">
                            <i className="ri-map-pin-2-fill text-white"></i>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-800'>Destination</h3>
                            <p className='text-sm text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='space-y-3'>
                    <button 
                        onClick={() => {
                            props.setConfirmRidePopupPanel(true)
                            props.confirmRide()
                        }} 
                        className='w-full bg-gonexi-gradient text-white font-semibold py-4 rounded-2xl shadow-gonexi hover:shadow-gonexi-lg transform hover:scale-105 transition-all duration-200'
                    >
                        <i className="ri-check-line mr-2"></i>
                        Accept Ride
                    </button>

                    <button 
                        onClick={() => {
                            props.setRidePopupPanel(false)
                        }} 
                        className='w-full bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl hover:bg-gray-300 transition-all duration-200'
                    >
                        <i className="ri-close-line mr-2"></i>
                        Decline
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp