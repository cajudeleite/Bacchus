import axios from "axios";

const server = axios.create({
  baseURL: "https://medusaink.herokuapp.com",
  // baseURL: "http://localhost:3000",
});

export const logInAPI = async (login: string, password: string) => {
  try {
    const { headers, status } = await server.post(`/users/sign_in`, { user: { login, password } });
    localStorage.setItem("token", headers.authorization);
    return { status };
  } catch (error: any) {
    return error.response;
  }
};

export const signUpAPI = async (user: { username: string; email: string; password: string }) => {
  try {
    const { status } = await server.post(`/users`, { user: user });
    return { status };
  } catch (error: any) {
    return error.response;
  }
};
