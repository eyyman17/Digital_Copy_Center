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



// Uncomment these when the components are ready


// Protected Route Component
//const ProtectedRoute = ({ element: Element, allowedRole }) => {
//  const user = getAuthenticatedUser();
//  const isAuthenticated = !!user;
//  const hasRequiredRole = !allowedRole || user?.role === allowedRole;

//  if (!isAuthenticated) {
//    return <Navigate to="/accounts/login/" replace />;
//  }

//  if (allowedRole && !hasRequiredRole) {
//    // Redirect to login if user doesn't have the required role
//    return <Navigate to="/accounts/login/" replace />;
//  }

//  return Element;
//};

// Authentication utility
//const getAuthenticatedUser = () => {
//  try {
//    const user = localStorage.getItem("user");
//    return user ? JSON.parse(user) : null;
//  } catch (error) {
//    console.error("Error parsing user data:", error);
//    return null;
//  }
//};

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
        

        <Route  path="/professors/document_submit/"element={<DocumentSubmitForm />}/>
        <Route  path="/professors/document_history/"element={<ProfDocHistory />}/>

        <Route  path="/agent/dashboard/"element={<AgentDashboard />}/>

        <Route  path="/direction/dashboard/"element={<DirectionDashboard />}/>
        <Route  path="/direction/direction_history/"element={<Direction_Doc_History />}/>
        <Route  path="/direction/professors_list/"element={<Professors_List />}/>
        <Route  path="/direction/add_professor/"element={<Add_Professor />}/>






        {/* Professor Routes - Protected 
        <Route
          path="/professors/document_submit/"
          element={
            <ProtectedRoute 
              element={<DocumentSubmitForm />} 
              allowedRole="professor" 
            />
            
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

        {/* Agent Routes - Uncomment when ready */}
        {/* <Route
          path="/agents/dashboard/"
          element={
            <ProtectedRoute 
              element={<AgentDashboard />} 
              allowedRole="agent" 
            />
          }
        /> */}

        {/* Admin Routes - Uncomment when ready */}
        {/* <Route
          path="/direction/dashboard/"
          element={
            <ProtectedRoute 
              element={<DirectionDashboard />} 
              allowedRole="direction" 
            />
          }
        /> */}

        {/* Redirect unknown routes to login*/}
        <Route path="*" element={<Navigate to="/accounts/login/" replace />} /> 
      </Routes>
    </Router>
  );
};

export default App;