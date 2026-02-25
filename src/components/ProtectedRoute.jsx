import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/AuthService';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;

/*
    **Flow:**
    1. User tries to access `/contacts`
    2. `ProtectedRoute` checks `isAuthenticated()`
    3. If **no token** → Redirect to `/login`
    4. If **has token** → Show `<ContactsPage />`
*/
