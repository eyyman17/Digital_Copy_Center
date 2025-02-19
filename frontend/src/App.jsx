
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./accounts_frontend/Login";
import PasswordResetForm from "./accounts_frontend/PasswordResetForm";
import PasswordResetConfirm from "./accounts_frontend/PasswordResetConfirm";

import DocumentSubmitForm from "./professors_frontend/DocumentSubmitForm";
import ProfDocHistory from "./professors_frontend/Prof_Doc_History";

import AgentDashboard from "./agent_frontend/AgentDashboard";

import DirectionDashboard from "./direction_frontend/DirectionDashboard";
import Direction_Doc_History from "./direction_frontend/Direction_Doc_History";
import Professors_List from "./direction_frontend/Professors_List";
import Add_Professor from "./direction_frontend/Add_Professor";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/accounts/login/" element={<Login />} />
        <Route path="/accounts/password_reset/" element={<PasswordResetForm />} />
        <Route 
          path="/accounts/password_reset_confirm/:uid/:token/" 
          element={<PasswordResetConfirm />} 
        />
        
        {/* Professor Routes - Protected */}
        <Route
          path="/professors/document_submit/"
          element={
            <ProtectedRoute 
              element={<DocumentSubmitForm />} 
              allowedRole="professor" 
            />
          }
        />
        <Route
          path="/professors/document_history/"
          element={
            <ProtectedRoute 
              element={<ProfDocHistory />} 
              allowedRole="professor" 
            />
          }
        />

        {/* Agent Routes */}
        <Route
          path="/agent/dashboard/"
          element={
            <ProtectedRoute 
              element={<AgentDashboard />} 
              allowedRole="agent" 
            />
          }
        />

        {/* Direction/Admin Routes */}
        <Route
          path="/direction/dashboard/"
          element={
            <ProtectedRoute 
              element={<DirectionDashboard />} 
              allowedRole="direction" 
            />
          }
        />
        <Route
          path="/direction/direction_history/"
          element={
            <ProtectedRoute 
              element={<Direction_Doc_History />} 
              allowedRole="direction" 
            />
          }
        />
        <Route
          path="/direction/professors_list/"
          element={
            <ProtectedRoute 
              element={<Professors_List />} 
              allowedRole="direction" 
            />
          }
        />
        <Route
          path="/direction/add_professor/"
          element={
            <ProtectedRoute 
              element={<Add_Professor />} 
              allowedRole="direction" 
            />
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/accounts/login/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;