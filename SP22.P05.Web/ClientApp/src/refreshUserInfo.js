import axios from "axios";
import { isEqual } from "lodash";
export function refreshUserInfo() {
      // this is nonsense, but we're stuck with it
    axios.get('/api/authentication/me', {
    })
      .then(function (response) {
        if (!isEqual(JSON.parse(localStorage.getItem('user')), response.data)) {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(response.data))
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        if (localStorage.getItem('user')) {
          window.location.reload(false);
        }
        localStorage.removeItem('user');
      });
  }