import React, { useEffect } from "react";

import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

const TempHeader = () => {
  const theme = useTheme();

  useEffect(() => {
    // Create a script element
    const script = document.createElement("script");

    // Set the script's attributes
    script.src = "https://cdn.sendfox.com/js/form.js";
    script.charset = "utf-8";

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup: remove the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ marginBottom: 30 }}>
      <fieldset
        style={{ borderColor: `${theme.palette.text.third}`, borderRadius: 5 }}
      >
        <Typography color="text.third" variant="h4">
          This feature is under development - if you find a bug please let us know!{" "}
        </Typography>
      </fieldset>
      {/* <Typography sx={{ marginY: 3 }}>
        Please join our waitlist to be notified when we release this feature!
      </Typography>
      <form
        method="post"
        action="https://sendfox.com/form/3lyw7l/1gy6xx"
        className="sendfox-form"
        id="1gy6xx"
        data-async="true"
        data-recaptcha="true"
      >
        <p>
          <label htmlFor="sendfox_form_name">First Name:</label>
          <input
            type="text"
            id="sendfox_form_name"
            placeholder="First Name"
            name="first_name"
            required
          />
        </p>
        <p>
          <label htmlFor="sendfox_form_email">Email:</label>
          <input
            type="email"
            id="sendfox_form_email"
            placeholder="Email"
            name="email"
            required
          />
        </p>
        <div style={{ position: "absolute", left: -5000 }} aria-hidden="true">
          <input
            type="text"
            name="a_password"
            tabIndex="-1"
            value=""
            autoComplete="off"
          />
        </div>
        <p>
          <button type="submit">Join Waitlist</button>
        </p>
      </form> */}
    </div>
  );
};

export default TempHeader;
