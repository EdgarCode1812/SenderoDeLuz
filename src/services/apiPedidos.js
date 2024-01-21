import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
    baseURL: URL.API_BASE_URL,
});

  export const getProductos = async () => {
    try {
      const response = await axiosInstance.get("/productos");
      return response.data;
    } catch (error) {
        console.log("Error al traer productos", error.response.data.error);
        throw error; 
      }
  };

  export const sendPedido = async (formData) => {
    try {
      const response = await axiosInstance.post("/pedidos", formData);
      return response.data;
    } catch (error) {
      console.log("Error al enviar pedido", error.response.data.error);
      throw error;     }
  };

  export const getPedidoCliente = async (id) => {
    try {
      const response = await axiosInstance.get(`/pedidoscliente/${id}`);
      return response.data;
    } catch (error) {
      console.log(error)
    }
  };

  export const getAllPedidos = async () => {
    try {
      const response = await axiosInstance.get("/pedidos");
      return response.data;
    } catch (error) {
        console.log("Error al traer pedidos", error.response.data.error);
        throw error; 
      }
  };

  export const getPedidobyAdmin = async (id) => {
    try {
      const response = await axiosInstance.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error; 
    }
  };

  export const changePedidobyAdmin = async (formdata, id) => {
    try {
      const response = await axiosInstance.put(`/pedidoscliente/${id}`, formdata);
      return response.data;
    } catch (error) {
      console.log(error)
      throw error; 
    }
  };