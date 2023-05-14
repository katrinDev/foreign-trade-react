import axios from "axios";

const API_URL = "http://localhost:8080/api/companies";

class CompanyRepository {
  getCompanies() {
    return axios.get(API_URL);
  }

  addCompany(company) {
    return axios.post(API_URL, company);
  }

  updateCompany(company) {
    return axios.put(API_URL, company);
  }

  deleteCompany(id) {
    return axios.delete(API_URL + `/${id}`);
  }
}

export default new CompanyRepository();