import React, { PureComponent, useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Typography, useMediaQuery, Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

class CustomizedLabel extends PureComponent {
  render() {
    const { x, y, stroke, value } = this.props;

    return (
      <text x={x} y={y} dy={-6} fill={stroke} fontSize={10} textAnchor="middle">
        {value + "%"}
      </text>
    );
  }
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          fontSize={12}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div style={{ backgroundColor: "white", border: "1px solid #ccc", padding: "10px" }}>
        <h4 style={{ color: "black" }}>{payload[0].payload.name}</h4>
        <p style={{ color: "red" }}>{`${payload[0].name}: ${payload[0].value}%`}</p>
        <p style={{ color: "red" }}>{`${payload[1].name}: ${payload[1].value}%`}</p>
      </div>
    );
  }
  return null;
};

const MyLineChart = ({ data, label1, label2 }) => {
  const isSmScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        margin: "auto",
      }}
    >
      <LineChart
        width={isSmScreen ? 500 : 300}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey={label1}
          stroke="red"
          label={<CustomizedLabel stroke="red" />}
        />
        <Line
          type="monotone"
          dataKey={label2}
          stroke="white"
          label={<CustomizedLabel stroke="white" />}
        />
      </LineChart>
    </div>
  );
};

const getDaysToExpirationDate = (expiration_date) => {
  let daysToExpirationDate = 1;
  const startDate = new Date(formatDate(expiration_date));
  const current = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(current.getTime() - startDate.getTime());

  // Convert the time difference from milliseconds to days
  daysToExpirationDate = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return daysToExpirationDate;
};

const formatDate = (inputDate) => {
  // Split the input date string by "/"
  const parts = inputDate.split("/");

  // Create a new Date object with the parsed parts
  const date = new Date(parts[2], parts[0] - 1, parts[1]);

  // Format the date to 'YYYY-MM-DD' format
  const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  return formattedDate;
};

const DataChart = ({
  symbol,
  sharePrice,
  strikeATMs,
  strikeOTM5s,
  strikeOTM10s,
  ATMs,
  OTM5s,
  OTM10s,
  ROIs,
  OTM5ROIs,
  OTM10ROIs,
  annualROIs,
  OTM5annualROIs,
  OTM10annualROIs,
  expiration_dates,
  selectedButton,
}) => {
  const theme = useTheme();
  const [selectedBtnText, setSelectedBtnText] = useState("ROI");
  const daysInFuture = useSelector((state) => state.profitHorizon.daysInFuture);
  const fieldsetStyle = {
    width: "60%",
    margin: "auto",
    borderColor: theme.palette.text.third,
    borderRadius: 5,
    marginTop: "3vh",
    paddingTop: 20,
    paddingBottom: 20,
  };
  const [chartData, setChartData] = useState([]);
  const [label1, setLabel1] = useState("ROI");
  const [label2, setLabel2] = useState("Annual. ROI");

  const [selectedStrikePrice, setselectedStrikePrice] = useState(strikeATMs);
  const [selectedPremiums, setselectedPremiums] = useState(ATMs);
  const [selectedROIs, setselectedROIs] = useState(ROIs);
  const [selectedAnnualROIs, setselectedAnnualROIs] = useState(annualROIs);

  const [maxReturns, setMaxReturns] = useState([]);
  const [maxRisks, setMaxRisks] = useState([]);
  const [maxRORs, setMaxRORs] = useState([]);
  const [annualMaxRORs, setAnnualMaxRORs] = useState([]);

  const [maxReturns1, setMaxReturns1] = useState([]);
  const [maxRisks1, setMaxRisks1] = useState([]);
  const [maxRORs1, setMaxRORs1] = useState([]);
  const [annualMaxRORs1, setAnnualMaxRORs1] = useState([]);

  const [maxReturns2, setMaxReturns2] = useState([]);
  const [maxRisks2, setMaxRisks2] = useState([]);
  const [maxRORs2, setMaxRORs2] = useState([]);
  const [annualMaxRORs2, setAnnualMaxRORs2] = useState([]);

  const [maxReturns3, setMaxReturns3] = useState([]);
  const [maxRisks3, setMaxRisks3] = useState([]);
  const [maxRORs3, setMaxRORs3] = useState([]);
  const [annualMaxRORs3, setAnnualMaxRORs3] = useState([]);

  const otm1Percentage = useSelector(
    (state) => state.profitHorizon.otm1Percentage
  );
  const otm2Percentage = useSelector(
    (state) => state.profitHorizon.otm2Percentage
  );

  const boxStyle = {
    width: "80vw",
    color: "white",
    "@media (min-width: 600px)": {
      width: "auto", // Set to auto for screens wider than 600px
    },
  };

  useEffect(() => {
    const tempData = [];

    for (let index = 0; index < selectedROIs.length; index++) {
      const roi = selectedROIs[index];
      const annualROI = selectedAnnualROIs[index];
      const maxROR = maxRORs[index];
      const annualMaxROR = annualMaxRORs[index];
      const expiryDate = expiration_dates[index].date;

      switch (selectedBtnText) {
        case "ROI":
          tempData.push({
            name: expiryDate,
            ROI: roi,
            "Annual. ROI": annualROI,
          });
          break;

        case "ROR":
          tempData.push({
            name: expiryDate,
            "Max ROR": maxROR,
            "Annual. Max ROR": annualMaxROR,
          });
          break;

        case "ROI v ROR":
          tempData.push({
            name: expiryDate,
            ROI: roi,
            "Max ROR": maxROR,
          });
          break;

        case "Ann. ROI v ROR":
          tempData.push({
            name: expiryDate,
            "Annual. ROI": annualROI,
            "Annual. Max ROR": annualMaxROR,
          });
          break;

        default:
          break;
      }
    }

    setChartData(tempData);
  }, [selectedROIs, selectedAnnualROIs, maxRORs, annualMaxRORs]);

  const handleButtonClick = (text) => {
    setSelectedBtnText(text);
    const tempData = [];

    switch (text) {
      case "ROI":
        for (let index = 0; index < selectedROIs.length; index++) {
          const roi = selectedROIs[index];
          const annualROI = selectedAnnualROIs[index];
          const expiryDate = expiration_dates[index].date;
          tempData.push({
            name: expiryDate,
            ROI: roi,
            "Annual. ROI": annualROI,
          });
        }
        setChartData(tempData);
        setLabel1("ROI");
        setLabel2("Annual. ROI");
        break;

      case "ROR":                
        for (let index = 0; index < maxRORs.length; index++) {
          const maxROR = maxRORs[index];
          const annualmaxROR = annualMaxRORs[index];
          const expiryDate = expiration_dates[index].date;
          tempData.push({
            name: expiryDate,
            "Max ROR": maxROR,
            "Annual. Max ROR": annualmaxROR,
          });
        }
        setChartData(tempData);
        setLabel1("Max ROR");
        setLabel2("Annual. Max ROR");
        break;

      case "ROI v ROR":
        for (let index = 0; index < selectedROIs.length; index++) {
          const roi = selectedROIs[index];
          const maxROR = maxRORs[index];
          const expiryDate = expiration_dates[index].date;
          tempData.push({
            name: expiryDate,
            ROI: roi,
            "Max ROR": maxROR,
          });
        }
        setChartData(tempData);
        setLabel1("ROI");
        setLabel2("Max ROR");
        break;

      case "Ann. ROI v ROR":
        for (let index = 0; index < selectedAnnualROIs.length; index++) {
          const annualROI = selectedAnnualROIs[index];
          const annualMaxROR = annualMaxRORs[index];
          const expiryDate = expiration_dates[index].date;
          tempData.push({
            name: expiryDate,
            "Annual. ROI": annualROI,
            "Annual. Max ROR": annualMaxROR,
          });
        }
        setChartData(tempData);
        setLabel1("Annual. ROI");
        setLabel2("Annual. Max ROR");
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setselectedStrikePrice(strikeATMs);
    setselectedPremiums(ATMs);
    setselectedROIs(ROIs);
    setselectedAnnualROIs(annualROIs);

    let returns, risks, RORs, annualMaxRORs;

    // For ATM
    returns = strikeATMs.map((item, index) => {
      return parseFloat(
        (item * 100 - sharePrice * 100 + parseFloat(ATMs[index])).toFixed(0)
      );
    });

    risks = ATMs.map((item, index) => {
      return parseFloat((sharePrice * 100 - item).toFixed(0));
    });

    RORs = returns.map((item, index) => {
      return parseFloat(((item / risks[index]) * 100).toFixed(2));
    });
    
    // Convert the time difference from milliseconds to days

    annualMaxRORs = RORs.map((item, index) => {
      return parseFloat(
        (
          (Math.pow(
            1 + item / 100,
            365 / getDaysToExpirationDate(expiration_dates[index].date)
          ) -
            1) *
          100
        ).toFixed(2)
      );
    });

    setMaxReturns1(returns);
    setMaxRisks1(risks);
    setMaxRORs1(RORs);
    setAnnualMaxRORs1(annualMaxRORs);

    setMaxReturns(returns);
    setMaxRisks(risks);
    setMaxRORs(RORs);
    setAnnualMaxRORs(annualMaxRORs);
  
    // For ATM5
    returns = strikeOTM5s.map((item, index) => {
      return parseFloat(
        (item * 100 - sharePrice * 100 + parseFloat(OTM5s[index])).toFixed(0)
      );
    });

    risks = OTM5s.map((item, index) => {
      return parseFloat((sharePrice * 100 - item).toFixed(0));
    });

    RORs = returns.map((item, index) => {
      return parseFloat(((item / risks[index]) * 100).toFixed(2));
    });

    // Convert the time difference from milliseconds to days

    annualMaxRORs = RORs.map((item, index) => {
      return parseFloat(
        (
          (Math.pow(
            1 + item / 100,
            365 / getDaysToExpirationDate(expiration_dates[index].date)
          ) -
            1) *
          100
        ).toFixed(2)
      );
    });

    setMaxReturns2(returns);
    setMaxRisks2(risks);
    setMaxRORs2(RORs);
    setAnnualMaxRORs2(annualMaxRORs);

    // For ATM10
    returns = strikeOTM10s.map((item, index) => {
      return parseFloat(
        (item * 100 - sharePrice * 100 + parseFloat(OTM10s[index])).toFixed(0)
      );
    });

    risks = OTM10s.map((item, index) => {
      return parseFloat((sharePrice * 100 - item).toFixed(0));
    });

    RORs = returns.map((item, index) => {
      return parseFloat(((item / risks[index]) * 100).toFixed(2));
    });

    // Convert the time difference from milliseconds to days
    annualMaxRORs = RORs.map((item, index) => {
      return parseFloat(
        (
          (Math.pow(
            1 + item / 100,
            365 / getDaysToExpirationDate(expiration_dates[index].date)
          ) -
            1) *
          100
        ).toFixed(2)
      );
    });

    setMaxReturns3(returns);
    setMaxRisks3(risks);
    setMaxRORs3(RORs);
    setAnnualMaxRORs3(annualMaxRORs);
  }, [sharePrice, strikeATMs, ATMs, ROIs, annualROIs]);

  useEffect(() => {
    switch (selectedButton) {
      case "ATM":
        setselectedStrikePrice(strikeATMs);
        setselectedPremiums(ATMs);
        setselectedROIs(ROIs);
        setselectedAnnualROIs(annualROIs);
        setMaxReturns(maxReturns1);
        setMaxRisks(maxRisks1);        
        setMaxRORs(maxRORs1);
        setAnnualMaxRORs(annualMaxRORs1);

        break;

      case otm1Percentage + "%OTM":
        setselectedStrikePrice(strikeOTM5s);
        setselectedPremiums(OTM5s);
        setselectedROIs(OTM5ROIs);
        setselectedAnnualROIs(OTM5annualROIs);
        setMaxReturns(maxReturns2);
        setMaxRisks(maxRisks2);
        setMaxRORs(maxRORs2);
        setAnnualMaxRORs(annualMaxRORs2);

        break;

      case otm2Percentage + "%OTM":
        setselectedStrikePrice(strikeOTM10s);
        setselectedPremiums(OTM10s);
        setselectedROIs(OTM10ROIs);
        setselectedAnnualROIs(OTM10annualROIs);
        setMaxReturns(maxReturns3);
        setMaxRisks(maxRisks3);
        setMaxRORs(maxRORs3);
        setAnnualMaxRORs(annualMaxRORs3);

        break;

      default:
        break;
    }
  }, [selectedButton, maxRORs, maxRisks, maxReturns, selectedStrikePrice, selectedPremiums, selectedROIs, selectedAnnualROIs]);

  return (
    <fieldset style={fieldsetStyle}>
      <Box sx={boxStyle}>
        <Typography color="text.third" marginBottom={6}>
          {`"${symbol}"`} Options Profit {daysInFuture} Day Horizon at $
          {selectedStrikePrice[0]} Strike
        </Typography>
      </Box>
      <MyLineChart data={chartData} label1={label1} label2={label2} />
      <Box
        display="flex"
        justifyContent="center"
        mx={1}
        my={1}
        sx={{
          "& .MuiButton-root": {
            backgroundColor: "transparent",
            color: "white",
            border: `1px solid ${theme.palette.text.third}`,
            paddingY: 0,
            paddingX: 1,
          },
          "& .selected": {
            backgroundColor: `${theme.palette.text.third} !important`,
          },
        }}
        gap={1}
      >
        <Button
          className={selectedBtnText === "ROI" ? "selected" : ""}
          onClick={() => handleButtonClick("ROI")}
        >
          ROI
        </Button>
        <Button
          className={selectedBtnText === "ROR" ? "selected" : ""}
          onClick={() => handleButtonClick("ROR")}
        >
          ROR
        </Button>
        <Button
          className={selectedBtnText === "ROI v ROR" ? "selected" : ""}
          onClick={() => handleButtonClick("ROI v ROR")}
        >
          ROI v ROR
        </Button>
        <Button
          className={selectedBtnText === "Ann. ROI v ROR" ? "selected" : ""}
          onClick={() => handleButtonClick("Ann. ROI v ROR")}
        >
          Ann. ROI v ROR
        </Button>
      </Box>
    </fieldset>
  );
};

export default DataChart;
