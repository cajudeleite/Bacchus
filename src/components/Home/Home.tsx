import React, {useEffect, useState} from 'react';
import './styles.scss';
import { searchParty } from '../../api/party';

const Home = () => {

  const [inputValue, setInputValue] = useState('');
  const [password , setPassword] = useState('');
  const [logIn, setLogIn] = useState(false);

  return (
    <section className="home">
      <form className="home__wrap" onSubmit={(event) => {
        event.preventDefault();
        if (logIn) {
          console.log('log in');
        } else {
          searchParty(inputValue, setLogIn);
        };
      }}>
        <input value={inputValue} type="text" name="input" id="text" className='home__wrap__input' onChange={(event) => {
          setInputValue(event.target.value);
        }} />
        { logIn && <input value={password} type="password" name="input" id="text" className='home__wrap__input' onChange={(event) => {
          setPassword(event.target.value);
        }} /> }
      </form>
    </section>
  );
};

export default Home;
