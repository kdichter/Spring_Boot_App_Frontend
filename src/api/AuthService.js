import axios from "axios";

const AUTH_API_URL = 'http://localhost:8080/api/v1/auth';

export async function login(email, password) {
    const response = await axios.post(`${AUTH_API_URL}/authenticate`, {
        email,
        password
    });
    
    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('jwt_token', response.data.token);
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
    }
    
    return response.data;
}

export function logout() {
    localStorage.removeItem('jwt_token');
}

export function getToken() {
    return localStorage.getItem('jwt_token');
}

export function isAuthenticated() {
    return !!getToken();
}