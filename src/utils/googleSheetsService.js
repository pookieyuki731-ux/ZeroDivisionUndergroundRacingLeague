import Papa from 'papaparse';

export const fetchRosterFromSheet = async (sheetUrl) => {
    return new Promise((resolve, reject) => {
        Papa.parse(sheetUrl, {
            download: true,
            header: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};
