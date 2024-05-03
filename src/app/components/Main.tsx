import React, { ReactNode } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Skeleton from '@mui/material/Skeleton';
import { useMemo } from "react";
import { useFormData } from "./store/provider";
import { mockData } from "./data/constants";

interface MainProps {
  step: number;
  updateStep: (step: number) => void;
}

function Main({ step, updateStep }: MainProps): JSX.Element {
  return (
    <Box className="main-wrap" sx={{
      p: "32px",
      backgroundColor: "#fbfaf8",
      height: "calc(100vh - 143px)",
      width: "100%",
      maxWidth: "calc(100% - 516px)",
      '@media(max-width: 1300px)': {
        maxWidth: "calc(100% - 355px)"
      },
      '@media(max-width: 767px)': {
        maxWidth: "100%"
      },
    }}>
      {step === 1 && <SkeletonTable />}
      {step === 2 && <MainTable step={step} updateStep={updateStep} />}
    </Box>
  );
}

function SkeletonTable(): JSX.Element {
  // Generate random widths for each item in mockData
  const mockDataWithRandomWidths = useMemo(() => {
    return mockData.map(item => ({
      ...item,
      widths: [37.141059807828626, 92.61812969798561, 37.141059807828626, 50.7691634109517, 36.818836903026025, 72.46763405529238],
    }));
  }, [mockData]);

  return (
    <Box className="main-screen" sx={{
      display: "flex",
      alignItems: "flex-end",
      p: "32px",
      pt: "50px",
      borderRadius: "16px",
      backgroundColor: "white",
      overflow: "hidden",
      '@media(max-width: 1300px)': {
        flexDirection: "column",
      },
    }}>
      <Box className="left" sx={{
        mb: "50px",
        width: "50%",
        '@media(max-width: 1300px)': {
          width: "100%"
        }
      }}>
        <Typography className="heading"
          sx={{
            fontFamily: "alv-md",
            color: "#171717",
            lineHeight: "1.166",
            fontSize: "24px",
            mb: "24px",
          }}>
          Refine your calculations to see your prequalified options.
        </Typography>
        <Typography className="description"
          sx={{
            color: "#737373",
            lineHeight: "1.5",
            fontSize: "16px",
            fontWeight: "400"
          }}>
          Lev helps you get a headstart on your plan by showing you prequalified lender-types and terms.
        </Typography>
      </Box>
      <Box className="right" sx={{
        width: "50%",
        '@media(max-width: 1300px)': {
          width: "100%",
          position: "relative",
          height: "320px"
        },

      }}>
        <TableContainer sx={{
          maxWidth: 600,
          overflowX: 'hidden',
          border: "1px solid #eae2d6",
          borderTopLeftRadius: "25px",
          position: "relative",
          bottom: "-33px",
          right: "-51px",
          '@media(max-width: 1300px)': {
            position: "absolute"
          }
        }} >
          <Table sx={{
            overflow: "hidden",
            // tableLayout: "fixed",
          }}>
            <TableBody>
              {mockDataWithRandomWidths.map((item, index) => {
                return (
                  <TableRow key={index} sx={{
                    ":nth-child(2n)": {
                      bgcolor: "#fbfaf8"
                    }
                  }}>
                    <TableCell sx={{
                      border: "1px solid #eee8df",
                      width: "130px",
                      whiteSpace: 'nowrap',
                      borderLeft: "0",
                      borderTop: "0",
                      p: "12px 24px",
                      fontWeight: "500",
                      color: "#525252"
                    }}>{item.name}</TableCell>
                    {item.widths.map((width, i) =>
                      <TableCell key={i} sx={{
                        borderBottom: "1px solid #f8f5f1",
                        minWidth: "150px",
                      }} align="center">
                        <Skeleton animation="wave" width={width} height={20}
                          sx={{
                            margin: "0 auto",
                            borderRadius: "7px"
                          }}></Skeleton>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

interface MainTableProps {
  step: number;
  updateStep: (step: number) => void;
}

function MainTable({ step, updateStep }: MainTableProps): JSX.Element {
  const theme = useTheme();
  const { getTableData } = useFormData();
  const tableData = getTableData();

  return (
    <Box sx={{
      pb: "24px"
    }}>
      <Box className="main-table-wrap" >
        <Typography
          sx={{
            color: "#171717",
            fontFamily: "alv-md",
            fontSize: "24px",
            mb: "16px",
            lineHeight: "1"
          }}>Current Market Terms</Typography>
        <Typography sx={{
          color: "#737373",
          fontSize: "18px",
          mb: "24px",
          lineHeight: "1.55"
        }}>Here are the eligible lender types and their expected terms based on your loan request. Your decisions on the loan request may disqualify some options.</Typography>
        <TableContainer sx={{
          border: "1px solid #eae2d6",
          borderRadius: "16px",
          mb: "24px",
          overflow: "auto",
          width: "100%"
        }} >
          <Table sx={{
            // tableLayout: 'fixed',
            minWidth: "1140px"
          }} >
            <TableBody>
              <TableRow className="head-x">
                <TableCell
                  sx={{
                    borderBottom: "1px solid #eae2d6",
                    borderRight: "1px solid #eae2d6",
                    backgroundColor: "#fbfaf8",
                  }}></TableCell>
                {Object.entries(mockData).map((col, i) =>
                  <TableCell key={i} sx={{
                    borderBottom: "1px solid #eae2d6",
                    borderRight: "1px solid #eae2d6",
                    backgroundColor: "#fbfaf8",
                    ":last-child": {
                      borderRight: "none",
                    },
                    color: "#525252",
                    lineHeight: "1.43",
                    fontSize: "14px",
                    width: "50px",
                    fontWeight: "500"
                  }} align="center">
                    {col[1].name}
                  </TableCell>
                )}
              </TableRow>
              {Object.entries((tableData || mockData)).map((row, index) => {
                return (
                  <TableRow key={index} sx={{
                    ":nth-child(2n)": {
                      bgcolor: "#fff"
                    }
                  }}>
                    <TableCell sx={{
                      border: "1px solid #eee8df",
                      backgroundColor: "#fbfaf8",
                      borderLeft: "0",
                      borderTop: "0",
                      borderBottom: "0", // Fix: Change false to "0"
                      width: "calc( 100% / 7)",
                      p: "20px 16px",
                      fontWeight: "500",
                      color: "#525252"
                    }} >{row[0]}</TableCell>
                    {Object.entries(row[1] as { [s: string]: unknown }).map((cell, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          border: "1px solid #eee8df",
                          borderBottom: "0",
                          borderRight: "0", // Fix: Change false to "0"
                          width: "calc( 100% / 7)",
                          fontWeight: "500",
                          color: "#525252",
                          p: "16px"
                        }}
                        align="right"
                      >
                        {cell[1] as ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography
          sx={{
            fontSize: "12px",
            lineHeight: "1",
            color: "#737373",
            fontStyle: "italic"
          }}>*These are estimated ranges based on current market conditions and internal data. Terms may vary at the deal level. </Typography>
      </Box>
      {
        step === 2 && <Box className="next-step">
          <Button className="get-financing" fullWidth color="primary"
            variant="contained"
            onClick={() => updateStep(3)}
            sx={{
              mt: "24px",
              borderRadius: "8px",
              maxHeight: "44px",
              mb: "24px",
              height: "100%",
              border: `1px solid ${theme.palette.primary}`,
              fontSize: "16px",
              lineHeight: "1.4",
              textTransform: "capitalize",
              letterSpacing: "-0.5px",
              fontFamily: "inherit",
              p: "10px 18px",
              display: "none",
              '@media(max-width:767px)': {
                display: "flex"
              }
            }}>get financing
          <ArrowForwardIcon sx={{ pl: "5px" }} />
          </Button>
        </Box>
      }
    </Box>
  );
}

export default Main;
