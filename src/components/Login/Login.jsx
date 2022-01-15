import React, { useEffect, useState } from 'react';

import loginService from '../../services/AuthService';
import getCurrentWeek from '../../services/Utils';

import ProjectifyImage from '../../assets/logo.png'

export default function Login() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (window.sessionStorage.getItem("auth_token")) {
      window.location.href = "/dashboard";
    }
  });

  const handleSubmit = async e => {
    e.preventDefault();
    await loginService(email, password)
    .then((loginResponseData) => {
      window.sessionStorage.setItem("auth_token", loginResponseData.data.token);
      window.sessionStorage.setItem("current_week", getCurrentWeek());
      window.location.href = "/dashboard";
    })
    .catch(() => {
      console.log("ERROR!")
    })
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
            <p>Username</p>
            <input name="email" type="text" onChange={(event) => setEmail(event.target.value)}/>
          </label>
          <label>
            <p>Password</p>
            <input name="password" type="password" onChange={(event) => setPassword(event.target.value)}/>
          </label>
          <div>
            <button type="submit">Submit</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}