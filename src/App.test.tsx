import React from "react";
import { act, getByText, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

test("Renders App and shows Title, Subtitle and main buttons", async () => {
    const { container } = render(<App />);
    const title = screen.getByText('Please select a .csv file with the running data');

    const subtitle = container.getElementsByClassName('subtitle')[0];

    const uploadFileButton = screen.getByLabelText('Enter .csv file');
    const analyzeDataButton = screen.getByText('Analyze data');

    expect(container.getElementsByClassName('subtitle').length).toBe(1);
    expect(title).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(uploadFileButton).toBeInTheDocument();
    expect(analyzeDataButton).toBeInTheDocument();
});

test("Should render a modal when the user click on the 'here' text in the subtitle", async () => {
    const { container } = render(<App />);

    const subtitle = container.getElementsByClassName('subtitle')[0];
    const subtitleClickeableContent = subtitle.getElementsByTagName('span')[0];

    await act( async () => {
        await userEvent.click(subtitleClickeableContent);
    });
    const modal = container.getElementsByClassName('modal')[0];

    expect(container.getElementsByClassName('modal').length).toBe(1);
    expect(modal).toBeInTheDocument();

    const closeButton = screen.getByTestId('closeButton');

    await act( async () => {
        await userEvent.click(closeButton);
    });
    

    await waitFor(() => {
        expect(modal).not.toBeInTheDocument();
    })
});

test("Should show an error message on screen if the user tries to analyze data without uploading a file", async () => {
    const { container } = render(<App />);

    const analyzeDataButton = screen.getByText('Analyze data');

    await act(async () => {
        await userEvent.click(analyzeDataButton);
    });
    

    const errorMessage = screen.getByText('PLEASE UPLOAD A FILE TO ANALYZE IT');

    expect(errorMessage).toBeInTheDocument();
});

test("Should show an error message on screen if the user tries to analyze data from a file that isn't a .csv", async () => {
    const { container } = render(<App />);

    const filename = 'Hola.png'
    const file = new File(['Hola'], filename, { type: 'image/png' });

    const input = screen.getByLabelText('Enter .csv file');

    await act(async () => {
        await userEvent.upload(input, file);
    });

    const analyzeDataButton = screen.getByText('Analyze data');
    await act(async () => {
        await userEvent.click(analyzeDataButton);
    });

    const fileTitleSelectedContainer = container.getElementsByClassName('filename-container')[0];

    expect(container.getElementsByClassName('filename-container').length).toBe(1);
    expect(fileTitleSelectedContainer.textContent).toBe(`Selected File : ${filename}`);
    expect(screen.getByText('ONLY .CSV FILES ARE ALLOWED')).toBeInTheDocument();
})

test('Should show an error message if the user tries to analyze a file with the wrong headers', async () => {
    const { container } = render(<App />);

    const mockRunningData = `asdasd,asdasd,f,g,hhhgh,jgjhghk`;

    const filename = "wrong.csv"
    const csvFile = new File([mockRunningData], filename, { type: 'text/csv' });

    const input = screen.getByLabelText('Enter .csv file');

    await act(async () => {
        await userEvent.upload(input, csvFile);
    });

    const analyzeDataButton = screen.getByText('Analyze data');
    await act(async () => {
        await userEvent.click(analyzeDataButton);
    });

    await waitFor(async () => {
        expect(screen.getByText('THE FORMAT OF THE DATA IS NOT CORRECT (MISSING HEADERS)')).toBeInTheDocument();
    });
})

test('Should show an error message if the user tries to analyze a file that is empty', async () => {
    const { container } = render(<App />);

    const mockRunningData = ``;

    const filename = "wrong.csv"
    const csvFile = new File([mockRunningData], filename, { type: 'text/csv' });

    const input = screen.getByLabelText('Enter .csv file');

    await act(async () => {
        await userEvent.upload(input, csvFile);
    });

    const analyzeDataButton = screen.getByText('Analyze data');
    await act(async () => {
        await userEvent.click(analyzeDataButton);
    });

    await waitFor(async () => {
        expect(screen.getByText('THE FILE SHOULD NOT BE EMPTY')).toBeInTheDocument();
    });
})

test("Should be render a grid after a .csv file is uploaded and the analyze button clicked", async () => {
    const { container } = render(<App />);

    const mockRunningData = `Id,UserId,StartTimeInSeconds,DurationInSeconds,DistanceInMeters,Steps,AverageSpeedInMetersPerSecond,AveragePaceInMinutesPerKilometer,TotalElevationGainInMeters,AverageHeartRateInBeatsPerMinute
    1,10,1665239344,1500,4442.99,4224,2.962,5.626829,16.02,165
    2,10,1665325877,1800,5262.85,4864,2.924,5.6999545,80.48,162
    6,10,1667740865,1800,5311.3,5084,2.951,5.6478033,7.24,167
    7,10,1667831813,540,303.52,1108,0.562,29.65599,0,112
    10,10,1668348621,1727,5004.66,4730,2.898,5.7510924,205.09,158
    `;

    const filename = "running.csv"
    const csvFile = new File([mockRunningData], filename, { type: 'text/csv' });

    const input = screen.getByLabelText('Enter .csv file');

    await act(async () => {
        await userEvent.upload(input, csvFile);
    });

    const analyzeDataButton = screen.getByText('Analyze data');
    await act(async () => {
        await userEvent.click(analyzeDataButton);
    });

    const fileTitleSelectedContainer = container.getElementsByClassName('filename-container')[0];

    await waitFor(() => {
        expect(container.getElementsByClassName('grid-container')[0]).toBeInTheDocument();
    });
    
    expect(container.getElementsByClassName('grid-container').length).toBe(1);
    expect(container.getElementsByClassName('filename-container').length).toBe(1);
    expect(fileTitleSelectedContainer.textContent).toBe(`Selected File : ${filename}`);
})
