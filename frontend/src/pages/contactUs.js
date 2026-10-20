import React from "react";
import { Typography, Box } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import LoadingOverlay from "../components/dialog/loadingOverlay";

const ContactUs = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingOverlay text="Loading..." color="success" />;
  }

  return (
    <Box
      padding={5}
      display={"flex"}
      flexDirection="column"
      height="90vh"
      justifyContent="center"
      sx={{
        "& .MuiTypography-root": {
          color: "text.third",
        },
      }}
    >
      <Typography variant="h2" mt={2} textAlign="center">
        Contact Us!
      </Typography>
      <Typography variant="h5" mt={2} textAlign="center" marginBottom={4}>
        Here is your direct line to Lovis and Jason, the creators of Coverd.
      </Typography>
      <Typography variant="h5" mt={2} textAlign="center" marginBottom={4}>
        You can reach us on Discord, Telegram and via email.
      </Typography>
      <Typography variant="h5" mt={2} textAlign="center" marginBottom={4}>
        lovis@coverd.io <br />
        jason@coverd.io
      </Typography>
      <Typography variant="h5" mt={2} textAlign="center" marginBottom={4}>
        We are happy to hear from you because your investment success is
        important to us!
      </Typography>
    </Box>
  );
};

export default ContactUs;
