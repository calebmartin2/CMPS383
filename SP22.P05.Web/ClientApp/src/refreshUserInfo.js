import axios from "axios";
export function refreshUserInfo() {
      // this is nonsense, but we're stuck with it
    var _ = require('lodash');
    axios.get('/api/authentication/me', {
    })
      .then(function (response) {
        if (!_.isEqual(JSON.parse(localStorage.getItem('user')), response.data)) {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(response.data))
          console.error("User data different, refreshing.")
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        if (localStorage.getItem('user')) {
          window.location.reload(false);
        }
        localStorage.removeItem('user');
        console.log(error);
      });
  }