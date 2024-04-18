import { Box, Button, FormControl, InputAdornment, OutlinedInput, } from "@mui/material";
import { Typography } from "@mui/material";
import BasicSelect from "./helpers/Select";
import { useTheme } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LoadingButton from '@mui/lab/LoadingButton';
import { useFormData } from "./store/provider";
import { assetTypes, loanTypes, recourses } from "./data/constants";
import { getCookies, handleLead, sendDataToSlackIfChanged, sendDataToHubspot } from "./helpers/utils";

function Form({data, updateStep, step, toggleDrawer, toggleOverflow}){
    const theme = useTheme();
    const {setLoanTypeData , getLoanTypeData, setAssetTypeData, getCsvData, getAssetTypeData, setRecourseData, getRecourseData, setLoanAmountData, getLoanAmountData, setTableData} = useFormData();
    const loanType = getLoanTypeData();
    const assetType = getAssetTypeData();
    const recourse = getRecourseData();
    const loanAmount = getLoanAmountData();
    const csvData = getCsvData();

    const thousandSeparatedFormat = (value) => {
        if(!value){
            return "";
        }else{
            return Number(value).toLocaleString();
        }
    };

    const handleCalculate = () => {
        // conversion for keys to type
        const localAssetType = assetTypes[assetType]['type'];
        const localLoanType = loanTypes[loanType]['type']; 
        const localRecourse = recourses[recourse]['type'];

        if(!localAssetType || !localLoanType || !localRecourse){
            // show error;
            return;
        }
        const selectedRow = csvData[0]['Bank']
        const matchedIndex = selectedRow['Loan Type'].findIndex((type, i) => type === localLoanType && selectedRow['Asset Type'][i] === localAssetType && selectedRow['Recourse'][i] === localRecourse);

        const formattedData = {
            "Max LTV":{},
            "Rate":{},
            "Term":{},
            "Interest Only":{},
            "Amortization":{},
            "Pre Pay":{},
        };
        csvData.forEach(csvRow => {
            Object.entries(csvRow).map(([name, values]) => {
                //max ltv
                const maxLTV = values['As-Is LTV (Max)'][matchedIndex];
                //interest rate
                const interestRateMin = values['Interest Rate (Min)'][matchedIndex];
                const interestRateMax = values['Interest Rate (Max)'][matchedIndex];
                const interestOutput = interestRateMax.trim() === interestRateMin.trim() ? interestRateMax : `${interestRateMin} - ${interestRateMax}`; 
                //term
                const termMin = values['Term (Min)'][matchedIndex];
                const termMax = values['Term (Max)'][matchedIndex];
                const termOutput = termMax.trim() === termMin.trim() ? termMax : `${termMin} - ${termMax} yrs`; 
                //interest only
                const IOMin = values['IO Period (Min)'][matchedIndex];
                const IOMax = values['IO Period (Max)'][matchedIndex];
                const IOOutput = IOMax.trim() === IOMin.trim() ? IOMax : `${IOMin} - ${IOMax} yrs`; 
                //Amortization	
                const amortizationMin = values['Amortization (Min)'][matchedIndex];
                const amortizationMax = values['Amortization (Max)'][matchedIndex];
                const amortizationOutput = amortizationMax.trim() === amortizationMin.trim() ? amortizationMax : `${amortizationMin} - ${amortizationMax} yrs`; 
                //prepay
                const prepay = values['Prepayment Penalty'][matchedIndex]

                formattedData['Max LTV'][name] = maxLTV;
                formattedData['Rate'][name] = interestOutput;
                formattedData['Term'][name] = termOutput;
                formattedData['Interest Only'][name] = IOOutput;
                formattedData['Amortization'][name] = amortizationOutput;
                formattedData['Pre Pay'][name] = prepay;
            })
        });
        
        //check if formattted data is the ame as previous submission to not do the calculation again
        setTableData(formattedData);
        toggleDrawer()
        toggleOverflow()
        updateStep(2)
    }
    return(
        <Box className="form"> 
            <Box className = "instructions"
            sx = {{
                mb: " 16px",
            }}>

                <Typography 
                sx = {{
                    fontSize: "14px",
                    color: "#737373",
                    letterSpacing: "-0.5px",
                }}
                >Refine Calculations and automatically update prequalified lending terms.
                </Typography>
            </Box>
            <Box className="form-options">
                <Box className="fields"
                sx={{
                    borderBottom: "1px solid #eae2d6"
                }}>
                    <BasicSelect title="Asset Type" 
                        options={assetTypes}
                        value={assetType}
                        setValue={(value) => {
                            setAssetTypeData(value);
                        }}
                    />
                    <BasicSelect title="Loan Type" 
                        options={loanTypes}
                        value={loanType}
                        setValue={(value) => {
                            setLoanTypeData(value)
                        }}
                    />
                    <Typography
                    sx={{
                        fontSize: "14px",
                        color: "black",
                        letterSpacing: "-0.5px",
                        mb: "6px",
                        fontWeight: "500"
                    }}
                    >
                    Loan Amount
                    </Typography>
                    <FormControl fullWidth sx={{  
                        borderRadius: "8px", 
                        border: "1px solid #e5e5e5", 
                        mb: "24px", 
                        boxShadow: "0 2px 15px -10px rgba(0,0,0,0.25)",
                        bgcolor: "#fff",
                    }}> 
                        <OutlinedInput 
                        value={thousandSeparatedFormat(loanAmount)}
                        onChange={(event)=>{ setLoanAmountData(event.target.value.replace(/\D/g, '')) }}
                        sx={{  
                            borderRadius: "8px", 
                            p: "10.5px 14px",
                            fontSize : "16px",
                            ">input": {
                              padding: "0"
                            },
                            ">fieldset": {
                              border: "0"
                            },
                        }} 
                            startAdornment={<InputAdornment position="start">$</InputAdornment>} 
                        /> 
                    </FormControl>    
                </Box>
                <Box className="recourse">
                    <Typography 
                    sx = {{

                        pt: "24px",
                        letterSpacing: "-0.5px",
                        fontSize: "16px",
                        pb: " 12px",
                    }}
                    >Are you able to accept some recourse?</Typography>
                    <Box className="button-group" sx={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap",
                        mb: "16px"
                    }}>
                        {
                          recourses && Object.entries(recourses).map(([key , {label, type}])=>(
                              <Button 
                                value={type}
                                key={key}
                                color="primary" 
                                onClick={(event) => {
                                    setRecourseData(key);
                                }}
                                sx={{
                                  letterSpacing: "-0.5px",
                                  textTransform: "Capitalize",
                                  fontWeight:"500",
                                  fontSize:"14px",
                                  p: "12px 16px",
                                  lineHeight: "1.3",
                                  borderColor: "#EAE2D6",
                                  borderRadius: "8px",
                                  color: recourse === key ? `${theme.palette.secondary.main}` : `#404040`,
                                  border: recourse === key ? `1px solid ${theme.palette.secondary.main}` : `1px solid #EAE2D6`
                                }}>{label}</Button>
                            )
                          )  
                        }
                    </Box>
                </Box>
            </Box>
            <Box className="calculate" sx={{
                borderBottom: "1px solid #eae2d6",
            }}>
                <LoadingButton  
                disabled={!assetType || !loanType || !loanAmount || !recourse} 
                variant="outlined" 
                sx={{
                    color: "#404040",
                    borderRadius: "8px", 
                    border: "1px solid #d9d9d9", 
                    fontSize: "16px",
                    lineHeight: "1.4",
                    bgcolor: "#fff",
                    textTransform: "capitalize",
                    letterSpacing: "-0.5px",
                    mb: "24px",
                    p: "10px 18px",
                    maxHeight: "44px",
                    height: "100%",
                    boxShadow: "0 2px 15px -10px rgba(0,0,0,0.25)",
                }} 
                fullWidth 
                onClick={() => handleCalculate()} 
                >Calculate</LoadingButton>           
            </Box>
            {
                step === 2 && <Box className="next-step" sx={{
                    display: "block",
                    '@media(max-width:767px)':{
                        display: "none"
                    }
                }}>
                <Button className="get-financing" fullWidth color="primary"
                variant="contained"
                onClick={()=>{
                    let existingLead = getCookies("leadData");
                    if((recourse !== JSON.parse(existingLead).recourse) || 
                    (loanAmount !== JSON.parse(existingLead).loanAmount) ||
                    (assetType !== JSON.parse(existingLead).data.asset.type) ||
                    (loanType !== JSON.parse(existingLead).data.formDataPrefill.loanType)
                    ){
                        const leadIsTrue = handleLead(JSON.parse(existingLead).data, 'warm', {loanAmount});
                        if (leadIsTrue){
                            sendDataToSlackIfChanged();
                        }
                    }
                    sendDataToHubspot();
                    updateStep(3);
                }}
                sx={{
                    mt: "24px",
                    color: theme.palette.primary,
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
                }}>get financing 
                <ArrowForwardIcon sx={{pl:"5px"}}/>
                </Button>
            </Box>
            }
        </Box>
    )
}




export default Form;