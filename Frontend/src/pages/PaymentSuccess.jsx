import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [message, setMessage] = useState('Verifying your Stripe payment...')

    useEffect(() => {
        const sessionId = searchParams.get('session_id')
        const rideId = searchParams.get('ride_id')

        if (!sessionId || !rideId) {
            navigate('/home')
            return
        }

        const verifyPayment = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/payment/verify`, {
                    params: {
                        rideId,
                        sessionId,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })

                if (response.data.ride) {
                    localStorage.setItem('activeRide', JSON.stringify(response.data.ride))
                }

                if (response.data.paymentStatus === 'paid') {
                    setMessage('Payment successful. Redirecting you to your home page...')
                    localStorage.removeItem('activeRide')

                    setTimeout(() => {
                        navigate('/home')
                    }, 1500)

                    return
                }

                setMessage('Payment is not completed yet. Redirecting you back to the ride page...')
                setTimeout(() => {
                    navigate(`/riding?ride_id=${rideId}`)
                }, 1500)
            } catch (error) {
                console.error('Error verifying payment:', error)
                setMessage('We could not verify your payment right now. Redirecting you back to the ride page...')
                setTimeout(() => {
                    navigate(`/riding?ride_id=${rideId}`)
                }, 1500)
            }
        }

        verifyPayment()
    }, [navigate, searchParams])

    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 px-6 text-center'>
            <div className='max-w-md rounded-2xl bg-white p-8 shadow-lg'>
                <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100'>
                    <i className='ri-secure-payment-line text-2xl text-green-600'></i>
                </div>
                <h1 className='mt-4 text-2xl font-semibold text-gray-900'>Stripe Payment</h1>
                <p className='mt-3 text-sm leading-6 text-gray-600'>{message}</p>
            </div>
        </div>
    )
}

export default PaymentSuccess
