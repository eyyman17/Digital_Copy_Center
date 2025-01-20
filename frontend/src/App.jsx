const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api, { getCSRFToken } from './api';

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

// Protected Route component
const ProtectedRoute = ({ children, allowedUserTypes = [] }) => {
  const [authState, setAuthState] = React.useState({
    isLoading: true,
    isAuthenticated: false,
    userType: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/professors/current-professor/');
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          userType: response.data.user_type
        });
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userType: null
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/accounts/login/" replace />;
  }

  if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(authState.userType)) {
    return <Navigate to="/accounts/login/" replace />;
  }

  return children;
};

const App = () => {
  // Initialize CSRF token when app loads
  useEffect(() => {
    const initializeCSRF = async () => {
      try {
        await getCSRFToken();
      } catch (error) {
        console.error('Failed to initialize CSRF token:', error);
      }
    };
    
    initializeCSRF();
  }, []);

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

        {/* Protected Professor Routes */}
        <Route path="/professors/document_submit/" element={
          <ProtectedRoute allowedUserTypes={['professor']}>
            <DocumentSubmitForm />
          </ProtectedRoute>
        }/>
        <Route path="/professors/document_history/" element={
          <ProtectedRoute allowedUserTypes={['professor']}>
            <ProfDocHistory />
          </ProtectedRoute>
        }/>

        {/* Protected Agent Routes */}
        <Route path="/agent/dashboard/" element={
          <ProtectedRoute allowedUserTypes={['agent']}>
            <AgentDashboard />
          </ProtectedRoute>
        }/>

        {/* Protected Direction Routes */}
        <Route path="/direction/dashboard/" element={
          <ProtectedRoute allowedUserTypes={['direction']}>
            <DirectionDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/direction/direction_history/" element={
          <ProtectedRoute allowedUserTypes={['direction']}>
            <Direction_Doc_History />
          </ProtectedRoute>
        }/>
        <Route path="/direction/professors_list/" element={
          <ProtectedRoute allowedUserTypes={['direction']}>
            <Professors_List />
          </ProtectedRoute>
        }/>
        <Route path="/direction/add_professor/" element={
          <ProtectedRoute allowedUserTypes={['direction']}>
            <Add_Professor />
          </ProtectedRoute>
        }/>

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/accounts/login/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;