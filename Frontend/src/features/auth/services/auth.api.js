import axios from 'axios';

const api =axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

export const register = async ({ username, email, password }) => {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
    }
};

export const login = async ({ email, password }) => {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
    }
};

export const logout = async () => {
    try {
        const response = await api.get('/api/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Logout error:', error);
    }
};

export const getMe = async () => {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
