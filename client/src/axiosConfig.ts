import axios from "axios";

const axiosInstance =
  process.env.NODE_ENV === "development"
    ? axios.create({
        baseURL: "http://localhost:3000",
      })
    : axios.create();

export default axiosInstance;
