import axios from "axios";

const instance = axios.create({
  baseURL: "/api", // 这里的 /api 会被代理转发
  timeout: 10000,
  withCredentials: true, // 如果需要携带 cookie
});

export default instance;