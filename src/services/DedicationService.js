import axios from 'axios';
import { API_URL } from '../consts';

export default async function getAllDedications() {
    return axios.get(API_URL+"api/v1/dedications", {
      headers: {
              "Authorization": window.sessionStorage.getItem("auth_token"),
        }
    })
  }

export async function editDedication(id, data) {
    return axios.patch(
        API_URL+"api/v1/dedications/"+id,
        data,
        {
            headers: {
                "Authorization": window.sessionStorage.getItem("auth_token"),
            }
        }
    )
}

export async function createDedication(data) {
    return axios.post(
        API_URL+"api/v1/dedications",
        data,
        {
            headers: {
                "Authorization": window.sessionStorage.getItem("auth_token"),
            }
        }
    )
}

export async function deleteDedication(id) {
    return axios.delete(
        API_URL+"api/v1/dedications/"+id,
        {
            headers: {
                "Authorization": window.sessionStorage.getItem("auth_token"),
            }
        }
    )
}