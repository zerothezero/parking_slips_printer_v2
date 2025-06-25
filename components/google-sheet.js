import axios from 'axios';
import { decode, sign } from "react-native-pure-jwt";
import { toast } from "./helper";

// Google API
const SPREADSHEET_ID = '1rQKDYbEsbwFNnqNQAbr2Igt_Hf26PP8V5szb201eXsQ';
const CLIENT_EMAIL = 'sheet-api@psb-parking-gsheet.iam.gserviceaccount.com';
const PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCfeKd/uq/y8vzx\\nrO2R/Df+t3FiC6ycfp5Z3WmQ3TMpLFeIqnDkj0+YTl3DqIg4+KENuSG+LpxDYPt2\\npNU24PqHHtRSq1M246xgn6A3Ob72vGk85sfbwKpGBAcMCVMdYMrlHsSxTU0KL1NX\\n0WNa9FfIK+MObKkHnjbNvbYjKXcaHDGD6Eei4NQM7fw4fSnpx+rbHIMAgKfimMyd\\nlhNnKI03sxw4J3zsu//BZ6ykyHN66tNgobNVRoXiMeIWefJX84hI5adboHiNZi99\\n+fm4aze14Jo+R2qjzpu8eUmpX/p7odhLXtCbscpolApLm/5nVgp90c5b/j2kKDBZ\\nK7l91o+/AgMBAAECggEAFyLgnj8+DrqNKHJP0gRsiqJ1AJC0CCJgo/tjuPY2rsxg\\nSL4oUdNZl2hrNxtI5DHCNU+njcQ3vJjMnYp4OpWKaLci087ybD4SK2nioJCFXEkP\\n4EY/4b8tP6o5ltf1fId8ovWDUOaSUkjKcoJjmUsQ6e7gFXQoqSfISLIzmMddIGbo\\nPefEO0cj4QrDAsKzZrifHIMfwjzWxhjKlnWkPzR0P3ZmvOk8nNYrfezDLwVeu8up\\nd0viE+OFmQyXxIP6TZDmrYkMnuVR9w8K1YmTHzIYINSnDaxrnM2wCCFG6gcdQM4i\\nM/XruQodgfScGbW+nYP9Q+0v0Rz+1lmfr74y4hXQAQKBgQDbeYouAyAUoj4R4MYc\\n+cZ3OXXYKbgGQt2vVMmPdtKEaqD5dfwRpXcybHar5aN5s6XVs5Jt/ZbSkLYkckT1\\nSKjrbr//ai4YMOmh1EyKmqf1wvap92jeZgf1fyvm0fA5OKH3uQrNEx4e6kHCO9tI\\nPx2nClCu9Fi+V19AmEs3ivwQAQKBgQC6Ar0jj/cfF3ArvtaNUHcv1SjjVZARVrlg\\nlpKCtFWi4tpezNB36IqvHH4PfAnyJl+G1EGj+CgQyKiGcsbHcqwYIYIUBLni64sw\\nh57sDinNoj7rRgtbARyy+sJ959iZaVsrByrAgbhSS8uBnMgTVt4/YkvuivQjx5nO\\nAMVw3dafvwKBgQC/vwLbSj236TtDUVaksBAVz6zGa0Rsq/SUHwZuAcjQiXwUFmFg\\nZWirNBnF+r4FMM/c0aNH1zrywh1v4CmhBpcWAc9abcDRv8IOcbVhjtbZHzlzq0UC\\nsK+Zaz7GzXoL9A+FpzPpkR9KsS08biEZkJLuglOVVsNFoH4GqEdmwlWQAQKBgQCG\\nR9ngpVph0JrCicb7Rx5zom8dBjS1v6SdrLVhs+uqZhf8neDU30PWvDvo08OeUsNd\\nYzdrtoa97w1x2cPUUd0Yon/0EaFbxmy6AP3iLStSbpD7aZpi/P+J2Wq0V73OqfcN\\nrePYCw1UI7FrBRKOm4Rfv4dPUnKCreJDi9z86Li6owKBgHfrZsS3NOP8T5amTIzs\\nU1JFh81KsNsO+jCrJ8n62ryvZih5Dg4j9pkhED53yJtMMHNHey0acWVGYxMzfAJa\\n4xSdVlRzFTNrnvXfTDvn5N2oERu9gWZL4OZTbStrzZYdjODPO6AV7IzbSpF/BDsV\\nMsmlL2+bkST3r4eM+JtbdN6n\\n-----END PRIVATE KEY-----\\n';
const API_KEY = 'AIzaSyC6ZznVJj73iPNuafepA_jy5HmOt_6ZxNM';

// const authenticate = async (spreadsheetId, clientEmail, privateKey) => {
//     try {
//         const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
//         const jwtToken = await getJWTToken(clientEmail, privateKey);
//
//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${jwtToken}`,
//                 'Content-Type': 'application/json'
//             }
//         });
//
//         // Handle the response or return it
//         return response.data;
//     } catch (error) {
//         console.error('Authentication failed:', error);
//         // Handle the error
//     }
// };

// export const getJWTToken = async (clientEmail: string, privateKey: string) => {
export const getJWTToken = async () => {
    try {
        const payload = {
            iss: CLIENT_EMAIL,
            scope: 'https://www.googleapis.com/auth/spreadsheets',
            aud: 'https://accounts.google.com/o/oauth2/token',
            exp: new Date().getTime() + (3600) * 1000, // Token expires in 1 hour
            iat: new Date().getTime()
        };

        return await sign(payload, PRIVATE_KEY, {alg: "HS256"});
    } catch (error) {
        console.error('Failed to generate JWT token:', error);
        toast('Failed to generate JWT token.');
    }
};

export const isTokenExpired = async (token) => {
    try {
        if (token === '') {
            return true;
        }
        const decodedToken = await decode(token, PRIVATE_KEY, {skipValidation: true});
        if (!decodedToken || !decodedToken.payload.exp) {
            // Token is invalid or doesn't contain an expiration time
            return true;
        }

        // Get the current timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Compare the expiration time with the current time
        return decodedToken.payload.exp < currentTimestamp;
    } catch (error) {
        // console.error('Failed to check token expiration:', error);
        toast('Failed to check token expiration.');

        return true;
    }
};

export const getOrCreateSheet = async (jwtToken, sheetName, rowHeader) => {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

        // Check if the sheet already exists
        // const response = await axios.get(url, {
        //     headers: {
        //         'Authorization': `Bearer ${jwtToken}`,
        //         'Content-Type': 'application/json'
        //     }
        // });
        const response = await axios.get(url + `?key=${API_KEY}`);
        const sheets = response.data.sheets;
        let sheetId;

        // Find the sheet with the given name
        const existingSheet = sheets.find(sheet => sheet.properties.title === sheetName);
        if (existingSheet) {
            sheetId = existingSheet.properties.sheetId;
        } else {
            // headers
            const headers = rowHeader.map((h) => {
                return {
                    userEnteredValue: {stringValue: h},
                    userEnteredFormat: {
                        textFormat: {fontSize: 14},
                        horizontalAlignment: 'CENTER',
                        borders: {
                            top: {style: 'SOLID'},
                            bottom: {style: 'SOLID'},
                            left: {style: 'SOLID'},
                            right: {style: 'SOLID'}
                        }
                    }
                }
            })
            // Create a new sheet with the given name
            const requestBody = {
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetName,
                                index: 1
                            }
                        }
                    },
                    {
                        updateCells: {
                            range: {
                                sheetId: 0
                            },
                            rows: [
                                {
                                    values: headers,
                                    // values: [
                                    //     {
                                    //         userEnteredValue: {stringValue: 'plate'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             horizontalAlignment: 'CENTER',
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     },
                                    //     {
                                    //         userEnteredValue: {stringValue: 'created'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     },
                                    //     {
                                    //         userEnteredValue: {stringValue: 'dow'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     },
                                    //     {
                                    //         userEnteredValue: {stringValue: 'day'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     },
                                    //     {
                                    //         userEnteredValue: {stringValue: 'month'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     },
                                    //     {
                                    //         userEnteredValue: {stringValue: 'year'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     },
                                    //     {
                                    //         userEnteredValue: {stringValue: 'time'},
                                    //         userEnteredFormat: {
                                    //             textFormat: {fontSize: 14},
                                    //             borders: {
                                    //                 top: {style: 'SOLID'},
                                    //                 bottom: {style: 'SOLID'},
                                    //                 left: {style: 'SOLID'},
                                    //                 right: {style: 'SOLID'}
                                    //             }
                                    //         }
                                    //     }
                                    // ]
                                }
                            ],
                            fields: 'userEnteredValue,userEnteredFormat'
                        }
                    },
                    {
                        updateSheetProperties: {
                            properties: {
                                sheetId: 0,
                                gridProperties: {
                                    frozenRowCount: 1
                                }
                            },
                            fields: 'gridProperties.frozenRowCount'
                        }
                    }
                ]
            };

            console.log(jwtToken);
            const createSheetResponse = await axios.post(url + ':batchUpdate?key=' + API_KEY, requestBody, {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(createSheetResponse.data);

            sheetId = createSheetResponse.data.replies[0].addSheet.properties.sheetId;
        }

        return sheetId;
    } catch (error) {
        console.error('Failed to get or create sheet:', error);
        toast('Failed to get or create sheet.');
        throw new Error();
    }
};

export const insertData = async (jwtToken, sheetId, rowData) => {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetId}:append?valueInputOption=RAW`;

        // Prepare the data to be inserted
        const values = rowData.map(value => [value]);

        // Create the request body
        const requestBody = {
            range: `${sheetId}!A2:G`,
            majorDimension: 'ROWS',
            values: values,
            includeValuesInResponse: false
        };

        // Make the API call to insert the data
        const response = await axios.post(url, requestBody, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Apply formatting to the inserted row
        const rowNumber = response.data.updates.updatedRange.match(/\d+/)[0];
        const range = `${sheetId}!A${rowNumber}:G${rowNumber}`;
        const formatRequest = {
            requests: [
                {
                    repeatCell: {
                        range: {
                            sheetId: sheetId,
                            startRowIndex: rowNumber - 1,
                            endRowIndex: rowNumber,
                            startColumnIndex: 0,
                            endColumnIndex: 7
                        },
                        cell: {
                            userEnteredFormat: {
                                textFormat: {fontSize: 14},
                                borders: {
                                    top: {style: 'SOLID'},
                                    bottom: {style: 'SOLID'},
                                    left: {style: 'SOLID'},
                                    right: {style: 'SOLID'}
                                }
                            }
                        },
                        fields: 'userEnteredFormat(textFormat,borders)'
                    }
                }
            ]
        };

        await axios.post(`${url}:batchUpdate`, formatRequest, {
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Data inserted successfully!');
    } catch (error) {
        // console.error('Failed to insert data:', error);
        toast('Failed to insert data.');
        throw new Error();
    }
};
