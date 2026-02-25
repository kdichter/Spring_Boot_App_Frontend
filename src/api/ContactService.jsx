import axios from "axios";
import { getToken } from "./AuthService";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/contacts`;

// Helper function to get headers with JWT token
const getAuthHeaders = () => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export async function saveContact(contact) {
    return await axios.post(`${API_URL}`, contact, getAuthHeaders());
}

export async function getContacts(page = 0, size = 10) {
    return await axios.get(`${API_URL}?page=${page}&size=${size}`, getAuthHeaders());
}

export async function getContact(id) {
    return await axios.get(`${API_URL}/${id}`, getAuthHeaders());
}

export async function updateContact(contact) {
    return await axios.put(`${API_URL}/${contact.id}`, contact, getAuthHeaders());
}

export async function updatePhoto(formData) {
    return await axios.put(`${API_URL}/photo`, formData, getAuthHeaders());
}

export async function deleteContact(id) {
    return await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
}