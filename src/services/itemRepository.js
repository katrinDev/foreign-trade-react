import axios from "axios";

const API_URL = "http://localhost:8080/api/items";

class ItemRepository {
  getItems() {
    return axios.get(API_URL);
  }

  addItem(item) {
    return axios.post(API_URL, item);
  }

  updateItem(item) {
    return axios.put(API_URL, item);
  }

  deleteItem(id) {
    return axios.delete(API_URL + `/${id}`);
  }
}

export default new ItemRepository();