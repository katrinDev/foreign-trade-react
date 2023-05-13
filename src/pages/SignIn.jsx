import React, { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthService from "../services/authService";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";

const theme = createTheme();

export default function SignIn() {
  const { setIsAuth, setIsAdmin } = useContext(AuthContext);
  const [authData, setAuthData] = useState({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "error",
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    loginErr: "",
    passwordErr: "",
  });

  let serverAnswer = "";
  const navigate = useNavigate();

  const onBlurLogin = () => {
    const login = authData.login;

    if (!login || login.length < 5) {
      setValidationErrors({
        ...validationErrors,
        loginErr: "Логин менее 5 символов!",
      });
    } else {
      setValidationErrors({ ...validationErrors, loginErr: "" });
    }
  };

  const onBlurPassword = () => {
    const password = authData.password;

    if (!password || password.length < 5) {
      setValidationErrors({
        ...validationErrors,
        passwordErr: "Пароль менее 5 символов!",
      });
    } else {
      setValidationErrors({ ...validationErrors, passwordErr: "" });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({ ...snackbarProps, open: false });
  };

  const signInSubmit = (event) => {
    event.preventDefault();

    setLoading(true);

    if (!validationErrors.loginErr && !validationErrors.passwordErr) {
      AuthService.login(authData.login, authData.password)
        .then((response) => {

          const currentUser = response.data;
          localStorage.setItem("user", JSON.stringify(currentUser));

          setIsAuth(true);
          if (currentUser.role?.roleId === 1) {
            setIsAdmin(true);
          }

          setSnackbarProps({
            open: true,
            severity: "success",
            message: `Хорошего Вам дня, ${currentUser.person?.name} ${currentUser.person?.patronymic}!`,
          });

          navigate("/about");
        })
        .catch((error) => {
          serverAnswer = error.response?.data.message;

          if(!serverAnswer){
            serverAnswer = "Ошибка соединения с сервером!"
          }
          setSnackbarProps({
            open: true,
            severity: "error",
            message: serverAnswer,
          });
      });
    } else {
      setSnackbarProps({ open: true, severity: 'error', message: 'Некорректный ввод данных!' });
    }

    setLoading(false);

    setSnackbarProps({ open: false, severity: "error", message: "" });
    setValidationErrors({ loginErr: "", passwordErr: "" });
    setAuthData({ login: "", password: "" });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Аутентификация
          </Typography>

          <Box component="form" onSubmit={signInSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login"
              label="Введите логин"
              autoComplete="login"
              value={authData.login}
              onChange={(e) =>
                setAuthData({ ...authData, login: e.target.value })
              }
              onBlur={onBlurLogin}
              error={validationErrors.loginErr !== ""}
              helperText={validationErrors.loginErr}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Введите пароль"
              type="password"
              id="password"
              autoComplete="password"
              value={authData.password}
              onChange={(e) =>
                setAuthData({ ...authData, password: e.target.value })
              }
              onBlur={onBlurPassword}
              error={validationErrors.passwordErr !== ""}
              helperText={validationErrors.passwordErr}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              Войти
            </Button>

            <Link
              href="/sign-up"
              variant="body2"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {"Ещё нет аккаунта? Зарегистрироваться"}
            </Link>
          </Box>

          {
            <Snackbar
              open={snackbarProps.open}
              autoHideDuration={6000}
              onClose={handleClose}
            >
              <Alert
                onClose={handleClose}
                severity={snackbarProps.severity}
                sx={{ width: "100%" }}
              >
                {snackbarProps.message}
              </Alert>
            </Snackbar>
          }
        </Box>
      </Container>
    </ThemeProvider>
  );
}

