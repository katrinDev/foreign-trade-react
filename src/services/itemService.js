import itemRepository from "../repositories/itemRepository";

const API_URL = "http://localhost:8080/api/items";

class ItemService {
  async getItems({ setRows, setAllItems, setSnackbarProps }) {
    try {
      const { data: allItems } = await axios.get(API_URL);
      setAllItems(allItems);

      console.log(response.data);
      setRows(
        response.data.map((item) => ({
          id: item.itemId,
          name: item.itemName,
          cost: item.itemCost,
          type: item.tradeType.tradeTypeName,
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

  async updateItem({ updatedItem, setSnackbarProps }) {
    try {
      const { data: item } = await axios.put(API_URL, {
        itemId: updatedItem.id,
        itemName: updatedItem.name,
        itemCost: updatedItem.cost,
        tradeType: {
          tradeTypeName: updatedItem.type,
        },
      });
      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Данные товара ${item.itemName} успешно изменены!`,
      });
    } catch (error) {
      console.log(error);

      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }

  async addItem({ newItem, setSnackbarProps, setRows }) {
    try {
      const { data: item } = await axios.post(API_URL, {
        itemName: newItem.name,
        itemCost: newItem.cost,
        tradeType: {
          tradeTypeName: newItem.type,
        },
      });

      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Товар ${item.itemName} успешно добавлен!`,
      });
    } catch (error) {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }

  async deleteItem({ id, setSnackbarProps }) {
    try {
      const { data: item } = await axios.delete(API_URL + `/${id}`);
      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Данные о товаре ${item.itemName} успешно удалены!`,
      });
    } catch (error) {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: error.response?.data.message,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }
}

export default new ItemService();
