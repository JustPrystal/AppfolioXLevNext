export interface AssetType {
    label: string;
    type: string;
}

export const assetTypes: Record<string, AssetType> = {
    "land_development": {
        label: 'Land/Development',
        type: 'Land'
    },
    "mixed_use_mutifamily": {
        label: 'Mixed Use (Multifamily/Retail)',
        type: 'Multi'
    },
    "industrial": {
        label: 'Industrial',
        type: 'Industrial'
    },
    "cold_storage": {
        label: 'Cold Storage',
        type: 'Industrial'
    },
    "data_center": {
        label: 'Data Center',
        type: 'Industrial'
    },
    "anchored_retail": {
        label: 'Anchored Retail',
        type: 'Retail'
    },
    "nnn_retail": {
        label: 'NNN Retail',
        type: 'Retail'
    },
    "specialty": {
        label: 'Specialty',
        type: 'Specialty'
    },
    "parking_garage": {
        label: 'Parking Garage',
        type: 'Specialty'
    },
    "cannabis": {
        label: 'Cannabis',
        type: 'Retail'
    },
    "1_4_residential": {
        label: '1-4 Residential',
        type: 'SFR'
    },
    "hospitality_hotel": {
        label: 'Hospitality/Hotel',
        type: 'Hospitality'
    },
    "multifamily": {
        label: 'Multifamily',
        type: 'Multi'
    },
    "fractured_condo": {
        label: 'Fractured Condo',
        type: 'Multi'
    },
    "mobile_home_parks": {
        label: 'Mobile Home Parks',
        type: 'Multi'
    },
    "student_housing": {
        label: 'Student Housing',
        type: 'Multi'
    },
    "senior_housing": {
        label: 'Senior Housing',
        type: 'Senior Housing'
    },
    "nursing_homes": {
        label: 'Nursing Homes',
        type: 'Senior Housing'
    },
    "office": {
        label: 'Office',
        type: 'Office'
    },
    "medical_office": {
        label: 'Medical Office',
        type: 'Office'
    },
    "mixed_use_office": {
        label: 'Mixed Use (Office/Retail)',
        type: 'Office'
    },
    "retail": {
        label: 'Retail',
        type: 'Retail'
    },
    "self_storage": {
        label: 'Self-Storage',
        type: 'Industrial'
    },
    "single_family_portfolio": {
        label: 'Single Family Portfolio',
        type: 'SFR'
    }
};

export interface LoanType {
    label: string;
    type: string;
}

export const loanTypes: Record<string, LoanType> = {
    "permanent-financing": {
        label: 'Permanent Financing',
        type: 'Permanent'
    },
    "light-value-add": {
        label: 'Light Value-Add',
        type: 'Bridge'
    },
    "redevelopment": {
        label: 'Redevelopment',
        type: 'Bridge'
    },
    "construction": {
        label: 'Construction',
        type: 'Construction'
    },
    "pre-development": {
        label: 'Pre-Development',
        type: 'Construction'
    }
};

export interface Recourse {
    label: string;
    type: string;
}

export const recourses: Record<string, Recourse> = {
    "personal-recourse": {
        label: 'Personal Recourse',
        type: 'Recourse'
    },
    "fund-recourse": {
        label: 'Fund Recourse',
        type: 'Recourse'
    },
    "no-recourse": {
        label: 'No Recourse',
        type: 'Non-recourse'
    }
};

export interface MockData {
    name: string;
}

export const mockData: MockData[] = [
    { name: "Bank" },
    { name: "Credit Union" },
    { name: "Debt Fund" },
    { name: "Life Co" },
    { name: "CMBS" },
    { name: "Agencies" },
];
