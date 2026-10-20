import React, { useState, useRef } from "react";
import { InputLabel, Input, Typography, Button } from "@mui/material";

import { useDispatch } from "react-redux";
import { uploadSymbolLists } from "../actions/stockAction";

import SymbolListTable from "../components/stock/symbolListsTable";
import LoadingOverlay from "../components/dialog/loadingOverlay";

const SymbolList = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("symbolFile", file);

    setIsUploading(true);
    dispatch(uploadSymbolLists(formData, setIsUploading(false)));
  };

  return (
    <div>
      <Typography variant="h3" color="initial" textAlign="center" mt={2}>
        Symbol Lists
      </Typography>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "text.third",
            color: "white",
            "&:hover": {
              backgroundColor: "text.third",
              borderColor: "white",
            },
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
      <SymbolListTable />

      <InputLabel htmlFor="file-input">
        <Input
          id="file-input"
          type="file"
          sx={{ display: "none" }}
          onChange={(e) => handleFileUpload(e)}
          ref={fileInputRef}
        />
      </InputLabel>

      {isUploading && <LoadingOverlay color="success" text="Uploading..." />}
    </div>
  );
};

export default SymbolList;
