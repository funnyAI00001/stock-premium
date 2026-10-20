import React, { useEffect } from "react";
import { Button, Typography, Box, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Helmet } from "react-helmet";

const Homepage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const isSmScreen = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/shortlist");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={isSmScreen ? { marginLeft: -260 } : {}}>
      <Helmet>
        <script>{`
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1316474689231501');
                fbq('track', 'PageView');
            `}</script>
        <noscript>
          {`<img
            height="1"
            width="1"
            style="display:none"
            src="https://www.facebook.com/tr?id=1316474689231501&ev=PageView&noscript=1"
          />`}
        </noscript>
      </Helmet>
      <Box
        display="flex"
        justifyContent="space-between"
        padding={isSmScreen ? 2 : 1}
      >
        <Typography variant={isSmScreen ? "h1" : "h2"} color="text.third">
          {/* COVERD.io */}
          <img src="/logo.png" style={{ width: isSmScreen ? "5vw" : "15vw" }} alt="logo" />
        </Typography>
        <div style={{ gap: 10, display: "flex" }}>
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
          <Button
            variant="outlined"
            style={{
              float: "right",
              color: "white",
              background: theme.palette.text.third,
              border: theme.palette.text.third,
            }}
            onClick={() =>
              loginWithRedirect({
                authorizationParams: { screen_hint: "signup" },
              })
            }
          >
            Sign Up
          </Button>
        </div>
      </Box>

      <Grid
        container
        spacing={0}
        sx={{ "& .MuiButton-root": { borderRadius: 0.5 } }}
      >
        <Grid item xs={1} md={3}></Grid>
        <Grid item xs={10} md={6}>
          <Box textAlign="center" marginTop={3}>
            <iframe
              src="https://www.veed.io/embed/f225cda8-d822-43bc-beeb-ae243072818d?watermark=0&color=&sharing=0&title=0"
              width={isSmScreen ? "504" : "100%"}
              height="504"
              frameborder="0"
              title="VSL coverd premium"
              webkitallowfullscreen
              mozallowfullscreen
              allowFullScreen
              autoPlay
            ></iframe>
          </Box>
          <Box
            display="flex"
            // alignItems="center"
            flexDirection="column"
            marginTop={10}
          >
            <Typography variant="h6" color="text.third" marginBottom={4}>
              ATTENTION INVESTORS:
            </Typography>
            <Typography
              variant="h6"
              // paddingX={5}
              // textAlign="center"
              sx={{
                color: "text.third",
              }}
            >
              Sell covered calls to make ~2% per Month EXTRA from stocks you
              already own, while reducing portfolio risk.
            </Typography>
            <ul style={{ color: "white", fontSize: 18 }}>
              <li>No day-trading, ever!</li>
              <li>Only takes a few minutes per week</li>
              <li>
                No wait - money in your trading account as soon as markets open
              </li>
              <li>Find profitable trades in record time</li>
              <li>Reduce overall portfolio risk</li>
            </ul>
            <Box display="flex" gap={6} paddingTop={6} margin="auto">
              <Button
                variant="outlined"
                style={{
                  float: "right",
                  color: "white",
                  borderColor: theme.palette.text.third,
                }}
                onClick={() => {
                  window.open("https://earn.coverd.io", "_blank");
                }}
              >
                Free Demo
              </Button>
              <Button
                variant="contained"
                style={{
                  float: "right",
                  color: "white",
                  background: theme.palette.text.third,
                  border: theme.palette.text.third,
                }}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{ "& .MuiButton-root": { borderRadius: 0.5 } }}
      >
        <Grid item xs={1} md={3}></Grid>
        <Grid item xs={10} md={6}>
          <Box display="flex" flexDirection="column" marginTop={6}>
            <Typography
              variant="h6"
              color="text.third"
              marginBottom={4}
              textTransform="uppercase"
            >
              LIFETIME DISCOUNT:
            </Typography>

            <ul style={{ fontSize: 18, color: "white" }}>
              <li>Pay Only $19 Per Month</li>
              <li>Full Access To All Current And Future Premium Features</li>
              <li>
                Receive More Value With Each Feature We Release At No Additional
                Cost
              </li>
              <li>
                We Will Increase The Subscription Cost With Each New Feature
                Until We Reach Our Target Price Of $47 Per Month
              </li>
            </ul>
            <Box display="flex" gap={6} paddingTop={2} margin="auto">
              <Button
                variant="contained"
                style={{
                  float: "right",
                  color: "white",
                  background: theme.palette.text.third,
                  border: theme.palette.text.third,
                }}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={0}
        sx={{ "& .MuiButton-root": { borderRadius: 0.5 } }}
      >
        <Grid item xs={1} md={3}></Grid>
        <Grid item xs={10} md={6}>
          <Box display="flex" flexDirection="column" marginTop={10}>
            <Typography
              variant="h6"
              color="text.third"
              marginBottom={4}
              textTransform="uppercase"
              textAlign="left"
            >
              "Double or Nothing" Profit Promise
            </Typography>

            <Typography variant="h6" color="white">
              If you don't double what COVERD costs you in trading profits in a
              given month, you'll get that month's subscription fee back. <p />
              --&gt; No questions asked – send an email - get your refund.
              {/* <span style={{ textDecoration: "line-through" }}>$47</span> $19
              monthly, and if you don't double that in trading profits by
              selling covered calls, your subscription is on us. */}
            </Typography>
            <Box display="flex" gap={6} paddingY={8} margin="auto">
              <Button
                variant="contained"
                style={{
                  float: "right",
                  color: "white",
                  background: theme.palette.text.third,
                  border: theme.palette.text.third,
                }}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Sign Up
              </Button>
            </Box>
            <Typography
              variant="h6"
              color="text.third"
              marginBottom={3}
              textTransform="uppercase"
              textAlign="left"
            >
              But wait, there's more!<br></br> FREE BONUSES - included in this
              offer :
            </Typography>
            <ul style={{ fontSize: 18, color: "white" }}>
              <li>
                Free Download Of The "Stock Market Profit Accelerator - Case
                Study PDF
              </li>
              <li>
                Invite To Monthly Zoom Calls With Live Q&A And Trading Insights
              </li>
              <li>Become A Founding Member Of The COVERD Online Community</li>
              <li>
                Exclusive Short List With 10 Stocks/ETFs That Pay 2% Or More Per
                Month In Premiums
              </li>
            </ul>
            {/* <Typography variant="h6" marginTop={5} style={{ width: "100%" }}>
              Here's the deal:<br></br> 1. Subscribe for{" "}
              <span style={{ textDecoration: "line-through" }}>$47</span> $19.
              <br></br> 2. Find profitable trades in record time.<br></br> 3.
              Don't make double your fee? Email us, and get your month back.
            </Typography>

            <Typography variant="h6" marginTop={4}>
              Simple. Effective. Risk-free. Your options trading journey starts
              and succeeds here. Let’s double down on your success together.
            </Typography> */}
            <Box display="flex" gap={6} paddingY={4} margin="auto">
              <Button
                variant="contained"
                style={{
                  float: "right",
                  color: "white",
                  background: theme.palette.text.third,
                  border: theme.palette.text.third,
                }}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: { screen_hint: "signup" },
                  })
                }
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Homepage;
