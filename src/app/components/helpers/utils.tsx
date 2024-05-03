import axios, { AxiosResponse } from "axios";
import { assetTypes, loanTypes, recourses } from "../data/constants";


// Define interface for lead data
interface LeadData {
    data: {
        user: {
            firstName: string;
            lastName: string;
            email: string;
        };
        asset: {
            streetAddress: string;
            city: string;
            state: string;
            zip: string;
            type: string;
        };
        company: string;
        source: string;
        formDataPrefill: {
            loanType: string;
            valuation: number;
            netOperatingIncome: number;
            renovationCosts: number;
            projectedNetOperatingIncome: number;
            landPrice: number;
            constructionBudget: number;
            expensesSpentToDate: number;
            desiredLeverage: number;
        };
    };
    slackMessageStatus: boolean;
    leadType: string;
    loanAmount?: number;
    recourse?: string;
    phoneNum?: string;
    timestamp?: number;
}

// Function to send message to Slack
export function sendMessageToSlack(message: string, timestamp: number, update = false): Promise<number> {
    // Define the URL of your Express backend endpoint
    const expressUrl = `/api/${update ? 'slack-update' : 'slack-write'}`;

    const payload = {
        channel: process.env.NEXT_PUBLIC_SLACK_CHANNEL_ID, // Update with your Slack channel ID
        text: message,
        ts: timestamp,
    };

    return new Promise((resolve, reject) => {
        axios.post(expressUrl, payload)
            .then((response: AxiosResponse<{ ts: number }>) => {
                resolve(response.data.ts);
            })
            .catch((error) => {
                console.error('Error sending message to Slack:', error);
                reject(false);
            });
    });
}

// Function to send data to Slack if changed
export async function sendDataToSlackIfChanged(): Promise<void> {
    // Get the stored data from cookies
    let existingLeadString = getCookies('leadData');
    if (!existingLeadString) {
        return;
    }

    const existingLead: LeadData = JSON.parse(existingLeadString);

    if (existingLead.slackMessageStatus === true) {
        const updatedMessage = getFormattedMessage(existingLead);
        const response = await sendMessageToSlack(updatedMessage, existingLead.timestamp!, true); // Setting update flag to true
        if (response) {
            setCookie('leadData', JSON.stringify(existingLead));
        }
    } else {
        const message = getFormattedMessage(existingLead);
        const response = await sendMessageToSlack(message, existingLead.timestamp!);
        if (response) {
            existingLead.slackMessageStatus = true;
            existingLead.timestamp = response;
            console.log(response)
            setCookie('leadData', JSON.stringify(existingLead));
        }
    }
}

// Function to format message for Slack
function getFormattedMessage(data: LeadData): string {
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

// Function to handle lead data
export function handleLead(data: any, type: string, other: any, isSameLead = true): boolean {
    let existingLeadString = getCookies('leadData');
    let existingLead: LeadData | null = null;
    if (existingLeadString) {
        existingLead = JSON.parse(existingLeadString);
        if (!isSameLead) {
            existingLead = {
                data: data, 
                slackMessageStatus: false,
                leadType: type,
            };
        } else {
            existingLead = {
                data: data, 
                slackMessageStatus: true,
                leadType: type,
                loanAmount: existingLead?.loanAmount,
                recourse: existingLead?.recourse,
                phoneNum: existingLead?.phoneNum,
                timestamp: existingLead?.timestamp,
                ...other
            };
        }
    } else {
        //new lead
        existingLead = {
            data: data,
            slackMessageStatus: false, //not sent if false
            leadType: type,
            ...other
        };
    }

    setCookie('leadData', JSON.stringify(existingLead));
    return true;
}

// Function to get cookie value by name
export function getCookies(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
}

// Function to set cookie
export function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/`;
}

// Function to send data to HubSpot
export function sendDataToHubspot(): void {
    const iframe = document.getElementById('hs-form-iframe-0');
    const existingLeadString = getCookies('leadData');

    if (!iframe || !existingLeadString) {
        // If iframe or existingLeadString is not found, exit the function
        return;
    }

    const existingLead = JSON.parse(existingLeadString);

    const iframeDocument = (iframe as HTMLIFrameElement).contentDocument || (iframe as HTMLIFrameElement).contentWindow?.document;
    if (!iframeDocument) {
        // If iframe document is not found, exit the function
        return;
    }

    const form = iframeDocument.getElementById('hsForm_55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLFormElement;
    if (!form) {
        // If form is not found, exit the function
        return;
    }

    // Fill form fields
    const firstName = iframeDocument.getElementById('firstname-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLInputElement;
    if (firstName) {
        firstName.value = existingLead.data.user.firstName;
    }

    const lastName = iframeDocument.getElementById('lastname-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLInputElement;
    if (lastName) {
        lastName.value = existingLead.data.user.lastName;
    }

    const phoneNumber = iframeDocument.getElementById('phone-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLInputElement;
    if (phoneNumber) {
        phoneNumber.value = existingLead.phoneNum || '';
    }

    const email = iframeDocument.getElementById('email-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLInputElement;
    if (email) {
        email.value = existingLead.data.user.email;
    }

    const assetType = iframeDocument.getElementById('asset_type__c-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLSelectElement;
    if (assetType) {
        for (const [key, value] of Object.entries(assetTypes)) {
            if (value.label === existingLead.data.asset.type) {
                assetType.value = value.type;
                break;
            }
        }
    }

    const loanType = iframeDocument.getElementById('loan_type-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLSelectElement;
    if (loanType) {
        for (const [key, value] of Object.entries(loanTypes)) {
            if (value.label === existingLead.data.formDataPrefill.loanType) {
                loanType.value = value.type;
                break;
            }
        }
    }

    const recourse = iframeDocument.getElementById('recourse-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLSelectElement;
    if (recourse) {
        for (const [key, value] of Object.entries(recourses)) {
            if (value.label === existingLead.recourse) {
                recourse.value = value.type === 'Non-recourse' ? 'No' : 'Yes';
                break;
            }
        }
    }

    const loanAmount = iframeDocument.getElementById('loan_amount-55aa3844-557b-4b60-bb65-99d7e05b2fb5') as HTMLInputElement;
    if (loanAmount) {
        loanAmount.value = (existingLead.loanAmount || 0).toString();
    }

    // Submit form
    setTimeout(() => {
        form.submit();
    },100)
}
