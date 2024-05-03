import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LoadingScreen from './components/helpers/LoadingScreen';
import { useSnackbar } from 'notistack';
import FetchCSVData from './FetchData';
import { useFormData } from './components/store/provider';
import { assetTypes, loanTypes } from './components/data/constants';
import { sendDataToSlackIfChanged, handleLead, getCookies } from './components/helpers/utils';
import HubspotForm from './components/HubspotForm';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CallScheduler from './components/CallScheduler';
import Main from './components/Main';
import Thanks from './components/Thanks';

interface FormData {
  asset: {
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    type: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  formDataPrefill: {
    loanType: string;
  };
}

function App(): JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState<FormData | null>(null);
  const [overflow, setOverflow] = useState<boolean>(false);

  const { setLoanTypeData, setAssetTypeData } = useFormData();

  let URLData = '';
  if (typeof window !== 'undefined') {
    const currentUrl = new URL(window.location.toLocaleString());
    const urlParams = currentUrl.searchParams;
    URLData = urlParams.get('data') ?? '';
  }

  const toggleOverflow = () => {
    setOverflow(!overflow);
  };

  const csvData = FetchCSVData();

  const { enqueueSnackbar } = useSnackbar();
  const { setCsvData } = useFormData();

  const updateStep = (num: number) => {
    setStep(num);
  };

  useEffect(() => {
    if (URLData) {
      try {
        const JSONData: FormData = JSON.parse(atob(URLData));
        if (JSONData.asset.type) {
          const assetType = getKeyByValue(assetTypes, JSONData.asset.type);
          if (assetType) {
            setAssetTypeData(assetType);
          }
        }
        if (JSONData.formDataPrefill.loanType) {
          const loanType = getKeyByValue(loanTypes, JSONData.formDataPrefill.loanType);
          if (loanType) {
            setLoanTypeData(loanType);
          }
        }

        let existingLead = getCookies('leadData');

        if (!existingLead) {
          handleLead(JSONData, "cold", {});
          sendDataToSlackIfChanged();
        } else {
          if (JSON.stringify(JSON.parse(existingLead).data) !== JSON.stringify(JSONData)) {
            handleLead(JSONData, "cold", {}, false);
            sendDataToSlackIfChanged();
          }
        }
        setData(JSONData);
      } catch (error) {
        console.log(error);
        enqueueSnackbar("The link is broken or inaccessible. Please ensure it is valid and try again later.", { variant: 'error' });
        setData(null);
      }
    } else {
      enqueueSnackbar("An error occurred while processing the link. Please try again later.", { variant: 'error' });
      setData(null);
    }
  }, [URLData]);

  useEffect(() => {
    if (!csvData) {
      // CSV Data not available show error
      enqueueSnackbar("Error getting csv details", { variant: 'error' });
      return;
    }
    setCsvData(csvData);
  }, [csvData]);

  function getKeyByValue(dataType: { [key: string]: { label: string } }, value: string): string | null {
    for (const key in dataType) {
      if (dataType.hasOwnProperty(key)) {
        if (dataType[key].label === value) {
          return key;
        }
      }
    }
    return null; // Return null if value not found
  }

  return (
    <>
      <div className={`app ${overflow ? "overflow-visible" : "overflow-hidden"}`}>
        {data ? (
          <>
            {(step === 1 || step === 2 || step === 3) && <Box className="app-wrap">
              <Header data={data} />
              {(step === 1 || step === 2) &&
                <Box sx={{
                  display: "flex",
                  position: "relative"
                }}>
                  <Sidebar data={data} updateStep={updateStep} send={sendDataToSlackIfChanged} step={step} toggleOverflow={toggleOverflow} />
                  <Main step={step} updateStep={updateStep} />
                </Box>}
              {step === 3 && <CallScheduler data={data} send={sendDataToSlackIfChanged} updateStep={updateStep} step={step} />}
            </Box>}
            {step === 4 && <Thanks data={data} />}
          </>
        ) : <LoadingScreen/>}
      </div>
      <HubspotForm />
    </>
  );
}

export default App;
