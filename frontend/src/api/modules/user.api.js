import axios from "axios";
import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const userEndpoints = {
  signin: "user/signin",
  signup: "user/signup",
  getInfo: "user/info",
  passwordUpdate: "user/update-password"
};

const googleLogin = async (token) => {
  try {
    const res = await axios.post(
      (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api") + "/auth/google-login",
      { token },
      { withCredentials: true }
    );
    return { response: res.data };
  } catch (err) {
    return { err };
  }
};

const userApi = {
  signin: async ({ username, password }) => {
    try {
      const response = await publicClient.post(
        userEndpoints.signin,
        { username, password }
      );
      return { response };
    } catch (err) { return { err }; }
  },
  signup: async ({ username, password, confirmPassword, displayName }) => {
    try {
      const response = await publicClient.post(
        userEndpoints.signup,
        { username, password, confirmPassword, displayName }
      );
      return { response };
    } catch (err) { return { err }; }
  },
  getInfo: async () => {
    try {
      const response = await privateClient.get(userEndpoints.getInfo);
      return { response };
    } catch (err) { return { err }; }
  },
  passwordUpdate: async ({ password, newPassword, confirmNewPassword }) => {
    try {
      const response = await privateClient.put(
        userEndpoints.passwordUpdate,
        { password, newPassword, confirmNewPassword }
      );
      return { response };
    } catch (err) { return { err }; }
  },
  googleLogin,
};

export default userApi;
