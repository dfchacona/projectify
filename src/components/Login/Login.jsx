import React, { useEffect, useState } from 'react';

import { AUTH_TOKEN_KEY, CURRENT_WEEK_KEY } from '../../consts';

import loginService from '../../services/AuthService';
import getCurrentWeek from '../../services/Utils';

import ProjectifyImage from '../../assets/logo.png'

import './Login.css';

export default function Login() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(AUTH_TOKEN_KEY)) {
      window.location.href = "/dashboard";
    }
  });

  const handleSubmit = async e => {
    setError(false);
    e.preventDefault();
    await loginService(email, password)
      .then((loginResponseData) => {
        window.sessionStorage.setItem(AUTH_TOKEN_KEY, loginResponseData.data.token);
        window.sessionStorage.setItem(CURRENT_WEEK_KEY, getCurrentWeek());
        window.location.href = "/dashboard";
      })
      .catch(() => {
        setError(true);
      });
  }

  return(
    <div>
      <div className="login-wrapper">
        <div className="login-image">
          <img src={ProjectifyImage} alt="Projectify" />
        </div>
        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <label>
              <p>EMAIL</p>
              <input name="email" type="text" onChange={(event) => setEmail(event.target.value)}/>
            </label>
            <label>
              <p>PASSWORD</p>
              <input name="password" type="password" onChange={(event) => setPassword(event.target.value)}/>
            </label>
            <div className="login-button">
              <button type="submit">LOG IN</button>
            </div>
          </form>
        </div>
        {error &&
          <div className="login-error">
            <p>Invalid credentials</p>
          </div>
        }
      </div>
    </div>
  );
}