import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";

const App = () => {
  const [cmp, setCmp] = useState();
  const [growthRate1to5, setGrowthRate1to5] = useState("");
  const [growthRate5to10, setGrowthRate5to10] = useState("");
  const [terminalGrowthRate, setTerminalGrowthRate] = useState("");
  const [discountRate, setDiscountRate] = useState("");
  const [marketCapinCr, setMarketCap] = useState();
  const [netDebtinCr, setNetDebt] = useState();
  const [initialFreeCashflow, setInitialFreeCashFlow] = useState();

  const [results, setResults] = useState(null);

  const calculateFairValue = () => {
    const CMP = parseFloat(cmp);

    const growth1to5 = parseFloat(growthRate1to5) / 100;
    const growth5to10 = parseFloat(growthRate5to10) / 100;
    const terminalGrowth = parseFloat(terminalGrowthRate) / 100;
    const discount = parseFloat(discountRate) / 100;
    const marketCap = parseFloat(marketCapinCr) * 10000000;
    const netDebt = parseFloat(netDebtinCr) * 10000000;
    const initialFCF = parseFloat(initialFreeCashflow) * 10000000;

    if (
      isNaN(CMP) ||
      isNaN(growth1to5) ||
      isNaN(growth5to10) ||
      isNaN(terminalGrowth) ||
      isNaN(discount) ||
      isNaN(marketCap) ||
      isNaN(netDebt) ||
      isNaN(initialFCF)
    ) {
      alert("Please fill all fields with valid numbers.");
      return;
    }

    let totalPV = 0;
    let fcf = initialFCF;
    for (let t = 1; t <= 5; t++) {
      fcf *= 1 + growth1to5;
      const discountedFCF = fcf / Math.pow(1 + discount, t);
      totalPV += discountedFCF;
    }
    for (let t = 6; t <= 10; t++) {
      fcf *= 1 + growth5to10;
      const discountedFCF = fcf / Math.pow(1 + discount, t);
      totalPV += discountedFCF;
    }

    const terminalValue =
      (fcf * (1 + terminalGrowth)) / (discount - terminalGrowth);
    const discountedTerminalValue = terminalValue / Math.pow(1 + discount, 10);

    const NetPresentValue = totalPV + discountedTerminalValue - netDebt;
    const NoOfShares = marketCap / CMP;
    const FairValue = NetPresentValue / NoOfShares;

    setResults({ FairValue });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Fair Value Calculator
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              label: "Market Cap (in ₹ Cr)",
              value: marketCapinCr,
              setter: setMarketCap,
              adornment: "₹",
            },
            {
              label: "Initial Free Cash Flow (in ₹ Cr)",
              value: initialFreeCashflow,
              setter: setInitialFreeCashFlow,
              adornment: "₹",
            },
            {
              label: "Current Price (CMP)",
              value: cmp,
              setter: setCmp,
              adornment: "₹",
            },
            {
              label: "Growth Rate for 1 to 5 Years (%)",
              value: growthRate1to5,
              setter: setGrowthRate1to5,
              adornment: "%",
            },
            {
              label: "rowth Rate for 5 to 10 Years (%)",
              value: growthRate5to10,
              setter: setGrowthRate5to10,
              adornment: "%",
            },
            {
              label: "Terminal Growth Rate (%)",
              value: terminalGrowthRate,
              setter: setTerminalGrowthRate,
              adornment: "%",
            },
            {
              label: "Discount Rate (%)",
              value: discountRate,
              setter: setDiscountRate,
              adornment: "%",
            },
            {
              label: "Net Debt (in ₹ Cr)",
              value: netDebtinCr,
              setter: setNetDebt,
              adornment: "₹",
            },
          ].map((field, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                label={field.label}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                fullWidth
                type="number"
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={calculateFairValue}>
              Calculate
            </Button>
          </Grid>

          {results && (
            <Grid item xs={12}>
              <Typography variant="h6">
                Estimated Fair Value per Share: ₹
                {Number(results.FairValue).toFixed(2)}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;
