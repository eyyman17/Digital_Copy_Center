import esithLogo from "../assets/esith_logo.png";

import React, { useState } from 'react';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/accounts/password_reset/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({ email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSuccessMessage("Le lien de réinitialisation a été envoyé à votre adresse email.");
                    setEmail('');
                } else {
                    setErrorMessage(data.error || 'Une erreur s\'est produite.');
                }
            });
    };

    const getCsrfToken = () => {
        return document.cookie.split('; ').find((row) => row.startsWith('csrftoken')).split('=')[1];
    };

    return (
        <div className="container login-container">
            <img src={esithLogo} alt="Logo"/>
            <h2 className="text-center">Réinitialisation du mot de passe</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Envoyer le lien de réinitialisation</button>
                <div className="mt-3 text-center">
                    <a href="/accounts/login/">Retour à la connexion</a>
                </div>
            </form>
        </div>
    );
};

export default PasswordResetForm;