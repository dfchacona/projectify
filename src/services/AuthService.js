import axios from 'axios';
import { API_URL } from '../consts';

export async function loginService(email, password) {
  return axios.post(API_URL+"api/v1/users/login", {
    email: email,
    password: password
  })
}

export  async function logoutService() {
  window.sessionStorage.clear();
  window.location.href = "/login";
}