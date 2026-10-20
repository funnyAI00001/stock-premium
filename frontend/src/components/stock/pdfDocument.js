import React, { useEffect, useState } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 40,
    paddingRight: 40,
  },
  row: {
    fontSize: 9,
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    borderColor: "black",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    flexDirection: "row",
  },

  theader: {
    marginTop: 10,
    fontSize: 10,
    fontStyle: "bold",
    paddingTop: 4,
    paddingLeft: 7,
    flex: 1,
    height: 20,
    backgroundColor: "#DEDEDE",
    borderColor: "black",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
});

const PDFDocument = ({ symbols, dataForPdf }) => {
  const [data, setData] = useState([]);
  const sharePrices = dataForPdf.sharePrices;
  const ATMs = dataForPdf.ATMs;
  const OTM5s = dataForPdf.OTM5s;
  const OTM10s = dataForPdf.OTM10s;
  const strikeATMs = dataForPdf.strikeATMs;
  const strikeOTM5s = dataForPdf.strikeOTM5s;
  const strikeOTM10s = dataForPdf.strikeOTM10s;
  const ROIs = dataForPdf.ROIs;
  const OTM5ROIs = dataForPdf.OTM5ROIs;
  const OTM10ROIs = dataForPdf.OTM10ROIs;
  const annualROIs = dataForPdf.annualROIs;
  const OTM5annualROIs = dataForPdf.OTM5annualROIs;
  const OTM10annualROIs = dataForPdf.OTM10annualROIs;
  const expiration_date = dataForPdf.expiration_date;
  const otm1Percentage = dataForPdf.otm1Percentage;
  const otm2Percentage = dataForPdf.otm2Percentage;
  const maxReturns1 = dataForPdf.maxReturns1;
  const maxRisks1 = dataForPdf.maxRisks1;
  const maxRORs1 = dataForPdf.maxRORs1;
  const annualMaxRORs1 = dataForPdf.annualMaxRORs1;
  const maxReturns2 = dataForPdf.maxReturns2;
  const maxRisks2 = dataForPdf.maxRisks2;
  const maxRORs2 = dataForPdf.maxRORs2;
  const annualMaxRORs2 = dataForPdf.annualMaxRORs2;
  const maxReturns3 = dataForPdf.maxReturns3;
  const maxRisks3 = dataForPdf.maxRisks3;
  const maxRORs3 = dataForPdf.maxRORs3;
  const annualMaxRORs3 = dataForPdf.annualMaxRORs3;

  const rowNames = [
    "Symbol",
    "Share price x 100",
    "Expiry Date",
    "Strike Price",
    "Premium",
    "ROI",
    "Annual. ROI",
    "Max Return",
    "Max Risk",
    "Max ROR",
    "Annual. Max ROR",
  ];

  useEffect(() => {
    const header = ["symbols", ...symbols];
    let row1 = [
      rowNames[1],
      ...sharePrices.map((item) => {
        return "$" + Intl.NumberFormat("en-US").format(item * 100);
      }),
    ];
    let row3 = [
      rowNames[3],
      ...strikeATMs.map((item) => {
        return "$" + item;
      }),
    ];
    let row4 = [
      rowNames[4],
      ...ATMs.map((item) => {
        return "$" + item;
      }),
    ];
    let row5 = [
      rowNames[5],
      ...ROIs.map((item) => {
        return item + "%";
      }),
    ];
    let row6 = [
      rowNames[6],
      ...annualROIs.map((item) => {
        return item + "%";
      }),
    ];
    let row7 = [
      rowNames[7],
      ...maxReturns1.map((item) => {
        return "$" + item;
      }),
    ];
    let row8 = [
      rowNames[8],
      ...maxRisks1.map((item) => {
        return "$" + item;
      }),
    ];
    let row9 = [
      rowNames[9],
      ...maxRORs1.map((item) => {
        return item + "%";
      }),
    ];
    let row10 = [
      rowNames[10],
      ...annualMaxRORs1.map((item) => {
        return item + "%";
      }),
    ];

    var temp = ["Expiry Date"];
    for (let index = 0; index < symbols.length; index++) {
      temp.push(expiration_date);
    }

    var row2 = temp;

    let data1 = [
      [...row1],
      [...row2],
      [...row3],
      [...row4],
      [...row5],
      [...row6],
      [...row7],
      [...row8],
      [...row9],
      [...row10],
    ];

    row3 = [
      rowNames[3],
      ...strikeOTM5s.map((item) => {
        return "$" + item;
      }),
    ];
    row4 = [
      rowNames[4],
      ...OTM5s.map((item) => {
        return "$" + item;
      }),
    ];
    row5 = [
      rowNames[5],
      ...OTM5ROIs.map((item) => {
        return item + "%";
      }),
    ];
    row6 = [
      rowNames[6],
      ...OTM5annualROIs.map((item) => {
        return item + "%";
      }),
    ];
    row7 = [
      rowNames[7],
      ...maxReturns2.map((item) => {
        return "$" + item;
      }),
    ];
    row8 = [
      rowNames[8],
      ...maxRisks2.map((item) => {
        return "$" + item;
      }),
    ];
    row9 = [
      rowNames[9],
      ...maxRORs2.map((item) => {
        return item + "%";
      }),
    ];
    row10 = [
      rowNames[10],
      ...annualMaxRORs2.map((item) => {
        return item + "%";
      }),
    ];

    let data2 = [
      [...row1],
      [...row2],
      [...row3],
      [...row4],
      [...row5],
      [...row6],
      [...row7],
      [...row8],
      [...row9],
      [...row10],
    ];

    row3 = [
      rowNames[3],
      ...strikeOTM10s.map((item) => {
        return "$" + item;
      }),
    ];
    row4 = [
      rowNames[4],
      ...OTM10s.map((item) => {
        return "$" + item;
      }),
    ];
    row5 = [
      rowNames[5],
      ...OTM10ROIs.map((item) => {
        return item + "%";
      }),
    ];
    row6 = [
      rowNames[6],
      ...OTM10annualROIs.map((item) => {
        return item + "%";
      }),
    ];
    row7 = [
      rowNames[7],
      ...maxReturns3.map((item) => {
        return "$" + item;
      }),
    ];
    row8 = [
      rowNames[8],
      ...maxRisks3.map((item) => {
        return "$" + item;
      }),
    ];
    row9 = [
      rowNames[9],
      ...maxRORs3.map((item) => {
        return item + "%";
      }),
    ];
    row10 = [
      rowNames[10],
      ...annualMaxRORs3.map((item) => {
        return item + "%";
      }),
    ];

    let data3 = [
      [...row1],
      [...row2],
      [...row3],
      [...row4],
      [...row5],
      [...row6],
      [...row7],
      [...row8],
      [...row9],
      [...row10],
    ];

    setData([
      { title: "ATM", headers: header, maindata: data1 },
      { title: "OTM" + otm1Percentage, headers: header, maindata: data2 },
      { title: "OTM" + otm2Percentage, headers: header, maindata: data3 },
    ]);
  }, [sharePrices, symbols]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {data.map((item, index) => (
          <>
            <View style={{ marginTop: 20 }}>
              <Text>{item.title}</Text>
            </View>
            <View
              style={{ width: "100%", flexDirection: "row", marginTop: 10 }}
            >
              {/* Header row */}
              {item.headers.map((header, index) => (
                <View style={styles.theader} key={index}>
                  <Text key={index}>{header}</Text>
                </View>
              ))}
            </View>
            {/* Data rows */}
            {item.maindata.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <View style={{ width: "100%", flexDirection: "row" }}>
                  {row.map((cellData, cellIndex) => (
                    <View style={styles.row} key={cellIndex}>
                      <Text>{cellData}</Text>
                    </View>
                  ))}
                </View>
              </React.Fragment>
            ))}
          </>
        ))}
      </Page>
    </Document>
  );
};

export default PDFDocument;
