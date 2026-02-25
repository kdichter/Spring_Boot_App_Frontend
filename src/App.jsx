import { Routes, Route, Navigate} from 'react-router-dom';
import { isAuthenticated} from './api/AuthService';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ContactsPage from './pages/ContactsPage';
import ContactDetailsPage from './pages/ContactDetailsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/contacts"
          element={
            <ProtectedRoute>
              <ContactsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts/:id"
          element={
            <ProtectedRoute>
              <ContactDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated() ?
              <Navigate to="/contacts" replace /> :
              <Navigate to="/login" replace />
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

// Separate component for the contacts page


export default App;
