import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  CssBaseline,
  Paper,
  Box,
  Avatar,
  Typography,
  Divider,
  FormHelperText,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { IconButton, InputAdornment } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import StripeCheckout from "react-stripe-checkout";

import { useAuth0 } from "@auth0/auth0-react";

import { handleToken } from "../actions/stripeAction";
import { checkUser } from "../actions/authActions";

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

const Register = () => {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registerError = useSelector((state) => state.auth.registerError);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({});
  const theme = useTheme();
  const monthlyCost = 19;
  const isSmScreen = useMediaQuery("(min-width:600px)");

  // useEffect(() => {
  //   navigate("/register");
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
    };

    setUser(newUser);
    dispatch(checkUser(newUser));
  };

  const tokenHandler = (token) => {
    dispatch(handleToken(monthlyCost, token, navigate, user, onPaymentSuccess));
  };

  const onPaymentSuccess = () => {
    loginWithRedirect();
  };

  return (
    <Grid component="main" sx={isSmScreen ? { marginLeft: "-260px" } : {}}>
      <CssBaseline />
      <Typography variant="h1" color="text.third" m={2}>
        COVERD.io
      </Typography>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        margin="auto"
        maxWidth="500px"
        elevation={6}
        borderRadius={1}
      >
        <Box
          sx={{
            mt: 10,
            mx: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography
            variant="h5"
            color="text.third"
            marginBottom={4}
            textAlign="center"
            textTransform="uppercase"
          >
            Subscribe now to secure your life-time discount.
          </Typography>{" "}
          <ul style={{ fontSize: 18 }}>
            <li style={{ textDecoration: "line-through" }}>Monthly cost $47</li>
            <li>Only $19 per month, FOR LIFE</li>
            <li>Full access all feature we build in the future</li>
            <li>
              Price will increase with every new feature we release, but not for
              you, if you lock in your life-time price now
            </li>
          </ul>
          {/* <form
            onSubmit={handleSubmit}
            style={{
              padding: "16px 70px",
              border: "1px solid",
              borderRadius: 5,
              marginBottom: 20,
              borderColor: theme.palette.text.third,
            }}
          > */}
          {/* <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{
                marginTop: 2,
              }}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="email"
            />
            <TextField
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
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
              {registerError && "*" + registerError}
            </FormHelperText> */}
          {/* <Button
              type="submit"
              variant="outlined"
              fullWidth
              color="primary"
              sx={{ marginTop: 2, fontSize: 20, marginBottom: 2 }}
            >
              Register
            </Button> */}
          {/* {registerError === null && ( */}
          {/* <StripeCheckout
              stripeKey="pk_test_51OlQvLB0gv0feBVJ3Cu584iBuSegRgfX0EItlQa7ojixicP410l6hQHhkZMvkxayUd8BmNnafqccLHJifB5xYehC00zegezkrH"
              token={tokenHandler}
              label="Continue with Stripe"
              style={{ width: "100%" }}
              onClick={handleSubmit}
              image="/logo.png"
            /> */}
          {/* )} */}
          {/* <Divider /> */}
          {/* <Typography variant="body1" textAlign="center"> */}
          {/* <Typography variant="h5" color="white">
            {" "}
            Please register first!
          </Typography> */}
          <Box
            marginY={8}
            marginX={2}
            display="flex"
            justifyContent="center"
            width="100%"
            gap={3}
          >
            <Button
              variant="outlined"
              style={{
                float: "right",
                color: "white",
                background: theme.palette.text.third,
                border: "white",
              }}
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: { screen_hint: "signup" },
                })
              }
            >
              Sign Up
            </Button>

            {/* </Typography> */}
            {/* <Typography
              variant="body1"
              textAlign="center"
              my={2}
              color="text.third"
            >
              Already have an account? */}
            <Button
              variant="outlined"
              style={{
                float: "right",
                color: "white",
                borderColor: theme.palette.text.third,
              }}
              onClick={() => {
                loginWithRedirect();
              }}
            >
              Log In
            </Button>
          </Box>
          {/* <Link to="/login">Log In</Link> */}
          {/* </Typography> */}
          {/* </form> */}
          <Copyright />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Register;
