import React from 'react';

const Alerts = ({ message, type }) => {
    if (!message) return null;

    const alertClass = `alert alert-${type || 'info'}`;

    return <div className={alertClass}>{message}</div>;
};

export default Alerts;