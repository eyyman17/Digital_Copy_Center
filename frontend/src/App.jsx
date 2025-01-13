import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./accounts_frontend/Login";
import PasswordResetForm from "./accounts_frontend/PasswordResetForm";
import PasswordResetConfirm from "./accounts_frontend/PasswordResetConfirm";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/accounts/login/" element={<Login />} />
                <Route path="/accounts/password_reset/" element={<PasswordResetForm />} />
                <Route path="/accounts/reset/:uid/:token/" element={<PasswordResetConfirm />} />
            </Routes>
        </Router>
    );
};

export default App;