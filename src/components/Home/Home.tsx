import React, {useEffect, useState} from 'react';
import './styles.scss';
import { searchEvent } from '../../api/event';
import { logInAPI, signUpAPI } from '../../api/session';

const Home = () => {

  const [inputValue, setInputValue] = useState('');
  const [password , setPassword] = useState('');
  const [logIn, setLogIn] = useState(false);
  const [signUp, setSignUp] = useState(false);

  return (
    <section className="home">
      <form id='form-wrap' className="home__wrap" onSubmit={async (event) => {
        event.preventDefault();
        if (!logIn) {
          const response: any = await searchEvent(inputValue);
          switch (response.status) {
            case 404:
              console.log('Event does not exist');
              break;

              case 200:
              console.log(response.data);
              break;

              case 401:
              setLogIn(true);
              setInputValue('');
              break;

            default:
              console.error('Error in event get')
              break;
          }
        };
      }}>
        <input value={inputValue} type="text" name="input" id="input" className='home__wrap__input' onChange={(event) => {
          setInputValue(event.target.value);
        }} />
        { logIn && <input value={password} type="password" name="input" id="password" className='home__wrap__input' onChange={(event) => {
          setPassword(event.target.value);
        }} onKeyDown={async (event) => {
          if (event.key === 'Enter') {
            const response: any = await logInAPI(inputValue, password);
            switch (response) {
              case 202:
                setLogIn(false);
                setInputValue('');
                setPassword('');
                break;
              case 404:
                console.log('User does not exist');
                setSignUp(true);
                break;
              case 406:
                console.log('Wrong password');
                break;
              default:
                console.error('Error in log in');
                break;
            };
          };
        }} /> }
        {signUp && <button type="submit" className='home__wrap__submit' onClick={async () => {
          console.log('Sign up');
          const response: any = await signUpAPI(inputValue, password);
          if (response.status === 201) {
            await logInAPI(inputValue, password);
            setSignUp(false);
            setLogIn(false);
            setInputValue('');
            setPassword('');
          } else {
            console.log('Error in sign up');
          };
        }}>Sign Up</button>}
      </form>
    </section>
  );
};

export default Home;
