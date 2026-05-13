import axiosInstance from "../utils/axiosInstance";
import { getEstateId } from "./user";

export const getWalletApi = async (body: object) => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `/estate_payment/setwallet/?estate_id=${id}`,
    body
  );
};

export const getUserWalletApi = async (body: object) => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `/estate_payment/setwallet/?estate_id=${id}`,
    body
  );
};

export const setWalletApi = async (body: object) => {
  const id = await getEstateId();
  return await axiosInstance.post(
    `/estate_payment/setwallet/?estate_id=${id}`,
    body
  );
};

export const requestOTP = async (body: object) => {
  const id = await getEstateId();
  return await axiosInstance.post(
    `/estate_payment/requestotp/?estate_id=${id}`,
    body
  );
};

export const verifyOTP = async (body: object) => {
  const id = await getEstateId();
  return await axiosInstance.post(
    `estate_payment/VerifyEmailAddress/?estate_id=${id}`,
    body
  );
};

export const openAccount = async (body: object) => {
  const id = await getEstateId();
  return await axiosInstance.post(
    `estate_payment/openaccount/?estate_id=${id}`,
    body
  );
};

export const virtualAccountStatus = async () => {
  const id = await getEstateId();
  return await axiosInstance.get(
    `estate_payment/virtualaccountstatus/?estate_id=${id}`
  );
};
