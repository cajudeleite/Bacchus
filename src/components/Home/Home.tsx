import React, {useEffect, useState} from 'react';
import './styles.scss';
import { searchParty } from '../../api/party';
import { logInAPI } from '../../api/session';

const Home = () => {

  const [inputValue, setInputValue] = useState('');
  const [password , setPassword] = useState('');
  const [logIn, setLogIn] = useState(false);

  const formWrap: any = document.getElementById('form-wrap');

  return (
    <section className="home">
      <form id='form-wrap' className="home__wrap" onSubmit={async (event) => {
        event.preventDefault();
        if (!logIn) {
          const response: any = await searchParty(inputValue, setLogIn, setInputValue);
          switch (response.status) {
            case 404:
              console.log('Party does not exist');
              break;

              case 200:
              console.log(response.data);
              break;

              case 401:
              setLogIn(true);
              setInputValue('');
              break;

            default:
              console.error('Error in party get')
              break;
          }
        };
      }}>
        <input value={inputValue} type="text" name="input" id="text" className='home__wrap__input' onChange={(event) => {
          setInputValue(event.target.value);
        }} />
        { logIn && <input value={password} type="password" name="input" id="text" className='home__wrap__input' onChange={(event) => {
          setPassword(event.target.value);
        }} onKeyDown={(event) => {
          if (event.key === 'Enter') {
            logInAPI(inputValue, password);
            setLogIn(false);
            setInputValue('');
            setPassword('');
          };
        }} /> }
      </form>
    </section>
  );
};

export default Home;
