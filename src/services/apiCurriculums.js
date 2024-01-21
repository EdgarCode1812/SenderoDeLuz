import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
  baseURL: URL.API_BASE_URL,
});

export const getCurriculums = async () => {
  try {
    const response = await axiosInstance.get("/contacto");
    return response.data;
  } catch (error) {
    console.log(error)
  }
};

export const deleteCV = async (id) => {
  try {
    await axiosInstance.delete(`/contacto/${id}`);
  } catch (error) {
    console.log(error)
  }
};



