import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)',
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)',
            })
        }
    }, [finishRidePanel])

    return (
        <div className='relative h-screen flex flex-col'>
            <div className='fixed top-0 p-6 flex items-center justify-between w-full'>
                <img
                    className='w-16'
                    src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
                    alt=''
                />
                <Link
                    to='/captain-home'
                    className='h-10 w-10 bg-white flex items-center justify-center rounded-full'
                >
                    <i className='text-lg font-medium ri-logout-box-r-line'></i>
                </Link>
            </div>

            <div className='flex-grow'>
                <LiveTracking />
            </div>

            <div className='h-[20%] p-4 flex items-center justify-between relative bg-yellow-400 shadow-md rounded-t-lg'>
                <div className='flex items-center gap-2'>
                    <i className='text-3xl text-gray-800 ri-map-pin-line'></i>
                    <div>
                        <h4 className='text-lg font-bold text-gray-800'>Ride in Progress</h4>
                    </div>
                </div>
                <button
                    className='bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-semibold py-2 px-6 rounded-lg shadow'
                    onClick={() => setFinishRidePanel(true)}
                >
                    Complete Ride
                </button>
            </div>


            <div
                ref={finishRidePanelRef}
                className='absolute w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
            >
                <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
            </div>
        </div>
    )
}

export default CaptainRiding
