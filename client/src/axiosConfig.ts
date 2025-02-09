import axios from "axios";

const axiosInstance =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  process.env.NODE_ENV === "development"
    ? axios.create({
        baseURL: "http://localhost:3000",
      })
    : axios.create();

export default axiosInstance;
