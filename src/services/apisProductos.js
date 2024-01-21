import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
    baseURL: URL.API_BASE_URL,
});

  export const addProducto = async (formData) => {
    try {
      const response = await axiosInstance.post("/image", formData);
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };

  export const getProductos = async () => {
    try {
      const response = await axiosInstance.get("/image");
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };

  export const deleteProducto = async (id) => {
    try {
      await axiosInstance.delete(`/image/${id}`);
    } catch (error) {
        console.log(error)
    }
  };


