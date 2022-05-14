import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:3000',
});

export const logInAPI = async (email: string, password: string) => {
  try {
    const { headers } = await server.post(`/users/sign_in`, { user: { email, password } });
    localStorage.setItem('token', headers.authorization);
  } catch (error: any) {
    return (error.response)
  };
};

export const signUpAPI = async (email: string, password: string) => {
  try {
    const { data, status } = await server.post(`/users`, { user: { email, password } });
    console.log('data', data);
    console.log('status', status);
    return {status};
  } catch (error: any) {
    return (error.response);
  };
};
