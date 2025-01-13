import esithLogo from "../assets/esith_logo.png";

import React, { useState } from 'react';

const PasswordResetConfirm = ({ uid, token }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMessage('Les mots de passe ne correspondent pas.');
            return;
        }

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
                if (data.success) {
                    setSuccessMessage('Votre mot de passe a été réinitialisé avec succès! Vous pouvez maintenant vous connecter.');
                    setNewPassword('');
                    setConfirmPassword('');
                } else {
                    setErrorMessage(data.error || 'Une erreur s\'est produite.');
                }
            });
    };

    const getCsrfToken = () => {
        return document.cookie.split('; ').find((row) => row.startsWith('csrftoken')).split('=')[1];
    };

    return (
        <div className="container reset-container">
            <img src={esithLogo} alt="Logo"/>
            <h2 className="text-center">Réinitialisation du mot de passe</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nouveau mot de passe:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmez le nouveau mot de passe:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Réinitialiser le mot de passe</button>
                <div className="mt-3 text-center">
                    <a href="/accounts/login/">Retour à la connexion</a>
                </div>
            </form>
        </div>
    );
};

export default PasswordResetConfirm;