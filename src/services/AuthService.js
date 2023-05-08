import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

    login (username, password) {

      return axios
        .post(API_URL + "sign-in", {
          username,
          password
        });
    }

    logout () {
      localStorage.removeItem("user");
    }

    register(username, workEmail, password) {
      return axios.post(API_URL + "sign-up", {
        username,
        password,
        workEmail
      });
    }

    getCurrentUser () {
      return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();