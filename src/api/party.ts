import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:3000',
});

export const searchParty = async (name: string) => {
  try {
    const headers: any =  {
      Authorization: localStorage.getItem('token')
    };

    console.log(headers);

    const { data, status } = await server.post(`/parties/find_party`, { name }, { headers });
    return {data, status};
  } catch (error: any) {
    console.log(error.response.status);
    return (error.response)
  };
};
