import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to manage error message

    const { setUser } = useContext(UserDataContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/users/login`,
                userData
            );

            if (response.status === 200) {
                const data = response.data;
                setUser(data.user);
                localStorage.setItem("token", data.token); // Save token to localStorage
                navigate("/home");
            }
        } catch (err) {
            // Handle error and set error message
            if (err.response && err.response.status === 401) {
                setError("Invalid email or password. Please try again.");
            } else {
                setError("An error occurred. Please try again later.");
            }
        }

        setEmail("");
        setPassword("");
    };

    return (
        <div className="absolute p-7 h-screen flex flex-col justify-between mt-8">
            <div>
                <img
                    className="w-16 mb-10"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
                    alt=""
                />

                <form onSubmit={submitHandler}>
                    <h3 className="text-lg font-medium mb-2">What's your email</h3>
                    <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
                        type="email"
                        placeholder="email@example.com"
                    />

                    <h3 className="text-lg font-medium mb-2">Enter Password</h3>
                    <input
                        className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                        placeholder="password"
                    />
                    
                        {error && (
                            <p className="text-red-500 mb-4">{error}</p> // Display error message
                        )}

                    <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base">
                        Login
                    </button>
                </form>

                <p className="text-center">
                    New here? {" "}
                    <Link to="/signup" className="text-blue-600">
                        Create new Account
                    </Link>
                </p>
            </div>

            <div>
                <Link
                    to="/captain-login"
                    className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base"
                >
                    Sign in as Captain
                </Link>
            </div>
        </div>
    );
};

export default UserLogin;
