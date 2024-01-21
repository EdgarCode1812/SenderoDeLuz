import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
    baseURL: URL.API_BASE_URL,
});

export const getComprobantes = async () => {
    try {
      const response = await axiosInstance.get("/transfer");
      return response.data;
    } catch (error) {
        console.log(error)
        throw error; 
    }
  };

  
  export const deleteComprobante = async (id) => {
    try {
      await axiosInstance.delete(`/transfer/${id}`);
    } catch (error) {
        console.log(error)
        throw error; 
    }
  };

  export const addComprobante = async (formData) => {
    try {
        const response = await axiosInstance.post('/transfer', formData);
        return response.data;
    } catch (error) {
      console.log("Error al agregar comprobante", error.response.data.error);
        throw error;
    }
};

export const getComprobantebyemail = async (email) => {
  try {
    const response = await axiosInstance.get(`/transfer/email/${email}`);
    return response.data;
  } catch (error) {
    console.log(error.response.data.mensaje)
    throw error;
  }
};