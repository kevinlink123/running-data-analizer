import React, { ChangeEvent, useState } from "react";
import "./App.css";

import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";

import Papa from "papaparse";

import { ALLOWEDFILEEXTENSIONS, FIELDSINDEXES, REQUIREDFIELDNAMES } from "./constants/app.contant";
import Modal from "./components/modal/Modal";

function App() {
    const [headers, setHeaders] = useState<string[]>([]);
    const [rowsData, setRowsData] = useState<string[][]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState("");

    const [file, setFile] = useState<File>();
    const [fileExtension, setFileExtension] = useState("");
    const [filename, setFilename] = useState("");

    const [modalOpen, setModalOpen] = useState(false);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length) {
            setError("FILE NOT ENTERED");
            return;
        }

        const fileFromInput = e.target.files[0];
        const _fileExtension = fileFromInput.type.split("/")[1];
        setFilename(fileFromInput.name);
        setFileExtension(_fileExtension);
        setFile(fileFromInput);
        setError("");
    }

    async function parseDataToGrid() {
        if (!file) {
            setError("PLEASE UPLOAD A FILE TO ANALYZE IT");
            return;
        }

        if (!ALLOWEDFILEEXTENSIONS.includes(fileExtension)) {
            setError("ONLY .CSV FILES ARE ALLOWED");
            return;
        }

        Papa.parse(file, {
            complete: (results) => {
                setLoadingData(true);
                if(results.data.length === 0) {
                    setError('THE FILE SHOULD NOT BE EMPTY');
                    return;
                }
                const _headers = results.data[0] as string[];
                const isSomeHeaderMissing = _headers.some((e, i) => {
                    return !(REQUIREDFIELDNAMES[i as keyof typeof REQUIREDFIELDNAMES] === e);
                });

                if(isSomeHeaderMissing) {
                    setError('THE FORMAT OF THE DATA IS NOT CORRECT (MISSING HEADERS)');
                    return;
                }

                console.log(isSomeHeaderMissing);

                _headers.splice(0, 0, "Suspicious");
                _headers.splice(1, 0, "Reason");

                const _rowsRawData = results.data.slice(1);
                const _rowsData = _rowsRawData.map((row) => {
                    const { isSuspicious, reason } = checkDataForCheating(
                        row as string[]
                    );
                    let newRow = [...(row as string[])];
                    newRow.splice(0, 0, isSuspicious ? "Yes" : "No");
                    newRow.splice(1, 0, reason ? reason : "Fine!");
                    return newRow;
                });
                setHeaders(_headers);
                setRowsData(_rowsData);
                setLoadingData(false);
            },
        });
    }

    function checkDataForCheating(rowToCheck: string[]) {
        let isSuspicious = false;
        let reason = "";

        //Check if any field is empty
        if (rowToCheck.includes("")) {
            isSuspicious = rowToCheck.includes("");
            reason = "Some fields have missing data";

            //Check that the BPM are at least 100
        } else if (Number(rowToCheck[FIELDSINDEXES.AverageHeartRateInBeatsPerMinute]) < 100) {
            isSuspicious = true;
            reason = "BPM are too low";

            //Step length oddly large
        } else if (Number(rowToCheck[FIELDSINDEXES.DistanceInMeters]) / Number(rowToCheck[FIELDSINDEXES.Steps]) > 1.35) {
            isSuspicious = true;
            reason = "Step length is oddly large";

            //Step length oddly short
        } else if (Number(rowToCheck[FIELDSINDEXES.DistanceInMeters]) / Number(rowToCheck[FIELDSINDEXES.Steps]) <0.5) {
            isSuspicious = true;
            reason = "Step length is oddly short";
        }

        return {
            isSuspicious,
            reason,
        };
    }

    return (
        <div className="App h-screen">
            {!!rowsData.length && 
                (loadingData ? <div>LOADING...</div> :
                <div className="grid-container mx-10">
                    <Grid
                        data={rowsData}
                        columns={headers}
                        search={true}
                        pagination={{
                            limit: 10,
                        }}
                        autoWidth={true}
                        style={{
                            th: {
                                "text-align": "center",
                            },
                            td: {
                                "text-align": "center",
                                "min-width": "100px",
                            },
                        }}
                    />
                </div>)
            }
            <div className="file-pick-container h-full flex flex-col justify-center items-center">
                <h1 className="title text-xl font-semibold">
                    Please select a .csv file with the running data
                </h1>
                <h3 className="subtitle text-sm italic">
                    Click <span onClick={() => setModalOpen(true)} className="cursor-pointer underline">here</span>{" "}
                    to find out what data is needed
                </h3>

                <div className="file-picker flex flex-col justify-center items-center my-10">
                    <label
                        className="block px-16 py-2 rounded-xl font-semibold bg-gray-200 transition ease-in-out hover:scale-110 hover:-translate-y-2 active:scale-90"
                        htmlFor="csvInput"
                    >
                        Enter .csv file
                    </label>
                    {filename && (
                        <div className="filename-container">
                            Selected File :{" "}
                            <span className=" font-semibold">{filename}</span>
                        </div>
                    )}
                    <input
                        className="csv-input hidden"
                        onChange={handleFileChange}
                        type="file"
                        name="file"
                        id="csvInput"
                    />
                    <button
                        onClick={parseDataToGrid}
                        className="my-3 px-4 py-2 bg-gray-200 shadow-xl border rounded-xl font-medium active:bg-gray-300 active:scale-95"
                        type="button"
                    >
                        Analyze data
                    </button>
                    {error && (
                        <div className="error-container">
                            <div className="text-red-600">{error}</div>
                        </div>
                    )}
                    { modalOpen &&
                        <Modal handleClose={() => setModalOpen(false)}>
                            <h1 className="text-2xl mb-8 uppercase font-medium">Datos Necesarios para el Analisis</h1>
							<p className="my-2 mx-16 text-left"><span className="font-bold">ID</span>: The record's id</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">UserID</span>: The id of the user that created the record</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">StartTimeInSeconds</span>: The timestamp of the record</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">DurationInSeconds</span>: The exercise's duration in seconds</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">DistanceInMeters</span>: The distance traveled in meters</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">Steps</span>: the number of steps the user took during the exercise session</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">AverageSpeedInMetersPerSecond</span>: Average user speed during the session expressed in m/s</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">AveragePaceInMinutesPerKilometer</span>: It's the time that took the user to run or walk a kilometer expressed in minutes</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">TotalElevationGainInMeters</span>: The elevation gain refers to the sum of every gain in elevation throughout an entire trip</p>
							<p className="my-2 mx-16 text-left"><span className="font-bold">AverageHeartRateInBeatsPerMinute</span>: The average Beats Per Minute of the user for the exercise session</p>
							<p className="italic font-medium mt-12">Feel free to add any data field that you want, those will be showned on the grid as well but will not change the analysis</p>
                        </Modal>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
