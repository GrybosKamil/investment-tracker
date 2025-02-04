import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

export const setDbUri = (dbUri: string) => {
  axiosInstance.defaults.headers.common["X-Database-URI"] = dbUri;
};

export default axiosInstance;
