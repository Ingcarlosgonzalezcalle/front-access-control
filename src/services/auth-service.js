
import axios from "axios";
import { URL_BASE } from "../config/url-server";

  export const login = async (data,client) => {    
    localStorage.setItem("client",client)
    const config = { headers: { client: client } };
    try {
      const response = await axios.post(URL_BASE+"user/login", data, config)
      const res = response.data|| null;
      return res;
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  };


  export default{
    login
  }

