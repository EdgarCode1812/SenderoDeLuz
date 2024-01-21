import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
  baseURL: URL.API_BASE_URL,
});


/*Facturas Clientes*/

export const getFacturaClientebyemail = async (email) => {
  try {
    const response = await axiosInstance.get(`/facturas/email/${email}`);
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const addFactura = async (formData) => {
  try {
    const response = await axiosInstance.post("/facturas", formData);
    return response.data;
  } catch (error) {
    console.log("Error al agregar factura", error.response.data.error);
    throw error; // Propaga la excepción
  }
};

export const addFacturaProveedores = async (formData) => {
  try {
    const response = await axiosInstance.post("/facturasproveedores", formData);
    return response.data;
  } catch (error) {
    console.log("Error al agregar factura", error.response.data.error);
    throw error; // Propaga la excepción
  }
};

export const getFacturas = async () => {
  try {
    const response = await axiosInstance.get("/facturas");
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const deleteFactura = async (id) => {
  try {
    await axiosInstance.delete(`/facturas/${id}`);
  } catch (error) {
    console.log(error)
  }
};


/*Facturas Proveedores*/

export const getFacturasProveedores = async () => {
  try {
    const response = await axiosInstance.get("/facturasproveedores");
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const deleteFacturaProveedor = async (id) => {
  try {
    await axiosInstance.delete(`/facturasproveedores/${id}`);
  } catch (error) {
    console.log(error)
  }
};


export const getFacturaProveedorbyemail = async (email) => {
  try {
    const response = await axiosInstance.get(`/facturasproveedores/email/${email}`);
    return response.data;
  } catch (error) {
    console.log(error.response.data.mensaje)
  }
};

export const addFacturaProveedor = async (formData) => {
  try {
    const response = await axiosInstance.post("/facturasproveedores", formData);
    return response.data;
  } catch (error) {
    console.log("Error al agregar factura", error.response.data.error);
    throw error; // Propaga la excepción
  }
};

