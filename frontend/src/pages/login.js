import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  TextField,
  Button,
  Typography,
  FormHelperText,
  Avatar,
  Grid,
  Box,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import { Divider } from "@mui/material";

import { loginUser } from "../actions/authActions";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © Call Option "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const Login = (props) => {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const credential = props.credential;
  const inputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  if (props.isAuthenticated) {
    window.location.href = "/shortlist";
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleLogin = () => {
    const user = {
      email,
      password,
    };

    props.LoginUser(user, history);
  };

  return (
    <Grid component="main">
      <CssBaseline />
      <Grid
        item
        xs={12}
        sm={8}
        md={3}
        margin="auto"
        maxWidth="500px"
        elevation={6}
        square
        component={Paper}
        borderRadius={1}
      >
        <Box
          sx={{
            mt: 15,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          <Avatar sx={{ m: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">Sign in</Typography>
          <form
            onSubmit={handleLogin}
            sx={{
              "& .MuiTextField-root .MuiInputBase-input": {
                m: 1,
                width: "25ch",
              },
            }}
          >
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              inputRef={inputRef}
              required
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 17,
                },
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              focused
              required
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 17,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormHelperText error>
              {" "}
              {credential && "* " + credential}
            </FormHelperText>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              onClick={handleLogin}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 1, mb: 2, fontSize: 20, py: 1 }}
            >
              Log in
            </Button>
            <Divider />
            <Typography
              variant="body1"
              color="white"
              textAlign="center"
              mt={2}
              mb={1}
            >
              Don't have an account? <Link to="/register">Sign Up</Link>
            </Typography>{" "}
          </form>
          <Copyright />
        </Box>
      </Grid>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  LoginUser: (user, history) => dispatch(loginUser(user, history)),
});

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  credential: state.auth.credential,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
