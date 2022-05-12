import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:3000',
});

export const logInAPI = async (email: string, password: string) => {
  try {
    const { headers } = await server.post(`/users/sign_in`, { user: { email, password } });
    localStorage.setItem('token', headers.authorization);
  } catch (error) {
    console.log(error);
  };
};
