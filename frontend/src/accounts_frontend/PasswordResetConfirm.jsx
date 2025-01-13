import React, { useState } from 'react';
import LoginLayout from './LoginLayout'; // Reuse the LoginLayout component
import esithLogo from '../assets/esith_logo.png';

const PasswordResetConfirm = ({ uid, token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        setLoading(true);
        fetch(`/accounts/reset/${uid}/${token}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({
                new_password1: newPassword,
                new_password2: confirmPassword,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                if (data.success) {
                    setSuccessMessage('Votre mot de passe a été réinitialisé avec succès! Vous pouvez maintenant vous connecter.');
                    setNewPassword('');
                    setConfirmPassword('');
                } else {
                    setErrorMessage(data.error || 'Une erreur s\'est produite.');
                }
            })
            .catch(() => {
                setLoading(false);
                setErrorMessage('Une erreur s\'est produite.');
            });
    };

    const getCsrfToken = () => {
        return document.cookie.split('; ').find((row) => row.startsWith('csrftoken')).split('=')[1];
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
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="peer placeholder-transparent h-12 w-64 border-b-2 border-custom-blue text-gray-900 focus:outline-none focus:border-custom-yellow text-base transition duration-300 ease-in-out"
                        placeholder="Nouveau mot de passe"
                    />
                    <label
                        htmlFor="newPassword"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Nouveau Mot de Passe
                    </label>
                </div>

                <div className="relative">
                    <input
                        autoComplete="off"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="peer placeholder-transparent h-12 w-64 border-b-2 border-custom-blue text-gray-900 focus:outline-none focus:border-custom-yellow text-base transition duration-300 ease-in-out"
                        placeholder="Confirmer le mot de passe"
                    />
                    <label
                        htmlFor="confirmPassword"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                        Confirmer Mot de Passe
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
                        {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
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

export default PasswordResetConfirm;