import { createContext, useContext, useState } from "react";
import { getCookies, setCookie } from "../helpers/utils";
import { assetTypes, loanTypes, recourses } from "../data/constants";

const FormContext = createContext();

export const useFormData = () => useContext(FormContext);

export const FormProvider = ({children}) => {
    const [csv, setCsv] = useState(null);
    const [loanType, setLoanType] = useState(null);
    const [assetType, setAssetType] = useState(null);
    const [loanAmount, setLoanAmount] = useState(0);
    const [recourse, setRecourse] = useState(null);
    const [table, setTable] = useState(null);
    
    //setters
    const setLoanTypeData = (value) => {
        setLoanType(value)
        if(getCookies("leadData")){
            let existingLead = JSON.parse(getCookies("leadData"));
            existingLead.data.formDataPrefill.loanType = loanTypes[value]["label"];
            setCookie("leadData", JSON.stringify(existingLead))
        }
    }
    const setAssetTypeData = (value) => {
        setAssetType(value)
        if(getCookies("leadData")){
            let existingLead = JSON.parse(getCookies("leadData"));
            existingLead.data.asset.type = assetTypes[value]["label"];
            setCookie("leadData", JSON.stringify(existingLead))
        }
    }
    const setLoanAmountData = (value) => {
        setLoanAmount(value)
    }
    const setRecourseData = (value) => {
        setRecourse(value)
        if(getCookies("leadData")){
            let existingLead = JSON.parse(getCookies("leadData"));
            existingLead.recourse = recourses[value]["label"];
            setCookie("leadData", JSON.stringify(existingLead))
        }
    }
    const setCsvData = (value) => {
        setCsv(value);
    }
    const setTableData = (value) => {
        setTable(value);
    }


    //getters
    const getLoanTypeData = () =>{
        return loanType
    }
    const getAssetTypeData = () =>{
        return assetType
    }
    const getLoanAmountData = () =>{
        return loanAmount
    }
    const getRecourseData = () =>{
        return recourse
    }
    const getCsvData = () => {
        return csv;
    }
    const getTableData = () => {
        return table;
    }

    const dataFunctions = {
        setLoanTypeData,
        getLoanTypeData,
        setAssetTypeData,
        getAssetTypeData,
        setLoanAmountData,
        getLoanAmountData,
        setRecourseData,
        getRecourseData,
        setCsvData, 
        getCsvData,
        setTableData,
        getTableData
    }

    return (
        <FormContext.Provider value={dataFunctions}>
            {children}
        </FormContext.Provider>
    )
}        