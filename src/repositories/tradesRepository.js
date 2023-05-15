import axios from "axios";

const API_URL = "http://localhost:8080/api/trades";

class TradesRepository {
  getTrades() {
    return axios.get(API_URL);
  }

  getMyTrades(id) {
    return axios.get(API_URL + `/${id}`);
  }

  addTrade(trade, id) {
    return axios.post(API_URL + `/${id}`, trade);
  }

  deleteTrade(id) {
    return axios.delete(API_URL + `/${id}`);
  }
}

export default new TradesRepository();
