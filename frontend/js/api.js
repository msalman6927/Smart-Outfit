const API_URL = 'http://localhost:8000';

const api = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token) => localStorage.setItem('token', token),
    removeToken: () => localStorage.removeItem('token'),

    request: async (endpoint, options = {}) => {
        const token = api.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            api.removeToken();
            window.location.reload();
            return;
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Something went wrong');
        }

        return response.json();
    },

    auth: {
        login: async (email, password) => {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            api.setToken(data.access_token);
            return data;
        },
        signup: (data) => api.request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
        me: () => api.request('/auth/me'),
    },

    clothes: {
        list: () => api.request('/clothes/'),
        create: (data) => api.request('/clothes/', { method: 'POST', body: JSON.stringify(data) }),
        delete: (id) => api.request(`/clothes/${id}`, { method: 'DELETE' }),
    },

    recommendations: {
        get: (lat, lon) => api.request(`/recommendations/?lat=${lat}&lon=${lon}`),
    }
};
