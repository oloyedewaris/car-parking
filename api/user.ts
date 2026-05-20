import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axiosInstance";

export const getUserDetails = async (id) => {
  return axiosInstance.get(`/users/${id}/`);
};

export const getAllUsers = async (search, status) => {
  return axiosInstance.get(`/users/?searc=${search}&status=${status}`);
};

export const approveUserApi = async (id, body) => {
  return axiosInstance.post(`/users/${id}/approve/`, body);
};

export const reactivateUserApi = async (id, body) => {
  return axiosInstance.post(`/users/${id}/reactivate/`, body);
};

export const rejectUserApi = async (id, body) => {
  return axiosInstance.post(`/users/${id}/reject/`, body);
};

export const suspendUserApi = async (id, body) => {
  return axiosInstance.post(`/users/${id}/suspend/`, body);
};
