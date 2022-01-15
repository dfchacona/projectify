import axios from 'axios';
import { API_URL } from '../consts';

export default async function getAllProjects() {
  return axios.get(API_URL+"api/v1/projects", {
    headers: {
      "Authorization": window.sessionStorage.getItem("auth_token"),
    }
  })
}