const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import LoginLayout from "./LoginLayout";
import esithLogo from "../assets/esith_logo.png";
import imsLogo from "../assets/ims_logo.png";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithCSRF } from "../utils/csrfToken";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRedirect = (userType) => {
        switch(userType) {
            case 'agent':
                navigate('/agent/dashboard');
                break;
            case 'direction':
                navigate('/direction/dashboard');
                break;
            case 'professor':
                navigate('/professors/document_submit/');
                break;
            default:
                setErrors({ global: "Type d'utilisateur non valide" });
        }
    };

    const validateForm = () => {
        if (!email || !password) {
            setErrors({ global: "Veuillez remplir tous les champs." });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setErrors({});

        try {
            const response = await fetchWithCSRF(`${API_BASE_URL}/accounts/login/`, {
                method: "POST",
                body: JSON.stringify({ 
                    email: email,
                    password 
                })
            });

            const data = await response.json();
            console.log("Login response:", data); // Debugging

            if (response.ok && data.success) {
                localStorage.setItem("user", JSON.stringify({
                    isAuthenticated: true,
                    role: data.user_type
                }));
                handleRedirect(data.user_type);
            } else {
                setErrors({ 
                    global: data.error || "Erreur inattendue. Veuillez réessayer." 
                });
            }
        } catch (error) {
            setErrors({ 
                global: "Erreur de connexion au serveur." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginLayout>
            <div className="flex justify-center mb-4">
                <img src={esithLogo} alt="Logo Esith" className="h-24" />
            </div>
            {errors.global && <div className="alert alert-danger mb-4">{errors.global}</div>}
            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                    <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer placeholder-transparent h-10 w-64 border-b-2 border-custom-blue text-gray-900 focus:outline-none focus:border-custom-yellow text-base"
                        placeholder="Adresse email"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Adresse Email
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
                        className="peer placeholder-transparent h-10 w-64 border-b-2 border-custom-blue text-gray-900 focus:outline-none focus:border-custom-yellow text-base"
                        placeholder="Mot de passe"
                    />
                    <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Mot de Passe
                    </label>
                </div>
                
                {/* Forgot Password Link */}
                <div className="flex justify-end mt-2">
                    <a
                        href="/accounts/password_reset/"
                        className="text-sm text-custom-teal hover:text-custom-teal"
                    >
                        Mot de passe oublié ?
                    </a>
                </div>

                <div className="relative mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-custom-yellow text-white rounded-md px-4 py-2 w-full hover:bg-custom-dark-blue focus:outline-none focus:ring-2 focus:ring-custom-yellow mb-10 disabled:opacity-50"
                    >
                        {loading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </div>
                <div className="flex">
                    <img className="h-6" />
                </div>
                <div className="absolute bottom-8 right-5">
                    <img src={imsLogo} alt="Logo IMS" className="h-20" />
                </div>
            </form>
        </LoginLayout>
    );
};

export default Login;