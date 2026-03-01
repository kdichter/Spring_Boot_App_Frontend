import axios from "axios";

const AUTH_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`;

export async function login(email, password) {
    const response = await axios.post(`${AUTH_API_URL}/authenticate`, {
        email,
        password
    });
    
    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);
        localStorage.setItem('username', email);
    }
    
    return response.data;
}

export async function register(firstname, lastname, email, password) {
    const response = await axios.post(`${AUTH_API_URL}/register`, {
        firstname,
        lastname,
        email,
        password
    });
    
    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);
        localStorage.setItem('username', email);
    }
    
    return response.data;
}

export function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('username');
}

export function getToken() {
    return localStorage.getItem('jwt_token');
}

export function getUsername() {
    return localStorage.getItem('username');
}

export function isAuthenticated() {
    return !!getToken();
}