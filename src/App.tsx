import React, { ChangeEvent, useState } from "react";
import "./App.css";

import { Grid } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";

import Papa from 'papaparse';

import { ALLOWEDFILEEXTENSIONS, FIELDSINDEXES } from "./constants/app.contant";

function App() {
	const [headers, setHeaders] = useState<string[]>([]);
	const [rowsData, setRowsData] = useState<string[][]>([]);
	const [error, setError] = useState('');

	const [file, setFile] = useState<File>();
	const [fileExtension, setFileExtension] = useState('');
	const [filename, setFilename] = useState('');

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if(!e.target.files?.length) {
			setError('File not entered');
			return;
		}

		const fileFromInput = e.target.files[0];
		const _fileExtension = fileFromInput.type.split('/')[1];
		setFilename(fileFromInput.name);
		setFileExtension(_fileExtension);
		setFile(fileFromInput);
		setError('');
	}

	async function parseDataToGrid() {
		if(!file) {
			setError('Please upload a file to analize it');
			return;
		}

		if(!ALLOWEDFILEEXTENSIONS.includes(fileExtension)) {
			setError('ONLY .CSV FILES ARE ALLOWED');
			return;
		}

		Papa.parse(file, {
			complete: (results) => {
				const _headers = results.data[0] as string[];
				_headers.splice(0, 0, 'Suspicious')
				_headers.splice(1, 0, 'Reason')


				const _rowsRawData = results.data.slice(1);
				const _rowsData = _rowsRawData.map((row) => {
					const { isSuspicious, reason } = checkDataForCheating(row as string[]);
					let newRow = [...row as string[]];
					newRow.splice(0, 0, isSuspicious ? 'Yes' : 'No');
					newRow.splice(1, 0, reason ? reason : 'Fine!');
					return newRow;
				})
				console.log(_rowsData);
				setHeaders(_headers);
				setRowsData(_rowsData);
			},
			
		});
	}

	function checkDataForCheating(rowToCheck: string[]) {
		let isSuspicious = false;
		let reason = '';

		//Check if any field is empty
		if (rowToCheck.includes('')) {
			
			isSuspicious = rowToCheck.includes('');
			reason = 'Some fields have missing data';
			
		//Check that the BPM are at least 100
		} else if(Number(rowToCheck[FIELDSINDEXES.AverageHeartRateInBeatsPerMinute]) < 100) {
			isSuspicious = true;
			reason = "BPM are too low";

		//Step length oddly large	
		} else if(Number(rowToCheck[FIELDSINDEXES.DistanceInMeters])/Number(rowToCheck[FIELDSINDEXES.Steps]) > 1.35) {
			isSuspicious = true;
			reason = "Step length is oddly large"

		//Step length oddly short	
		} else if(Number(rowToCheck[FIELDSINDEXES.DistanceInMeters])/Number(rowToCheck[FIELDSINDEXES.Steps]) < 0.5) {
			isSuspicious = true;
			reason = "Step length is oddly short"
		}

		return {
			isSuspicious,
			reason
		}
	}

    return (
        <div className="App h-screen">
			{ !!rowsData.length &&
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
							'text-align': 'center',
						},
						td: {
							'text-align': 'center',
							'min-width': '100px'
						}
					}}
				/>
            </div>
			}
			<div className="file-pick-container h-full flex flex-col justify-center items-center">
				<h1 className="text-xl font-semibold">Please select a .csv file with the running data</h1>
				<h3 className="text-sm italic">Click <u>here</u> to find out what data is needed</h3>
				<div className="file-picker flex flex-col justify-center items-center my-10">
					<label className="block px-16 py-2 rounded-xl font-semibold bg-gray-200" htmlFor="csvInput">
						Enter .csv file
					</label>
					{
						filename &&
						<div className="filename-container">
							Selected File : <span className=" font-semibold">{filename}</span>
						</div>
					}
					<input 
						className="hidden"
						onChange={handleFileChange}
						type="file" 
						name="file" 
						id="csvInput"
					/>
					<button onClick={parseDataToGrid} className="my-3 px-4 py-2 bg-gray-200 shadow-xl border rounded-xl font-medium active:bg-gray-300" type="button">Analyze data</button>
					{ error &&
						<div className="error-container">
							<div className="text-red-600">
								{error}
							</div>
						</div>
					}
				</div>
			</div>
        </div>
    );
}

export default App;