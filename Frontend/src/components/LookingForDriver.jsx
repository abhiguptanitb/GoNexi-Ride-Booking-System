import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}><i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Looking for a Driver</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                    {
                        props.vehicleType === 'car' ? (
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
                        )
                    }
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill text-gonexi-primary"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill text-gonexi-secondary"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line text-gonexi-accent"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.fare[ props.vehicleType ]} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver