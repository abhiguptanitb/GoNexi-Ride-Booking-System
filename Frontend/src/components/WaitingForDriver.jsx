import React from 'react'

const WaitingForDriver = (props) => {
    return (
    <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
            props.waitingForDriver(false)
        }}><i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i></h5>

        <div className='flex items-center justify-between'>

                    {
                        props.vehicleType === 'car' ? (
                            <div className="w-12 h-12 bg-gonexi-gradient rounded-xl flex items-center justify-center">
                                <i className="ri-car-line text-white text-xl"></i>
                            </div>
                        ) : props.vehicleType === 'moto' ? (
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
                <h2 className='text-lg font-medium capitalize'>{props.ride?.captain.fullname.firstname}</h2>
                <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>

                {
                        props.vehicleType === 'car' ? (
                            <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                        ) : props.vehicleType === 'moto' ? (
                            <p className='text-sm text-gray-600'>Splendor</p>
                        ) : (
                            <p className='text-sm text-gray-600'>Bajaj Auto RE</p>
                        )
                    }
                
                <h1 className='text-lg font-semibold text-gonexi-primary'>OTP: {props.ride?.otp} </h1>
            </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
            <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
                <i className="ri-map-pin-user-fill text-gonexi-primary"></i>
                <div>
                <h3 className='text-lg font-medium'>Pickup</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
                <i className="text-lg ri-map-pin-2-fill text-gonexi-secondary"></i>
                <div>
                <h3 className='text-lg font-medium'>Destination</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
                <i className="ri-currency-line text-gonexi-accent"></i>
                <div>
                <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default WaitingForDriver