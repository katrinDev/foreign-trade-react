import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

class UserService {
  getUsers() {
    return axios.get(API_URL);
  }

  updateUser(user) {
    return axios.put(API_URL, user);
  }

  deleteUser(id){
    return axios.delete(API_URL + `/${id}`);
  }
}

export default new UserService();
