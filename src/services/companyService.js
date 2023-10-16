import axios from "axios";

const API_URL = "http://localhost:8080/api/companies";

class CompanyService {
  async getCompanies({ setRows, setAllCompanies, setSnackbarProps }) {
    try {
      const { data: allCompanies } = await axios.get(API_URL);

      setAllCompanies(allCompanies);

      console.log(allCompanies);
      setRows(
        allCompanies.map((company) => ({
          id: company.companyId,
          name: company.companyName,
          country: company.country,
          account: company.checkingAccount,
          email: company.companyEmail,
          type: company.tradeType.tradeTypeName,
        }))
      );
    } catch (error) {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message || error.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }

  async updateCompany({ company, setSnackbarProps }) {
    try {
      const { data: updatedCompany } = await axios.put(API_URL, company);

      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Данные о компании ${updatedCompany.companyName} успешно изменены!`,
      });
    } catch (error) {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message || error.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }

  async addCompany({ newCompany, setSnackbarProps }) {
    try {
      const { data: company } = await axios.post(API_URL, newCompany);
      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Компания-партнер "${company.companyName}" успешно добавлена!`,
      });
    } catch (error) {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message || error.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }

  async deleteCompany({ id, setSnackbarProps }) {
    try {
      const { data: deletedCompany } = await axios.delete(API_URL + `/${id}`);

      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Данные о компании "${deletedCompany.companyName}" успешно удалены!`,
      });
    } catch (error) {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message || error.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }
}

export default new CompanyService();
