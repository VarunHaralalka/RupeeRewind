// Inflation Data API URL
const apiUrl = 'https://api.worldbank.org/v2/country/IN/indicator/FP.CPI.TOTL.ZG?format=json';

// Fetch inflation data
async function fetchInflationData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data[1]; // The inflation data array
}

function populateYearDropdown(data) {
    const yearSelect = document.getElementById('year');
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.date;
        option.text = item.date;
        yearSelect.appendChild(option);
    });
}

function calculateInflation() {
    const year = document.getElementById('year').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (isNaN(amount) || amount <= 0) {
        document.getElementById('inflationResult').textContent = "Please enter a valid amount.";
        return;
    }

    fetchInflationData().then(data => {
        let cumulativeInflation = 1;
        let totalInflationRate = 0;
        let count = 0;

        data.forEach(item => {
            if (item.date >= year && item.date <= 2023) {
                const inflationRate = item.value / 100;
                cumulativeInflation *= (1 + inflationRate);
                totalInflationRate += inflationRate;
                count++;
            }
        });

        // Assuming a 5% inflation rate for 2024
        cumulativeInflation *= 1.05;

        const equivalentAmount = amount * cumulativeInflation;
        const increasePercentage = ((equivalentAmount - amount) / amount) * 100;
        const averageInflationRate = (totalInflationRate / count) * 100;

        document.getElementById('inflationResult').textContent = `Equivalent Amount in 2024: ₹${equivalentAmount.toFixed(2)}`;
        document.getElementById('inflationIncrease').textContent = `Absolute Increase: ${increasePercentage.toFixed(2)}%`;
        document.getElementById('averageInflationRate').textContent = `Average Inflation Rate: ${averageInflationRate.toFixed(2)}%`;

        renderInflationChart(data);
    });
}

function renderInflationChart(data) {
    const ctx = document.getElementById('inflationChart').getContext('2d');
    const years = data.map(item => item.date).reverse();
    const values = data.map(item => item.value).reverse();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Inflation Over Time (%)',
                data: values,
                borderColor: 'rgba(66,153,246,1)',
                backgroundColor: 'rgba(66,153,246,0.2)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Inflation (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

function calculateFutureValue() {
    const amount = parseFloat(document.getElementById('futureAmount').value);
    const years = parseInt(document.getElementById('years').value);
    const customRate = parseFloat(document.getElementById('interestRate').value);
    const rate = isNaN(customRate) ? 5.0 : customRate; // Use 5% as default if no custom rate is entered

    if (isNaN(amount) || amount <= 0 || isNaN(years) || years <= 0) {
        document.getElementById('futureResult').textContent = "Please enter valid values.";
        return;
    }

    const futureValue = amount * Math.pow(1 + rate / 100, years);
    const increasePercentage = ((futureValue - amount) / amount) * 100;

    document.getElementById('futureResult').textContent = `Future Value: ₹${futureValue.toFixed(2)} after ${years} years at ${rate}% rate.`;
    document.getElementById('futureIncrease').textContent = `Absolute Increase: ${increasePercentage.toFixed(2)}%`;

    renderFutureValueChart(years, amount, futureValue, rate);
}

function renderFutureValueChart(years, initialValue, finalValue, rate) {
    const ctx = document.getElementById('futureChart').getContext('2d');
    const labels = [];
    const values = [];

    for (let i = 0; i <= years; i++) {
        labels.push(`Year ${i}`);
        values.push(initialValue * Math.pow(1 + rate / 100, i));
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Future Value Over Time (₹)',
                data: values,
                borderColor: 'rgba(36,77,118,1)',
                backgroundColor: 'rgba(36,77,118,0.2)',
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value (₹)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

fetchInflationData().then(data => {
    populateYearDropdown(data);
});
