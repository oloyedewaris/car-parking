import axiosInstance from "../utils/axiosInstance";
import { getEstateId } from "./user";

export const getUtilitiesApi = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(`/estate_utilities/?estate_id=${id}`);
};

export const getUtilityApi = async (utilId) => {
  const id = await getEstateId();
  return await axiosInstance.get(`estate_utilities/${utilId}/?estate_id=${id}`);
};

export const updateUtilityApi = async (utilId, data) => {
  const id = await getEstateId();
  return await axiosInstance.put(
    `estate_utilities/${utilId}/?estate_id=${id}`,
    data
  );
};

export const getServiceCategories = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-categories/?estate_id=${id}`
  );
};

export const getDataServiceCategories = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-categories/data/service?estate_id=${id}`
  );
};

export const getTVServiceCategories = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-categories/tv-subscription/service?estate_id=${id}`
  );
};

export const purchaseService = async (data: any) => {
  const id = await getEstateId();
  return await axiosInstance.post(
    `estate_payment/purchase/?estate_id=${id}`,
    data
  );
};

export const getTransactions = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(`estate_payment/purchase/?estate_id=${id}`);
};

// estate_payment/service-variations/mtn-data/service
export const getGloDataServiceVariation = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-variations/glo-data/service?estate_id=${id}`
  );
};

export const getMTNDataServiceVariation = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-variations/mtn-data/service?estate_id=${id}`
  );
};

export const getAirtelDataServiceVariation = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-variations/airtel-data/service?estate_id=${id}`
  );
};

export const getAirtimeServiceCategories = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/service-categories/airtime/service?estate_id=${id}`
  );
};
