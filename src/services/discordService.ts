import axios, { AxiosRequestConfig } from "axios";
import {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
} from "../config/discordConfig";

export const requestToken = async (code: string) => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const formData = new FormData();
  formData.append("client_id", DISCORD_CLIENT_ID);
  formData.append("client_secret", DISCORD_CLIENT_SECRET);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", "http://localhost:3000");
  formData.append("scope", "identify");
  formData.append("code", code);

  return await axios.post(
    "https://discordapp.com/api/oauth2/token",
    formData,
    config
  );
};
