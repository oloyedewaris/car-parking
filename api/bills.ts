import axios from "axios";

// const baseUrl = "http://localhost:4000/api/v1";
const baseUrl = "https://estateiq-bills-f58acee3adeb.herokuapp.com/api/v1";

export const airtimeBillPaymentApi = async (data) =>
  await axios.post(`${baseUrl}/bill/pay`, data);

export const dataServicesApi = async (serviceID) =>
  await axios.get(`${baseUrl}/bill/data-services?serviceID=${serviceID}`);

export const smartCardApi = async (data) =>
  await axios.post(`${baseUrl}/bill//verify-smartcard`, data);
