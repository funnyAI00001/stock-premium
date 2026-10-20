import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

import { Typography, Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector, useDispatch } from "react-redux";

import DataTable from "./dataTable";
import DataChart from "./dataChart";
import CustomAlert2 from "../customAlert2";

import { getMarketStatus, getExpirations } from "../../actions/stockAction";

import { usePDF } from "react-to-pdf";

const CoveredCallPremiumsAndReturnsOverTime = forwardRef((props, ref) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { toPDF, targetRef } = usePDF({
    filename: "charts_and_tables.pdf",
    options: {
      backgroundColor: "#0B1C2C", // Set to black or your desired background color
      html2canvas: {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable CORS for external resources
        backgroundColor: "#0B1C2C", // Match this with the backgroundColor above
      },
      jsPDF: {
        unit: "pt",
        format: "a4",
        orientation: "portrait",
      },
    },
  });

  const [selectedButton, setSelectedButton] = useState("ATM");
  const otm1Percentage = useSelector(
    (state) => state.profitHorizon.otm1Percentage
  );
  const otm2Percentage = useSelector(
    (state) => state.profitHorizon.otm2Percentage
  );
  const expiration_dates = useSelector(
    (state) => state.profitHorizon.expiration_dates
  );
  const indicesWithinTenDays = useSelector(
    (state) => state.profitHorizon.indicesWithinTenDays
  );
  const indicesWithNoData = useSelector(
    (state) => state.profitHorizon.indicesWithNoData
  );
  const symbols = useSelector((state) => state.profitHorizon.symbols);
  const sharePrice = useSelector((state) => state.profitHorizon.sharePrice);
  const strikeATMs = useSelector((state) => state.profitHorizon.strikeATMs);
  const strikeOTM5s = useSelector((state) => state.profitHorizon.strikeOTM5s);
  const strikeOTM10s = useSelector((state) => state.profitHorizon.strikeOTM10s);
  const ATMs = useSelector((state) => state.profitHorizon.ATMs);
  const OTM5s = useSelector((state) => state.profitHorizon.OTM5s);
  const OTM10s = useSelector((state) => state.profitHorizon.OTM10s);
  const ROIs = useSelector((state) => state.profitHorizon.ROIs);
  const OTM5ROIs = useSelector((state) => state.profitHorizon.OTM5ROIs);
  const OTM10ROIs = useSelector((state) => state.profitHorizon.OTM10ROIs);
  const annualROIs = useSelector((state) => state.profitHorizon.annualROIs);
  const OTM5annualROIs = useSelector(
    (state) => state.profitHorizon.OTM5annualROIs
  );
  const OTM10annualROIs = useSelector(
    (state) => state.profitHorizon.OTM10annualROIs
  );
  const marketStatus = useSelector((state) => state.stock.marketStatus);
  const [openWarningMarketClosed, setOpenWarningMarketClosed] = useState(false);

  useEffect(() => {
    if (marketStatus === "closed") {
      setOpenWarningMarketClosed(true);
    }
  }, [marketStatus]);

  useEffect(() => {
    dispatch(getExpirations());
    dispatch(getMarketStatus());
  }, [dispatch]);

  const handleButtonClick = (name) => {
    setSelectedButton(name);
  };

  const newSymbolRef = useRef(null);

  // This effect will trigger once the symbols array changes
  useEffect(() => {
    if (newSymbolRef.current) {
      setTimeout(() => {
        newSymbolRef.current.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    }
  }, [symbols]); // It will trigger when symbols are updated

  const generatePDF = () => {
    toPDF();
  };

  const handlePDFExport = () => {
    generatePDF();
  };

  useImperativeHandle(ref, () => ({
    handlePDFExport,
  }));

  return (
    <div>
      <Typography
        variant="h4"
        color="text.third"
        textAlign="center"
        mt={5}
        mb={4}
      >
        Covered Call Premiums and % Returns over Time
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        mx={2}
        my={2}
        sx={{
          "& .MuiButton-root": {
            backgroundColor: "transparent",
            color: "white",
            border: `1px solid ${theme.palette.text.third}`,
            paddingY: 0,
            paddingX: 2,
          },
          "& .selected": {
            backgroundColor: `${theme.palette.text.third} !important`,
          },
        }}
        gap={2}
      >
        <Button
          className={selectedButton === "ATM" ? "selected" : ""}
          onClick={() => handleButtonClick("ATM")}
        >
          ATM
        </Button>
        <Button
          className={
            selectedButton === otm1Percentage + "%OTM" ? "selected" : ""
          }
          onClick={() => handleButtonClick(otm1Percentage + "%OTM")}
        >
          {otm1Percentage}% <br /> OTM
        </Button>
        <Button
          className={
            selectedButton === otm2Percentage + "%OTM" ? "selected" : ""
          }
          onClick={() => handleButtonClick(otm2Percentage + "%OTM")}
        >
          {otm2Percentage}% <br /> OTM
        </Button>
      </Box>
      <Box display="flex" justifyContent="center">
        <CustomAlert2
          openState={openWarningMarketClosed}
          severity="warning"
          text="Options premium data may have errors outside of trading hours of major US exchanges. If you see $0 premium value, 
            try again once markets open. We are working with our data provider to resolve this issue."
          autoHideDuration={null}
          onClose={() => {
            setOpenWarningMarketClosed(false);
          }}
        />
      </Box>

      <div
        ref={targetRef}
        style={{ background: "#0B1C2C", paddingTop: 3, paddingBottom: 3 }}
      >
        {symbols.length > 0 &&
          symbols.map((symbol, index) => {
            const isLastSymbol = index === symbols.length - 1;

            return (
              <div
                key={index}
                ref={isLastSymbol ? newSymbolRef : null} // Attach ref to the last added symbol
              >
                <DataChart
                  symbol={symbol}
                  sharePrice={sharePrice[index]}
                  strikeATMs={strikeATMs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  strikeOTM5s={strikeOTM5s[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  strikeOTM10s={strikeOTM10s[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  ATMs={ATMs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  OTM5s={OTM5s[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  OTM10s={OTM10s[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  ROIs={ROIs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  OTM5ROIs={OTM5ROIs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  OTM10ROIs={OTM10ROIs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  annualROIs={annualROIs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  OTM5annualROIs={OTM5annualROIs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  OTM10annualROIs={OTM10annualROIs[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  expiration_dates={expiration_dates[index].filter(
                    (_, i) =>
                      !indicesWithinTenDays[index].includes(i) &&
                      !indicesWithNoData[index].includes(i)
                  )}
                  indicesWithinTenDays={indicesWithinTenDays[index]}
                  selectedButton={selectedButton}
                />
                <DataTable
                  sharePrice={sharePrice[index]}
                  strikeATMs={strikeATMs[index]}
                  strikeOTM5s={strikeOTM5s[index]}
                  strikeOTM10s={strikeOTM10s[index]}
                  ATMs={ATMs[index]}
                  OTM5s={OTM5s[index]}
                  OTM10s={OTM10s[index]}
                  ROIs={ROIs[index]}
                  OTM5ROIs={OTM5ROIs[index]}
                  OTM10ROIs={OTM10ROIs[index]}
                  annualROIs={annualROIs[index]}
                  OTM5annualROIs={OTM5annualROIs[index]}
                  OTM10annualROIs={OTM10annualROIs[index]}
                  expiration_dates={expiration_dates[index]}
                  indicesWithinTenDays={indicesWithinTenDays[index]}
                  indicesWithNoData={indicesWithNoData[index]}
                  selectedButton={selectedButton}
                  symbol={symbol}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default CoveredCallPremiumsAndReturnsOverTime;
