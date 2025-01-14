const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useState } from 'react';
import LoginLayout from './LoginLayout'; 
import esithLogo from '../assets/esith_logo.png';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${API_BASE_URL}/accounts/password_reset/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({ email }),
        })
            .then(async (res) => {
                const data = await res.json();
                setLoading(false);

                if (res.ok) {
                    setSuccessMessage('Le lien de réinitialisation a été envoyé à votre adresse email.');
                    setEmail('');
                } else {
                    setErrorMessage(data.error || 'Une erreur inattendue s\'est produite.');
                }
            })
            .catch(() => {
                setLoading(false);
                setErrorMessage('Erreur de connexion au serveur.');
            });
    };

    const getCsrfToken = () => {
        const csrfCookie = document.cookie.split('; ').find((row) => row.startsWith('csrftoken'));
        return csrfCookie ? csrfCookie.split('=')[1] : null;
    };

    return (
        <LoginLayout>
            <div className="flex justify-center mb-4">
                <img src={esithLogo} alt="Logo Esith" className="h-24" />
            </div>

            {/* Success/Error Messages */}
            {successMessage && <div className="alert alert-success mb-4 p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                    <input
                        autoComplete="off"
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="peer placeholder-transparent h-12 w-full border-b-2 border-custom-blue text-gray-900 focus:outline-none focus:border-custom-yellow text-base transition duration-300 ease-in-out"
                        placeholder="Adresse email"
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Adresse Email
                    </label>
                </div>

                {/* Submit Button */}
                <div className="relative mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-custom-yellow text-white rounded-md px-6 py-3 w-full transition duration-300 ease-in-out 
                            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-custom-dark-blue focus:outline-none focus:ring-2 focus:ring-custom-yellow'}`}
                    >
                        {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                    </button>
                </div>

                {/* Link back to login */}
                <div className="text-center mt-4">
                    <a href="/accounts/login/" className="text-sm text-custom-teal hover:text-custom-teal">
                        Retour à la connexion
                    </a>
                </div>
            </form>
        </LoginLayout>
    );
};

export default PasswordResetForm;