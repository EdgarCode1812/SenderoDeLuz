import axios from 'axios';
import URL from '../environments/config.dev';

const axiosInstance = axios.create({
    baseURL: URL.API_BASE_URL,
});

export const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };

  export const getUserbyId = async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };

  export const getRoles = async () => {
    try {
      const response = await axiosInstance.get("/roles");
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };

  export const deleteUser = async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
        console.log(error)
    }
  };

  export const addUser = async (form) => {
    try {
      const response = await axiosInstance.post("/users", form);
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };

  export const editUser = async (form) => {
    try {
      const response = await axiosInstance.put("/users", form);
      return response.data;
    } catch (error) {
        console.log(error)
    }
  };



