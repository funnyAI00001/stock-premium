import React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import { InputLabel, Input, Button, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

import ExpirationTable from "../components/stock/expirationTable";

import { uploadExpirations } from "../actions/stockAction";

const Expiration = ({ uploadExpirations }) => {
  const fileInputRef = useRef(null);
  const theme = useTheme();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("expirations", file);

    uploadExpirations(formData);
  };

  return (
    <div>
      <Typography variant="h3" color="initial" textAlign="center" mt={2}>
        Expiration Dates
      </Typography>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Button
          sx={{
            margin: "auto",
            marginY: 2,
            background: `${theme.palette.text.third}`,
            border: `${theme.palette.text.third} solid 1px`,
            color: "white",
          }}
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          Upload
        </Button>
      </div>
      <ExpirationTable />

      <InputLabel htmlFor="file-input">
        <Input
          id="file-input"
          type="file"
          sx={{ display: "none" }}
          onChange={(e) => handleFileUpload(e)}
          ref={fileInputRef}
        />
      </InputLabel>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  uploadExpirations: (data) => dispatch(uploadExpirations(data)),
});

export default connect(null, mapDispatchToProps)(Expiration);
