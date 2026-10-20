import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, useMediaQuery } from "@mui/material";

import Register from "./pages/register";
import DrawerAppBar from "./components/layout/navbar";
import Dashboard from "./pages/dashboard";
import Expiration from "./pages/expiration";
import Footer from "./components/layout/footer";
import PrivateRoute from "./components/routes/privateRoute";
import ThemeProvider from "./theme/ThemeProvider";
import Scrollbars from "react-custom-scrollbars-2";
import About from "./pages/about";
import Homepage from "./pages/homepage";
import Stripe from "./pages/stripe";
import Shortlist from "./pages/shortlist";
import Calculate from "./pages/calculate";
import OptionsScreener from "./pages/optionsScreener";
import Community from "./pages/community";
import Education from "./pages/education";
import NotFound from "./pages/notFound";
import SymbolList from "./pages/symbolLists";
import ContactUs from "./pages/contactUs";
import CashSecuredPuts from "./pages/cashSecuredPuts";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const containerStyle = isSmScreen
    ? {
        paddingLeft: 0,
        paddingRight: 0,
        width: `calc(100% - ${260}px)`,
        marginLeft: 260,
      }
    : {
        paddingLeft: 10,
        paddingRight: 10,
      };

  return (
    <Router>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Scrollbars>
            <DrawerAppBar />
            <Container maxWidth="1536" style={containerStyle}>
              <Routes>
                <Route exact path="/" element={<Homepage />}></Route>
                <Route
                  exact
                  path="/stripe"
                  element={<PrivateRoute component={Stripe} />}
                ></Route>
                <Route exact path="/register" element={<Register />}></Route>
                <Route exact path="/about" element={<About />}></Route>
                <Route
                  exact
                  path="/contactus"
                  element={<PrivateRoute component={ContactUs} />}
                ></Route>
                <Route
                  exact
                  path="/dashboard"
                  element={<PrivateRoute component={Dashboard} />}
                ></Route>
                <Route
                  exact
                  path="/shortlist"
                  element={<PrivateRoute component={Shortlist} />}
                ></Route>
                <Route
                  exact
                  path="/earn"
                  element={<PrivateRoute component={Calculate} />}
                ></Route>
                <Route
                  exact
                  path="/expiration"
                  element={<PrivateRoute component={Expiration} />}
                ></Route>
                <Route
                  exact
                  path="/options_screener"
                  element={<PrivateRoute component={OptionsScreener} />}
                ></Route>
                <Route
                  exact
                  path="/education"
                  element={<PrivateRoute component={Education} />}
                ></Route>
                <Route
                  exact
                  path="/community"
                  element={<PrivateRoute component={Community} />}
                ></Route>
                <Route
                  exact
                  path="/symbolLists"
                  element={<PrivateRoute component={SymbolList} />}
                ></Route>
                <Route
                  exact
                  path="/cashSecuredPuts"
                  element={<PrivateRoute component={CashSecuredPuts} />}
                />
                <Route exact path="*" element={<NotFound />}></Route>
              </Routes>
            </Container>
            <Footer />
          </Scrollbars>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
