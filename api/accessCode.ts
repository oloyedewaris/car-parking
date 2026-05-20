import axiosInstance from "../utils/axiosInstance";

export const createAccessCodeApi = async (body) => {
  return await axiosInstance.post(`/access-codes/`, body);
};

export const createTallyCardApi = async (body) => {
  return await axiosInstance.post(`/tally-cards/`, body);
};

export const getAccessLogs = async (search, status) => {
  return await axiosInstance.get(
    `/access-codes/?searc=${search}&status=${status}`
  );
};

export const revokeAccessCodeApi = async (id, body) => {
  return await axiosInstance.post(`/access-codes/${id}/revoke/`, body);
};
