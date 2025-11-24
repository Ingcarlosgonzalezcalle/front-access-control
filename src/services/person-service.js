
import axios from "axios";
import { URL_BASE } from "../config/url-server";
const clientId = localStorage.getItem("client")
const accessToken = localStorage.getItem("token")




export const get = async (personId) => {
  const config = { headers: { client: clientId, Authorization: `Bearer ${accessToken}` } };
  try {
    const response = await axios.get(URL_BASE + "person/get?id=" + personId, config)
    console.log(response)
    const person = response.data?.data || null;
    return person;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};





export const insert = async (data) => {
  const config = { headers: { client: clientId, Authorization: `Bearer ${accessToken}` } };
  try {
    const response = await axios.post(URL_BASE + "person/insert", data, config)
    const success = response?.data || null;
    return success;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};


export const update = async (data) => {
  const config = { headers: { client: clientId, Authorization: `Bearer ${accessToken}` } };
  try {
    const response = await axios.post(URL_BASE + "person/update", data, config)
    const success = response.data?.success || null;
    return success;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};



export const list = async (page, limit, findName) => {
  try {
    const config = { headers: { client: clientId, Authorization: `Bearer ${accessToken}` } };
    const url = `${URL_BASE}person/list?page=${page}&limit=${limit}&name=${findName}`
    const response = await axios.get(url, config)
    const listado = response.data || null;
    return listado;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};






export default {
  list,
  get,
  insert,
  update,
}

