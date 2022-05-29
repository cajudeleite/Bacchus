import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:3000",
});

export const logInAPI = async (email: string, password: string) => {
  try {
    const { headers, status } = await server.post(`/users/sign_in`, { user: { email, password } });
    localStorage.setItem("token", headers.authorization);
    return status;
  } catch (error: any) {
    return error.response.status;
  }
};

export const signUpAPI = async (email: string, password: string) => {
  try {
    const { status } = await server.post(`/users`, { user: { email, password } });
    return { status };
  } catch (error: any) {
    return error.response;
  }
};
