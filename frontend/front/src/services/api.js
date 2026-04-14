import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Houses
export const getApprovedHouses = () => API.get("/houses/approved");
export const getPendingHouses = () => API.get("/houses/pending");
export const approveHouse = (id) => API.put(`/houses/approve/${id}`);
export const deleteHouse = (id) => API.delete(`/houses/delete/${id}`);
export const getMyHouses = () => API.get("/houses/my");
export const getHouseById = (id) => API.get(`/houses/${id}`);

// Wishlist
export const toggleWishlist = (id) => API.post(`/wishlist/toggle/${id}`);
export const getWishlist = () => API.get("/wishlist");

export default API;