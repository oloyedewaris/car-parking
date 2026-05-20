import axiosInstance from "../utils/axiosInstance";

export const registerVehicleApi = async (body) => {
  return await axiosInstance.post("/vehicles/", body);
};

export const getVehiclesApi = async (search, status) => {
  return await axiosInstance.get(
    `/vehicles/?search=${search}&status=${status}`
  );
};

export const deletevehicleApi = async (id) => {
  return await axiosInstance.delete(`/vehicles/${id}`);
};

export const createAccessCode = async (body) => {
  return await axiosInstance.post("/api/access-codes", body);
};
