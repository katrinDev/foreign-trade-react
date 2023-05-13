import axios from "axios";

const API_URL = "http://localhost:8080/api/employees";

class EmployeeService {
  getEmployees() {
    return axios.get(API_URL);
  }

  addEmployee(employee) {
    console.log(employee);
    return axios.post(API_URL, employee);
  }

  updateEmployee(employee) {
    return axios.put(API_URL, employee);
  }

  deleteEmployee(id) {
    return axios.delete(API_URL + `/${id}`);
  }
}

export default new EmployeeService();
