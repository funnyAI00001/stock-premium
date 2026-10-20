import React from "react";
import { useRef } from "react";
import { connect } from "react-redux";
import { InputLabel, Input } from "@mui/material";

import ExpirationTable from "../components/stock/expirationTable";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { uploadExpirations } from "../actions/stockAction";

const Expiration = ({ uploadExpirations }) => {
  const fileInputRef = useRef(null);

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
          variant="outlined"
          color="primary"
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  uploadExpirations: (data) => dispatch(uploadExpirations(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Expiration);
