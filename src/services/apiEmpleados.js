import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
  baseURL: URL.API_BASE_URL,
});


export const getEmpleados = async () => {
  try {
    const response = await axiosInstance.get("/empleados");
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
export const deleteEmpleado = async (id) => {
  try {
    await axiosInstance.delete(`/empleados/${id}`);
  } catch (error) {
    console.log(error)
  }
};

export const sendRegisterEmpleado = async (formData) => {
  try {
    const response = await axiosInstance.post('/empleados', formData);
    return response.data;
  } catch (error) {
    console.log("Error al agregar Empleado", error.response.data.error);
    throw error;
  }
};

