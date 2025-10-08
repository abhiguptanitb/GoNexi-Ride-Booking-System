
import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
    return (
        <div>
            <div className='bg-gonexi-gradient-light h-screen pt-8 flex justify-between flex-col w-full relative'>
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
                
                {/* Logo and branding */}
                <div className="relative z-10 ml-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gonexi-gradient rounded-2xl flex items-center justify-center shadow-gonexi-lg">
                            <span className="text-white font-bold text-2xl">G</span>
                        </div>
                        <div>
                            <h1 className="text-white text-2xl font-bold">GoNexi</h1>
                            <p className="text-white/80 text-sm">Fast, Reliable, Everywhere</p>
                        </div>
                    </div>
                </div>
                
                {/* Main content area - replacing image with text */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-8 relative z-10">
                    <div className="text-center text-white max-w-2xl w-full">
                        <div className="mb-6 sm:mb-8">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                <span className="text-gray-800">Your Journey,</span><br />
                                <span className="bg-gonexi-gradient bg-clip-text text-transparent">Our Priority</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed px-2 font-medium">
                                Experience the future of transportation with GoNexi. 
                                Safe, reliable, and always on time.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="w-12 h-12 bg-gonexi-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <i className="ri-time-line text-white text-2xl"></i>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1">Fast</h3>
                                <p className="text-gray-600 text-sm">Quick pickups</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="w-12 h-12 bg-gonexi-secondary rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <i className="ri-shield-check-line text-white text-2xl"></i>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1">Safe</h3>
                                <p className="text-gray-600 text-sm">Verified drivers</p>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                                <div className="w-12 h-12 bg-gonexi-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <i className="ri-map-pin-line text-white text-2xl"></i>
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1">Reliable</h3>
                                <p className="text-gray-600 text-sm">Always available</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom section with call to action */}
                <div className='bg-white/95 backdrop-blur-sm pb-6 sm:pb-8 py-4 sm:py-6 px-4 sm:px-6 relative z-10 rounded-t-3xl shadow-2xl'>
                    <div className="text-center">
                        <h2 className='text-2xl sm:text-3xl font-bold bg-gonexi-gradient bg-clip-text text-transparent mb-2'>
                            Get Started with GoNexi
                        </h2>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Your journey, our priority</p>
                        <Link 
                            to='/login' 
                            className='flex items-center justify-center w-full bg-gonexi-gradient text-white py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-gonexi-lg hover:shadow-gonexi transform hover:scale-105 transition-all duration-200'
                        >
                            Continue Your Journey
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Start