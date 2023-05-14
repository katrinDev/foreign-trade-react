import itemRepository from "../repositories/itemRepository";

class ItemService {
  getItems({setRows, setAllItems}) {
    itemRepository
      .getItems()
      .then((response) => {
        setAllItems(response.data);

        console.log(response.data);
        setRows(
          response.data.map((item) => ({
            id: item.itemId,
            name: item.itemName,
            cost: item.itemCost,
            type: item.tradeType.tradeTypeName,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateItem({ updatedItem, setSnackbarProps, setRows }) {

    itemRepository
      .updateItem({
        itemId: updatedItem.id,
        itemName: updatedItem.name,
        itemCost: updatedItem.cost,
        tradeType: {
          tradeTypeName: updatedItem.type,
        },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные товара ${response.data.itemName} успешно изменены!`,
        });
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message,
        });

        this.getItems(setRows);
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  addItem({ newItem, setSnackbarProps, setRows }) {
    itemRepository
      .addItem({
        itemName: newItem.name,
        itemCost: newItem.cost,
        tradeType: {
          tradeTypeName: newItem.type,
        },
      })
      .then((response) => {
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Товар ${response.data.itemName} успешно добавлен!`,
        });
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message,
        });

        this.getItems(setRows);
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }

  deleteItem({ id, setSnackbarProps, setRows}) {
    itemRepository
      .deleteItem(id)
      .then((response) => {
        console.log("После удаления: ", response);
        setSnackbarProps({
          open: true,
          severity: "success",
          message: `Данные о товаре ${response.data.itemName} успешно удалены!`,
        });
      })
      .catch((error) => {
        setSnackbarProps({
          open: true,
          severity: "error",
          message: error.response?.data.message,
        });

        this.getItems(setRows);
      });

    setSnackbarProps({ open: false, severity: "error", message: "" });
  }
}

export default new ItemService();
