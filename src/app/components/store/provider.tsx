import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { getCookies, setCookie } from "../helpers/utils";
import { assetTypes, loanTypes, recourses } from "../data/constants";

interface FormData {
  loanType: string | null;
  assetType: string | null;
  loanAmount: number;
  recourse: string | null;
  csv: any; // Adjust the type based on the actual CSV data type
  table: any; // Adjust the type based on the actual table data type
}

interface FormContextType {
  setLoanTypeData: Dispatch<SetStateAction<string | null>>;
  getLoanTypeData: () => string | null;
  setAssetTypeData: Dispatch<SetStateAction<string | null>>;
  getAssetTypeData: () => string | null;
  setLoanAmountData: Dispatch<SetStateAction<number>>;
  getLoanAmountData: () => number;
  setRecourseData: Dispatch<SetStateAction<string | null>>;
  getRecourseData: () => string | null;
  setCsvData: Dispatch<SetStateAction<any>>;
  getCsvData: () => any;
  setTableData: Dispatch<SetStateAction<any>>;
  getTableData: () => any;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormData = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormProvider");
  }
  return context;
};

interface FormProviderProps {
  children: ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
  const [loanType, setLoanType] = useState<string | null>(null);
  const [assetType, setAssetType] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [recourse, setRecourse] = useState<string | null>(null);
  const [csv, setCsv] = useState<any>(null); // Adjust the type based on the actual CSV data type
  const [table, setTable] = useState<any>(null); // Adjust the type based on the actual table data type

  const setLoanTypeData = (value: string | null) => {
    setLoanType(value);
    if (getCookies("leadData")) {
      let existingLead = JSON.parse(getCookies("leadData") as string);
      existingLead.data.formDataPrefill.loanType = loanTypes[value!]["label"];
      setCookie("leadData", JSON.stringify(existingLead));
    }
  };

  const setAssetTypeData = (value: string | null) => {
    setAssetType(value);
    if (getCookies("leadData")) {
      let existingLead = JSON.parse(getCookies("leadData") as string);
      existingLead.data.asset.type = assetTypes[value!]["label"];
      setCookie("leadData", JSON.stringify(existingLead));
    }
  };

  const setRecourseData = (value: string | null) => {
    setRecourse(value);
    if (getCookies("leadData")) {
      let existingLead = JSON.parse(getCookies("leadData") as string);
      existingLead.recourse = recourses[value!]["label"];
      setCookie("leadData", JSON.stringify(existingLead));
    }
  };

  const dataFunctions: FormContextType = {
    setLoanTypeData,
    getLoanTypeData: () => loanType,
    setAssetTypeData,
    getAssetTypeData: () => assetType,
    setLoanAmountData: setLoanAmount,
    getLoanAmountData: () => loanAmount,
    setRecourseData,
    getRecourseData: () => recourse,
    setCsvData: setCsv,
    getCsvData: () => csv,
    setTableData: setTable,
    getTableData: () => table,
  };

  return (
    <FormContext.Provider value={dataFunctions}>
      {children}
    </FormContext.Provider>
  );
};
