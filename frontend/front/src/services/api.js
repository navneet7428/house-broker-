import axios from "axios";

// SAFE BASE URL
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://house-broker-backend.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (req) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(
      "API Error:",
      error.response?.data ||
        error.message
    );
    return Promise.reject(error);
  }
);

// ==========================
// HOUSES
// ==========================
export const getApprovedHouses =
  () => API.get("/houses/approved");

export const getPendingHouses =
  () => API.get("/houses/pending");

export const approveHouse = (id) =>
  API.put(`/houses/approve/${id}`);

export const deleteHouse = (id) =>
  API.delete(`/houses/delete/${id}`);

export const getMyHouses = () =>
  API.get("/houses/my");

export const getHouseById = (id) =>
  API.get(`/houses/${id}`);

// ==========================
// WISHLIST
// ==========================
export const toggleWishlist = (
  id
) =>
  API.post(
    `/wishlist/toggle/${id}`
  );

export const getWishlist = () =>
  API.get("/wishlist");

export default API;