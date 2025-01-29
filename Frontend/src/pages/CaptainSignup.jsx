import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [vehicleColor, setVehicleColor] = useState('')
    const [vehiclePlate, setVehiclePlate] = useState('')
    const [vehicleCapacity, setVehicleCapacity] = useState('')
    const [vehicleType, setVehicleType] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const { setCaptain } = React.useContext(CaptainDataContext) //when you are not importing the hooks individually

    const submitHandler = async (e) => {
        e.preventDefault()
        setErrorMessage('') 

        if (firstName.length < 3) {
            setErrorMessage('First name must be at least 3 characters long.');
            return;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.match(emailPattern)) {
            setErrorMessage('Invalid email format.');
            return;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        if (vehicleColor.length < 3) {
            setErrorMessage('Vehicle color must be at least 3 characters long.');
            return;
        }

        if (vehiclePlate.length < 3) {
            setErrorMessage('Vehicle plate must be at least 3 characters long.');
            return;
        }

        if (vehicleCapacity <= 0) {
            setErrorMessage('Vehicle capacity must be at least 1.');
            return;
        }

        if (!['car', 'auto', 'moto'].includes(vehicleType)) {
            setErrorMessage('Invalid vehicle type.');
            return;
        }

        const captainData = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password,
            vehicle: {
                color: vehicleColor,
                plate: vehiclePlate,
                capacity: vehicleCapacity,
                vehicleType: vehicleType
            }
        }



        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

            if (response.status === 201) {
                const data = response.data
                setCaptain(data.captain)
                localStorage.setItem('token', data.token)
                navigate('/captain-home')
            }

                setEmail('')
                setFirstName('')
                setLastName('')
                setPassword('')
                setVehicleColor('')
                setVehiclePlate('')
                setVehicleCapacity('')
                setVehicleType('')

        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage('Captain already exists. Please try logging in.')
            } else {
                setErrorMessage('An error occurred. Please try again later.')
            }
        }
    }

    return (
        <div className='py-2 px-5 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-20' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />                

                <form onSubmit={submitHandler}>

                    <h3 className='text-lg w-full font-medium mb-2'>What's our Captain's name</h3>
                    <div className='flex gap-4 mb-5'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='First name'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='Last name'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        type="email"
                        placeholder='email@example.com'
                    />

                    <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
                    <input
                        className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                        placeholder='password'
                    />

                    <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>

                    <div className='flex gap-4 mb-7'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='Vehicle Color'
                            value={vehicleColor}
                            onChange={(e) => setVehicleColor(e.target.value)}
                        />
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="text"
                            placeholder='Vehicle Plate'
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                        />
                    </div>
                    <div className='flex gap-4 mb-5'>
                        <input
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            type="number"
                            placeholder='Vehicle Capacity'
                            value={vehicleCapacity}
                            onChange={(e) => setVehicleCapacity(e.target.value)}
                        />
                        <select
                            required
                            className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                        >
                            <option value="" disabled>Select Vehicle Type</option>
                            <option value="car">Car</option>
                            <option value="auto">Auto</option>
                            <option value="moto">Moto</option>
                        </select>
                    </div>

                    <div 
                        className="h-6 text-center mb-2 flex items-center justify-center">
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>


                    <button
                        className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
                    >Create Captain Account</button>

                </form>
                <p className='text-center'>Already have an account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
            </div>
            <div className='mb-5'>
                <p className='text-[10px] mt-6 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
            </div>
        </div>
    )
}

export default CaptainSignup
