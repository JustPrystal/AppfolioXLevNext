import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CsvDataItem {
    [key: string]: string[];
}

interface CsvData extends Array<CsvDataItem> {}

export default function FetchCSVData(): CsvData {
    const [csvData, setCsvData] = useState<CsvData>([]);

    useEffect(() => {
        fetchCSVData();
    }, []);

    function parseCSV(csvText: string): CsvData {
        const data: CsvData = [];
        const tables = csvText.split("Execution");
        
        for (let i = 1; i < tables.length; i++) {
            const rows = tables[i].split(/\r?\n/);
            const tableTitle = rows[0].split(",")[1];
            const tableData: CsvDataItem = {};
            tableData[tableTitle] = [];
            for (let j = 1; j < rows.length; j++) {
                const row = rows[j].split(',');
                const key = row[1];
                const values = row.slice(2);
                tableData[tableTitle][key] = values;
            }
            data.push(tableData);
        }
    
        return data;
    }
    
    const fetchCSVData = () => {
        const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQqYdRlRecxtRHekTUZk8-g8vdr9eVqFxuuI1HWtJbw6SN-L5aGFrEPB4HRcJzsuNeQF7Ztj6-6lUKP/pub?output=csv';
        axios.get(csvUrl)
            .then((response) => {
                const parsedCsvData = parseCSV(response.data);
                setCsvData(parsedCsvData);
            })
            .catch((error) => {
                console.error('Error fetching CSV data:', error);
            });
    }
    
    return csvData;
}
