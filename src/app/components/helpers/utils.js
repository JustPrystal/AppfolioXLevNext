import axios from "axios";
import { assetTypes, loanTypes, recourses } from "../data/constants";

let id = null;
console.log(process.env.NEXT_PUBLIC_BACKEND_API_URL)
  export function sendMessageToSlack(message, timestamp, update=false) {
    // Define the URL of your Express backend endpoint
    const expressUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${update ? 'slack-update' : 'slack-write'}`; 

    const payload = {
        channel: process.env.NEXT_PUBLIC_SLACK_CHANNEL_ID, // Update with your Slack channel ID
        text: message,
        ts: timestamp,
    };
    return new Promise((resolve, reject) => {
        axios({
            method: "POST",
            url: expressUrl,
            data: payload
        })
        .then(response => {

            resolve(response.data.ts); 
        })
        .catch(error => {
            console.error('Error sending message to Slack:', error);
            reject(false); 
        });
    });
  }
  export async function sendDataToSlackIfChanged() {
    // Get the stored data from cookies
    let existingLead = getCookies('leadData');
    if(!existingLead){
      return;
    }

    existingLead = JSON.parse(existingLead);

    if (existingLead.slackMessageStatus === true) {
      const updatedMessage = getFormattedMessage(existingLead); 
      const response = await sendMessageToSlack(updatedMessage, existingLead.timestamp, true); // Setting update flag to true
      if (response) {
        setCookie('leadData', JSON.stringify(existingLead));
      }
    } else {
      const message = getFormattedMessage(existingLead);
      const response = await sendMessageToSlack(message, existingLead.timestamp);
      if (response) {
          existingLead.slackMessageStatus = true;
          existingLead.timestamp = response;
          setCookie('leadData', JSON.stringify(existingLead));
      }
    }

  }
  function getFormattedMessage(data) {
    return `New Lead (_*${data.leadType.toUpperCase()}*_)\n\`\`\`` +
    `Full Name: ${data.data.user.firstName} ${data.data.user.lastName}\n` +
    `Address: ${data.data.asset.streetAddress} ${data.data.asset.city} ${data.data.asset.state} ${data.data.asset.zip}\n` +
    `Company: ${data.data.company}\n` +
    `Source: ${data.data.source}\n` +
    `Email: ${data.data.user.email}\n` +
    `Loan Type: ${data.data.formDataPrefill.loanType}\n` +
    `Valuation: ${data.data.formDataPrefill.valuation}\n` +
    `Net Operating Income: ${data.data.formDataPrefill.netOperatingIncome}\n` +
    `Renovation Costs: ${data.data.formDataPrefill.renovationCosts}\n` +
    `Projected Net Operating Income: ${data.data.formDataPrefill.projectedNetOperatingIncome}\n` +
    `Land Price: ${data.data.formDataPrefill.landPrice}\n` +
    `Construction Budget: ${data.data.formDataPrefill.constructionBudget}\n` +
    `Expenses Spent To Date: ${data.data.formDataPrefill.expensesSpentToDate}\n` +
    `Desired Leverage: ${data.data.formDataPrefill.desiredLeverage}\n\n` +
    `Asset Type: ${data.data.asset.type}\n` +
    `${data.loanAmount ? `Loan Amount: ${data.loanAmount}\n` : ''}` +
    `${data.recourse ? `Recourse: ${data.recourse}\n` : ''}` +
    `${data.phoneNum ? `Phone Number: ${data.phoneNum}\n` : ''}\n\`\`\``;
  }


  export function handleLead(data, type, other, isSameLead = true) {
    let existingLead = getCookies('leadData');
    let dataObject = null;
    if(existingLead){
      existingLead = JSON.parse(existingLead);
      if(!isSameLead){
        dataObject={
          data: data, 
          slackMessageStatus: false,
          leadType:type,
        }
      }else{
        dataObject ={
          data: data, 
          slackMessageStatus: true,
          leadType:type,
          loanAmount: existingLead?.loanAmount,
          recourse: existingLead?.recourse,
          phoneNum: existingLead?.phoneNum,
          timestamp: existingLead?.timestamp,
          ...other
        }
      }
    }else{
      //new lead
      dataObject = {
        data: data,
        slackMessageStatus : false, //not sent if false
        leadType : type,
        ...other
      }
    }

    setCookie('leadData', JSON.stringify(dataObject));
    return true;
  }
  // Function to get cookie value by name
  export function getCookies(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }
  export function setCookie(name, value) {
      document.cookie = `${name}=${value}; path=/`;
  }
  export function sendDataToHubspot() {
    var iframe = document.getElementById('hs-form-iframe-0');
    var existingLead = JSON.parse(getCookies("leadData"));
    if (iframe) {
      var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      var form = iframeDocument.getElementById('hsForm_55aa3844-557b-4b60-bb65-99d7e05b2fb5');

      if(form){
        // first name
        var firstName = iframeDocument.getElementById('firstname-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        firstName.value = existingLead.data.user.firstName
        
        // last name
        var lastName = iframeDocument.getElementById('lastname-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        lastName.value = existingLead.data.user.lastName;
        
        // Phone Number
        var phoneNumber = iframeDocument.getElementById('phone-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        phoneNumber.value = existingLead.phoneNum;
        
        // email
        var email = iframeDocument.getElementById('email-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        email.value = existingLead.data.user.email;
        
        // asset type
        var assetType = iframeDocument.getElementById('asset_type__c-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        for (const [key, value] of Object.entries(assetTypes)) {
          if (value.label === existingLead.data.asset.type) {
            assetType.value = value.type;
            break; 
          }
        }
        
        // loan type
        var loanType = iframeDocument.getElementById('loan_type-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        for (const [key, value] of Object.entries(loanTypes)) {
          if (value.label === existingLead.data.formDataPrefill.loanType) {
            loanType.value = value.type;
            break; 
          }
        }
        
        // recourse
        var recourse = iframeDocument.getElementById('recourse-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        for (const [key, value] of Object.entries(recourses)) {
          if (value.label === existingLead.recourse){
            if(value.type === "Non-recourse"){
              recourse.value = "No";
              break
            } else {
              recourse.value = "Yes";
              break
            }
          }
          
        }
        
        // loan amount
        var loanAmount = iframeDocument.getElementById('loan_amount-55aa3844-557b-4b60-bb65-99d7e05b2fb5');
        loanAmount.value = existingLead.loanAmount;
        
        // submit
        form.submit()
      }
    }
  }


