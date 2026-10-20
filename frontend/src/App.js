import "./App.css";
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Container, useMediaQuery } from "@mui/material";

// import Register from "./pages/register";
import DrawerAppBar from "./components/layout/navbar";
import Expiration from "./pages/expiration";
import Footer from "./components/layout/footer";
import PrivateRoute from "./components/routes/privateRoute";
import ThemeProvider from "./theme/ThemeProvider";
import Scrollbars from "react-custom-scrollbars-2";
import About from "./pages/about";
import Stripe from "./pages/stripe";
import Shortlist from "./pages/shortlist";
import OptionsScreener from "./pages/optionsScreener";
import Community from "./pages/community";
import Education from "./pages/education";
import NotFound from "./pages/notFound";
import SymbolList from "./pages/symbolLists";
import ContactUs from "./pages/contactUs";
import CashSecuredPuts from "./pages/cashSecuredPuts";
import Admin from "./pages/admin";
import ProfitHorizon from "./pages/profitHorizon";
import LoadingOverlay from "./components/dialog/loadingOverlay";

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

  const Calculate = lazy(() => import("./pages/calculate"));

  return (
    <Router>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Scrollbars>
            <DrawerAppBar />
            <Container maxWidth="1536" style={containerStyle}>
              <Suspense fallback={<LoadingOverlay text="Loading..." />}>
                <Routes>
                  <Route
                    exact
                    path="/"
                    element={<Navigate to="/earn" />}
                  ></Route>
                  <Route
                    exact
                    path="/stripe"
                    element={<PrivateRoute component={Stripe} />}
                  ></Route>
                  {/* <Route exact path="/register" element={<Register />}></Route> */}
                  <Route exact path="/about" element={<About />}></Route>
                  <Route exact path="/earn" element={<Calculate />}></Route>
                  <Route
                    exact
                    path="/community"
                    element={<Community />}
                  ></Route>
                  <Route
                    exact
                    path="/education"
                    element={<Education />}
                  ></Route>
                  <Route
                    exact
                    path="/contactus"
                    element={<ContactUs />}
                  ></Route>
                  <Route exact path="/admin" element={<Admin />}></Route>
                  <Route
                    exact
                    path="/options_screener"
                    element={<OptionsScreener />}
                  ></Route>
                  <Route
                    exact
                    path="/cashSecuredPuts"
                    element={<CashSecuredPuts />}
                  ></Route>
                  <Route
                    exact
                    path="/profitHorizon"
                    element={<ProfitHorizon />}
                  ></Route>
                  <Route
                    exact
                    path="/shortlist"
                    element={<PrivateRoute component={Shortlist} />}
                  ></Route>
                  <Route
                    exact
                    path="/expiration"
                    element={<PrivateRoute component={Expiration} />}
                  ></Route>
                  <Route
                    exact
                    path="/symbolLists"
                    element={<PrivateRoute component={SymbolList} />}
                  ></Route>
                  <Route exact path="*" element={<NotFound />}></Route>
                </Routes>
              </Suspense>
            </Container>
            <Footer />
          </Scrollbars>
        </LocalizationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
