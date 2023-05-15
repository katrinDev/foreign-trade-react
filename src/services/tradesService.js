import tradesRepository from "../repositories/tradesRepository";

class TradesService {
  getMyTrades({ setRows, setSnackbarProps, tradeType }) {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    tradesRepository
      .getMyTrades(currentUser.userId)
      .then((response) => {
        const allTrades = response.data;

        let typedTrades;

        typedTrades = allTrades.filter(
          (trade) => trade.tradeType.tradeTypeId === tradeType
        );

        setRows(
          typedTrades.map((trade) => ({
            id: trade.operationId,
            type: trade.tradeType.tradeTypeId,
            company: trade.company.companyName,
            fullCost: trade.fullCost,
            supplyDate: trade.supplyDate,
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

    addTrade({ newTrade, id, setSnackbarProps}) {
      tradesRepository
        .addTrade(newTrade, id)
        .then((response) => {
          setSnackbarProps({
            open: true,
            severity: "success",
            message: `Торговая операция успешно добавлена!`,
          });
        })
        .catch((error) => {
          setSnackbarProps({
            open: true,
            severity: "error",
            message: error.response?.data.message || error.message,
          });

          //this.getMyTrades({setRows, setSnackbarProps, tradeType});
        });

      setSnackbarProps({ open: false, severity: "error", message: "" });
    }

    deleteTrade({ id, setSnackbarProps, setRows, tradeType }) {
      tradesRepository
        .deleteTrade(id)
        .then((response) => {
          console.log("После удаления: ", response);

          setSnackbarProps({
            open: true,
            severity: "success",
            message: `Данные о сделке успешно удалены!`,
          });
        })
        .catch((error) => {
          setSnackbarProps({
            open: true,
            severity: "error",
            message: error.response?.data.message || error.message,
          });

          this.getMyTrades({setRows, setSnackbarProps, tradeType});
        });

      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
}

export default new TradesService();
