import companyRepository from "../repositories/companyRepository";

class CompanyService {
  getCompanies({ setRows, setAllCompanies, setSnackbarProps }) {
    companyRepository
      .getCompanies()
      .then((response) => {
        setAllCompanies(response.data);

        console.log(response.data);
        setRows(
          response.data.map((company) => ({
            id: company.companyId,
            name: company.companyName,
            country: company.country,
            account: company.checkingAccount,
            email: company.companyEmail,
            type: company.tradeType.tradeTypeName,
          }))
        );
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message || error.message,
        });
      });
  }

  updateCompany({ updatedCompany, setSnackbarProps, setRows }) {
    companyRepository
      .updateCompany({
        companyId: updatedCompany.id,
        companyName: updatedCompany.name,
        country: updatedCompany.country,
        checkingAccount: updatedCompany.account,
        companyEmail: updatedCompany.email,
        tradeType: {
          tradeTypeName: updatedCompany.type,
        },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные о компании ${response.data.companyName} успешно изменены!`,
        });
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message || error.message,
        });

        this.getCompanies(setRows);
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  addCompany({ newCompany, setSnackbarProps, setRows }) {
    companyRepository
      .addCompany({
        companyName: newCompany.name,
        country: newCompany.country,
        checkingAccount: newCompany.account,
        companyEmail: newCompany.email,
        tradeType: {
          tradeTypeName: newCompany.type,
        },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Компания-партнер "${response.data.companyName}" успешно добавлена!`,
        });
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message || error.message,
        });

        this.getCompanies(setRows);
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  deleteCompany({ id, setSnackbarProps, setRows }) {
    companyRepository
      .deleteCompany(id)
      .then((response) => {
        console.log("После удаления: ", response);
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные о компании "${response.data.companyName}" успешно удалены!`,
        });
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message || error.message,
        });

        this.getCompanies(setRows);
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }
}

export default new CompanyService();
