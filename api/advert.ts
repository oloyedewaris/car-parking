import axiosInstance from "../utils/axiosInstance";

export const fetchAdverts = async () => {
  return await axiosInstance.get(`/estate_adverts/advert/`);
};

export const updateAdvert = async (body: any) => {
  return await axiosInstance.post(`/estate_adverts/track/`, body);
};

export const fetchAnnouncements = async () => {
  return await axiosInstance.get(`/estate_adverts/announcement/`);
};
