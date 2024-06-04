// Function to create a table row for each article
function createArticleRow(article) {
    // Create a new table row
    const newRow = document.createElement('tr');

    // Populate the row with article data
    newRow.innerHTML = `
        <td>${article.headline.main}</td>
        <td>New York Times</td>
        <td>${article.abstract}</td>
        <td><a href="${article.web_url}" target="_blank">Read more</a></td>
    `;

    return newRow;
}

// Function to fetch news data from New York Times API
function fetchNews(location, startDate, endDate, apiKey) {
    // Construct the API URL with the location, start date, end date, and query parameters
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0]; // Format start date as YYYY-MM-DD
    const formattedEndDate = new Date(endDate).toISOString().split('T')[0]; // Format end date as YYYY-MM-DD
    const newsUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=glocations:("${location}")&begin_date=${formattedStartDate}&end_date=${formattedEndDate}&api-key=${apiKey}`;

    // Make a GET request to the API endpoint
    axios.get(newsUrl)
        .then(function(response) {
            // Handle success, response.data will contain the news data
            const articles = response.data.response.docs;

            // Clear existing table rows
            const tableBody = document.querySelector('tbody');
            tableBody.innerHTML = '';

            if (articles.length === 0) {
                // Display message if no articles found
                const noDataMsg = document.createElement('tr');
                noDataMsg.innerHTML = `<td colspan="4">No articles found for the given location and dates.</td>`;
                tableBody.appendChild(noDataMsg);
            } else {
                // Iterate over the articles array and append rows to the table
                articles.forEach(function(article) {
                    // Create a new table row for each article
                    const newRow = createArticleRow(article);

                    // Append the new row to the table body
                    tableBody.appendChild(newRow);
                });
            }
        })
        .catch(function(error) {
            // Handle error
            console.error('Error fetching news data:', error);
            alert("An error occurred while fetching news data. Please try again later.");
        });
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Get the values of the location, start date, and end date inputs
    const location = document.getElementById('validationTooltip03').value;
    const startDate = document.getElementById('validationTooltip05').value;
    const endDate = document.getElementById('validationTooltip07').value;
    const apiKey = "TN5W5YUnuXERFZ5eTCekuKma5qr0pMdu"; // Your New York Times API key

    // Proceed with fetching news data
    fetchNews(location, startDate, endDate, apiKey);
});
