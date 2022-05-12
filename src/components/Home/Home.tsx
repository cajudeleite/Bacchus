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
      <form id='form-wrap' className="home__wrap" onSubmit={(event) => {
        event.preventDefault();
        if (logIn) {
          console.error('shouldnt be here');
        } else {
          searchParty(inputValue, setLogIn, setInputValue);
        };
      }}>
        <input value={inputValue} type="text" name="input" id="text" className='home__wrap__input' onChange={(event) => {
          setInputValue(event.target.value);
        }} />
        { logIn && <input value={password} type="password" name="input" id="text" className='home__wrap__input' onChange={(event) => {
          setPassword(event.target.value);
        }} onKeyDown={(event) => {
          if (event.key === 'Enter')
            logInAPI(inputValue, password);
        }} /> }
      </form>
    </section>
  );
};

export default Home;
