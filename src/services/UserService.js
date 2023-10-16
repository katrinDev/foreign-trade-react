import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

class UserService {
  async getUsers({ setRows, setAllUsers, setSnackbarProps }) {
    try {
      const { data: allUsers } = await axios.get(API_URL);

      setAllUsers(allUsers);

      setRows(
        allUsers.map((user) => ({
          id: user.userId,
          username: user.username,
          role: user.role?.roleName,
          fullName: `${user.person.name} ${user.person.patronymic} ${user.person.surname}`,
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

  async updateUser({ user, setSnackbarProps }) {
    try {
      const { data: updatedUser } = await axios.put(API_URL, user);

      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Роль пользователя ${updatedUser.username} успешно изменена!`,
      });
    } catch (error) {
      console.log(error);

      const serverAnswer = error.response?.data.message || error.message;

      setSnackbarProps({
        open: true,
        severity: "error",
        message: serverAnswer,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }

  async deleteUser({ id, setSnackbarProps }) {
    try {
      const { data: deletedUser } = axios.delete(API_URL + `/${id}`);

      setSnackbarProps({
        open: true,
        severity: "success",
        message: `Аккаунт пользователя ${deletedUser.username} успешно удален!`,
      });
    } catch (error) {
      const serverAnswer = error.response?.data.message;

      setSnackbarProps({
        open: true,
        severity: "error",
        message: serverAnswer,
      });
    } finally {
      setSnackbarProps({ open: false, severity: "error", message: "" });
    }
  }
}

export default new UserService();
