 import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import validator from "validator";
import AuthService from "../services/authService";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function SignUp() {
  const [regData, setRegData] = useState({
    login: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    loginErr: "",
    emailErr: "",
    passwordErr: "",
  });
  const [snackbarProps, setSnackbarProps] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  let serverAnswer = "";

  const onBlurLogin = () => {
    const login = regData.login;

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
    const password = regData.password1;

    if (!password || password.length < 5) {
      setValidationErrors({
        ...validationErrors,
        passwordErr: "Пароль менее 5 символов!",
      });
    } else if (password !== regData.password2) {
      setValidationErrors({
        ...validationErrors,
        passwordErr: "Пароли не совпадают!",
      });
    } else {
      setValidationErrors({ ...validationErrors, passwordErr: "" });
    }
  };

  const onBlurEmail = () => {
    const email = regData.email;

    if (!validator.isEmail(email)) {
      setValidationErrors({
        ...validationErrors,
        emailErr: "Некорректный email!",
      });
    } else {
      setValidationErrors({ ...validationErrors, emailErr: "" });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarProps({ ...snackbarProps, open: false });
  };

  const signUpSubmit = (event) => {
    event.preventDefault();

    if (
      !validationErrors.loginErr &&
      !validationErrors.passwordErr &&
      !validationErrors.emailErr
    ) {
      AuthService.register(regData.login, regData.email, regData.password1)
        .then((res) => {
          serverAnswer = res.data?.message;

          setSnackbarProps({ ...snackbarProps, severity: "success" });
        })
        .catch((error) => {
          serverAnswer = error.response?.data?.message;

          setSnackbarProps({ ...snackbarProps, severity: "error" });
        })
        .finally(() => {
          setSnackbarProps({
            ...snackbarProps,
            open: true,
            message: serverAnswer,
          });

          console.log(serverAnswer);
        });
    } else {
      setSnackbarProps({
        open: true,
        severity: "error",
        message: "Некорректный ввод данных!",
      });
    }

    setSnackbarProps({ open: false, severity: "error", message: "" });
    setValidationErrors({ loginErr: "", emailErr: "", passwordErr: "" });
    setRegData({ login: "", email: "", password1: "", password2: "" });
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
            Регистрация
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={signUpSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Введите логин"
                  autoFocus
                  value={regData.login}
                  onChange={(e) =>
                    setRegData({ ...regData, login: e.target.value })
                  }
                  onBlur={onBlurLogin}
                  error={validationErrors.loginErr !== ""}
                  helperText={validationErrors.loginErr}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Введите email"
                  name="email"
                  autoComplete="email"
                  value={regData.email}
                  onChange={(e) =>
                    setRegData({ ...regData, email: e.target.value })
                  }
                  onBlur={onBlurEmail}
                  error={validationErrors.emailErr !== ""}
                  helperText={validationErrors.emailErr}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password-1"
                  label="Введите пароль"
                  type="password"
                  id="password-1"
                  autoComplete="password-1"
                  value={regData.password1}
                  onChange={(e) =>
                    setRegData({ ...regData, password1: e.target.value })
                  }
                  onBlur={onBlurPassword}
                  error={validationErrors.passwordErr !== ""}
                  helperText={validationErrors.passwordErr}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password-2"
                  label="Подтвердите пароль"
                  type="password"
                  id="password-2"
                  autoComplete="password-2"
                  value={regData.password2}
                  onChange={(e) =>
                    setRegData({ ...regData, password2: e.target.value })
                  }
                  error={validationErrors.passwordErr !== ""}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Подтвердить
            </Button>

            <Link
              href="/sign-in"
              variant="body2"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Уже есть аккаунт? Войти
            </Link>

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
        </Box>
      </Container>
    </ThemeProvider>
  );
}
