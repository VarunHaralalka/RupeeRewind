// Actual inflation data for India from 1990 to 2023 (CPI-based)
const inflationDataIndia = {
    1990: 5.24, 1991: 13.88, 1992: 10.03, 1993: 8.33, 1994: 10.29,
    1995: 10.21, 1996: 9.64, 1997: 7.16, 1998: 13.15, 1999: 3.46,
    2000: 4.01, 2001: 3.77, 2002: 4.31, 2003: 3.81, 2004: 3.77,
    2005: 4.25, 2006: 6.17, 2007: 6.37, 2008: 8.35, 2009: 10.83,
    2010: 11.99, 2011: 8.87, 2012: 9.31, 2013: 9.13, 2014: 5.82,
    2015: 4.91, 2016: 4.94, 2017: 3.33, 2018: 3.95, 2019: 3.72,
    2020: 6.62, 2021: 5.13, 2022: 6.71, 2023: 5.56
};

const yearSelect = document.getElementById('year');
for (let year = 1990; year <= 2023; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
}

function calculateInflation() {
    const year = parseInt(document.getElementById('year').value);
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('inflationResult').textContent = "Please enter a valid amount.";
        return;
    }

    let cumulativeInflation = 1;
    for (let y = year; y <= 2023; y++) {
        cumulativeInflation *= (1 + inflationDataIndia[y] / 100);
    }

    const inflation2024 = 5.0; // Taking an estimate for the current year 2024
    cumulativeInflation *= (1 + inflation2024 / 100);

    const equivalentAmount = amount * cumulativeInflation;
    const increasePercentage = ((equivalentAmount - amount) / amount) * 100;

    document.getElementById('inflationResult').textContent = `Equivalent Amount in 2024: ₹${equivalentAmount.toFixed(2)}`;
    document.getElementById('inflationIncrease').textContent = `Absolute Increase: ${increasePercentage.toFixed(2)}%`;
}

function calculateFutureValue() {
    const amount = parseFloat(document.getElementById('futureAmount').value);
    const years = parseInt(document.getElementById('years').value);
    const customRate = parseFloat(document.getElementById('interestRate').value);
    const rate = isNaN(customRate) ? 5.0 : customRate; // Use 5% as the predicted rate if no custom rate is entered

    if (isNaN(amount) || amount <= 0 || isNaN(years) || years <= 0) {
        document.getElementById('futureResult').textContent = "Please enter valid values.";
        return;
    }

    const futureValue = amount * Math.pow(1 + rate / 100, years);
    const increasePercentage = ((futureValue - amount) / amount) * 100;

    document.getElementById('futureResult').textContent = `Future Value: ₹${futureValue.toFixed(2)} after ${years} years at ${rate}% rate.`;
    document.getElementById('futureIncrease').textContent = `Absolute Increase: ${increasePercentage.toFixed(2)}%`;
}
