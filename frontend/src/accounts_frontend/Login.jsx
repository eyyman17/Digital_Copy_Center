import React, { useState } from "react";
import LoginLayout from "./LoginLayout"; // Import the layout component
import esithLogo from "../assets/esith_logo.png";
import imsLogo from "../assets/ims_logo.png";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            newErrors.email = "S'il vous plaît, mettez une adresse email valide.";
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            fetch("/accounts/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
                body: JSON.stringify({ username: email, password }),
            })
                .then((res) => {
                    if (res.ok) {
                        window.location.href = "/accounts/redirect/";
                    } else {
                        setErrors({
                            global: "Identifiants non valides. Veuillez réessayer.",
                        });
                    }
                })
                .catch(() => {
                    setErrors({ global: "Erreur de connexion au serveur." });
                });
        }
    };

    const getCsrfToken = () => {
        return document.cookie.split("; ").find((row) => row.startsWith("csrftoken")).split("=")[1];
    };

    return (
        <LoginLayout>
            <div className="flex justify-center mb-6">
                <img src={esithLogo} alt="Esith Logo" className="h-20 mr-4" />
            </div>
            {errors.global && <div className="alert alert-danger">{errors.global}</div>}
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative">
                        <input
                            autoComplete="off"
                            id="email"
                            name="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-sky-500"
                            placeholder="Email address"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                            Email Address
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            autoComplete="off"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-sky-500"
                            placeholder="Password"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                            Password
                        </label>
                    </div>
                    <div className="relative">
                        <button
                            type="submit"
                            className="bg-cyan-500 text-white rounded-md px-4 py-2 w-full hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="flex ml-20 ">
                    <img src={imsLogo} alt="IMS Logo" className="h-20" />
                </div>
            </form>
        </LoginLayout>
    );
};

export default LoginForm;