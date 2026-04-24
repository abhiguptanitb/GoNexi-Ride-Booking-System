import React from 'react'

const VehiclePanel = (props) => {
    return (
        <div className="bg-white rounded-t-3xl shadow-gonexi-lg">
            <div className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}>
                <i className="text-2xl sm:text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </div>
            <div className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
                <h3 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800'>Choose Your Ride</h3>
                
                <div onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanel(false)
                    props.selectVehicle('car')
                }} className='flex border-2 border-gray-200 hover:border-gonexi-primary active:border-gonexi-primary mb-3 rounded-2xl w-full p-3 sm:p-4 items-center justify-between transition-all duration-200 hover:shadow-gonexi'>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gonexi-gradient rounded-xl flex items-center justify-center">
                        <i className="ri-car-line text-white text-lg sm:text-xl"></i>
                    </div>
                    <div className='ml-2 sm:ml-3 flex-1'>
                        <h4 className='font-semibold text-sm sm:text-base text-gray-800'>GoNexiCar <span className="text-gray-500"><i className="ri-user-3-fill"></i>4</span></h4>
                        <h5 className='font-medium text-xs sm:text-sm text-gray-600'>2 mins away</h5>
                        <p className='font-normal text-xs text-gray-500'>Comfortable, reliable rides</p>
                    </div>
                    <h2 className='text-base sm:text-lg font-bold text-gonexi-primary'>₹{props.fare.car}</h2>
                </div>
                
                <div onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanel(false)
                    props.selectVehicle('moto')
                }} className='flex border-2 border-gray-200 hover:border-gonexi-primary active:border-gonexi-primary mb-3 rounded-2xl w-full p-3 sm:p-4 items-center justify-between transition-all duration-200 hover:shadow-gonexi'>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gonexi-secondary rounded-xl flex items-center justify-center">
                        <i className="ri-motorbike-line text-white text-lg sm:text-xl"></i>
                    </div>
                    <div className='ml-2 sm:ml-3 flex-1'>
                        <h4 className='font-semibold text-sm sm:text-base text-gray-800'>GoNexiMoto <span className="text-gray-500"><i className="ri-user-3-fill"></i>1</span></h4>
                        <h5 className='font-medium text-xs sm:text-sm text-gray-600'>3 mins away</h5>
                        <p className='font-normal text-xs text-gray-500'>Fast motorcycle rides</p>
                    </div>
                    <h2 className='text-base sm:text-lg font-bold text-gonexi-primary'>₹{props.fare.moto}</h2>
                </div>
                
                <div onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.setVehiclePanel(false)
                    props.selectVehicle('auto')
                }} className='flex border-2 border-gray-200 hover:border-gonexi-primary active:border-gonexi-primary mb-3 rounded-2xl w-full p-3 sm:p-4 items-center justify-between transition-all duration-200 hover:shadow-gonexi'>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gonexi-accent rounded-xl flex items-center justify-center">
                        <i className="ri-truck-line text-white text-lg sm:text-xl"></i>
                    </div>
                    <div className='ml-2 sm:ml-3 flex-1'>
                        <h4 className='font-semibold text-sm sm:text-base text-gray-800'>GoNexiAuto <span className="text-gray-500"><i className="ri-user-3-fill"></i>3</span></h4>
                        <h5 className='font-medium text-xs sm:text-sm text-gray-600'>3 mins away</h5>
                        <p className='font-normal text-xs text-gray-500'>Affordable auto rides</p>
                    </div>
                    <h2 className='text-base sm:text-lg font-bold text-gonexi-primary'>₹{props.fare.auto}</h2>
                </div>
            </div>
        </div>
    )
}

export default VehiclePanel