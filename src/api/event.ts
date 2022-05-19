import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:3000',
});

export const searchEvent = async (name: string) => {
  const headers: any =  {
    Authorization: localStorage.getItem('token')
  };
  try {
    const { data, status } = await server.post(`/events/find_event`, { name }, { headers });
    return {data, status};
  } catch (error: any) {
    console.log(error.response.status);
    return (error.response)
  };
};
