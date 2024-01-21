import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
    baseURL: URL.API_BASE_URL,
});

export const loginService = async (form) => {
    try {
        const response = await axiosInstance.post("/users/auth", form);
        return response.data;
    } catch (error) {
        console.log("Error al iniciar sesión", error.response.data.error);
        throw error; // Propaga la excepción
    }
};



