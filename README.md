# Running Data Analizer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The Running Data Analizer App its builded using React.JS and Tailwind CSS with the aim to analize and discover running data records from users that is suspicious in various ways.\
The app receives a .csv file with the records from the users and analize them in real time in the browser and put them in a table with the fields provided in the file and two new: a 'Suspicious' field that tells the user if the record has something weird in their data, and a 'Reason' field that explains the reason for the record to be considered as suspicious.

For now there are a couple of reasons for a record to be considered suspicious:
- If there is at least one field that doesn't have any data.
- The BPM during the exercise session are below 100.
- Step length is too short, below 0.5 mts.
- Step length is too large, larger than 1.35 mts (en este articulo determinan que la distancia recorrida por un paso de un corredor profesional está entre 1.89 y 2.08 mts https://www.econathletes.com/post/math-for-sprinters-steps-per-second-and-stride-length)

## Setup

1 - Download the repository to your local machine.\
2 - Run `npm i` inside directory you just downloaded.\
3 - Run `npm run start` to start the development server.\
4 - Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.