import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./accounts_frontend/Login";
import PasswordResetForm from "./accounts_frontend/PasswordResetForm";
import PasswordResetConfirm from "./accounts_frontend/PasswordResetConfirm";
// Import your dashboard components
//import AgentDashboard from "./agent/Dashboard";
//import DirectionDashboard from "./direction/Dashboard";
//import ProfessorDashboard from "./professor/Dashboard";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/accounts/login/" element={<Login />} />
                <Route path="/accounts/password_reset/" element={<PasswordResetForm />} />
                <Route path="/accounts/password_reset_confirm/:uid/:token/" element={<PasswordResetConfirm />} />
                
                {/* Add routes for different user types */}
                {/*** <Route path="/agent/dashboard" element={<AgentDashboard />} />
                <Route path="/direction/dashboard" element={<DirectionDashboard />} />
                <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            ***/}
            </Routes>
        </Router>
    );
};

export default App;