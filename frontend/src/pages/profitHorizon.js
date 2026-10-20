import React, { useRef } from "react";
import { Typography, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

import LoadingOverlay from "../components/dialog/loadingOverlay";
import OptionsProfitHorizon from "../components/profitHorizon/optionsProfitHorizon";
import OtherOption from "../components/profitHorizon/otherOption";
import TempHeader from "../components/profitHorizon/tempHeader";

import { useAuth0 } from "@auth0/auth0-react";

const ProfitHorizon = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const optionsProfitHorizonRef = useRef(null);

  const { isLoading } = useAuth0();
  const gotFirstResult = useSelector(
    (state) => state.profitHorizon.gotFirstResult
  );

  if (isLoading) {
    return <LoadingOverlay text="Loading..." color="success" />;
  }

  const onPdfExport = () => {
    if (optionsProfitHorizonRef.current) {
      optionsProfitHorizonRef.current.handlePDFExport();
    }
  }

  return (
    <div
      style={
        isSmScreen
          ? { padding: 50, paddingLeft: 150, paddingRight: 150, fontSize: 16 }
          : { padding: 2, marginTop: 10 }
      }
    >
      <TempHeader />
      <Typography variant="h4" color="white">
        Compare All Expiries Over Your Selected Time Horizon{" "}
      </Typography>
      <OptionsProfitHorizon ref={optionsProfitHorizonRef} />
      {gotFirstResult && <OtherOption onPdfExport={onPdfExport} />}
    </div>
  );
};

export default ProfitHorizon;
