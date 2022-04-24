import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:3000',
});

export const searchParty = async (name: string, setLogIn: Function) => {
  try {
    const { data } = await server.post(`/parties/find_party`, { name });
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    setLogIn(true);
  };
};
