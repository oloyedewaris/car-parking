import axios from "axios";

const baseUrl = 'https://www.nellobytesystems.com/';
const UserID = 'CK100707456';
const API_KEY = '22I81Q5NC69P53EB110OTUUQRJ26S6L86KS4297IMFD71W037YF7SW5K7QQ1IJ99';
const callback_url = 'https://estateiq.ng/';


export const billPaymentApi = async (data) => {
  const { electric_company_code, meter_type, meter_no, _amount, recipient_phoneno } = data
  const request_id = 'request_id';


  return await axios.get(
    `${baseUrl}APIElectricityV1.asp?UserID=${UserID}&APIKey=${API_KEY}&ElectricCompany=${electric_company_code}&MeterType=${meter_type}&MeterNo=${meter_no}&Amount=${_amount}&PhoneNo=${recipient_phoneno}&RequestID=${request_id}&CallBackURL=${callback_url}`
  )
}

export const queryTransaction = async () => {
  const order_id = 'order_id';

  return await axios.get(
    `${baseUrl}APIQueryV1.asp?UserID=${UserID}&APIKey=${API_KEY}&OrderID=${order_id}`
  )
}

export const cancelTransaction = async () => {
  const order_id = 'order_id';

  return await axios.get(
    `${baseUrl}APICancelV1.asp?UserID=${UserID}&APIKey=${API_KEY}&OrderID=${order_id}`
  )
}

export const verifyMeterNumber = async () => {
  const electric_company_code = 'electric_company_code';
  const meter_no = 'meter_no';

  return await axios.get(
    `${baseUrl}APIVerifyElectricityV1.asp?UserID=${UserID}&APIKey=${API_KEY}&ElectricCompany=${electric_company_code}&MeterNo=${meter_no}`
  )
}