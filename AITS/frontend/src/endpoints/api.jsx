import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/"; // Django backend

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (StudentRegNumber, Password) => {
  try {
    const response = await apiClient.post("token/", {
      StudentRegNumber,
      Password,
    });
    return response.data; // Returns access & refresh tokens
  } catch (error) {
    console.error("Login Error:", error.response?.data);
    throw error;
  }
};

export const fetchIssues = async (token) => {
  try {
    const response = await apiClient.get("issues/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Fetch Issues Error:", error.response?.data);
    throw error;
  }
};
