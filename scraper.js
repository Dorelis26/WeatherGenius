
const newsKey = "bb54c478bd614fec9de8397521b91fa8";
const newsUrl = "https://newsapi.org/v2/everything?q=texas&from=2024-05-07&sortBy=Weather&apiKey=bb54c478bd614fec9de8397521b91fa8"


// Function to create a table row for each article
// Function to create a table row for each article
function createArticleRow(article) {
    // Create a new table row
    const newRow = document.createElement('tr');

    // Check if the article has an image
    const imageUrl = article.urlToImage ? article.urlToImage : './images/noun-picture-rectangle-2616531.png';

    // Populate the row with article data
    newRow.innerHTML = `
        <td><img src="${imageUrl}" alt="${article.title}" class="img-fluid" width="100"></td>
        <td>${article.title}</td>
        <td>${article.source.name}</td>
        <td>${article.description}</td>
        <td>${article.content}</td>
        <td><a href="${article.url}" target="_blank">Read more</a></td>
    `;

    return newRow;
}


// Function to fetch news data
function fetchNews(location, date) {
  // Construct the API URL with the location and date
  const newsUrl = `https://newsapi.org/v2/everything?q=${location}&from=${date}&sortBy=Weather&apiKey=bb54c478bd614fec9de8397521b91fa8`;

  // Make a GET request to the API endpoint
  axios.get(newsUrl)
      .then(function(response) {
          // Handle success, response.data will contain the news data
          const articles = response.data.articles;

          // Clear existing table rows
          const tableBody = document.querySelector('tbody');
          tableBody.innerHTML = '';

          // Iterate over the articles array and append rows to the table
          articles.forEach(function(article, index) {
              // Create a new table row for each article
              const newRow = createArticleRow(article);

              // Append the new row to the table body
              tableBody.appendChild(newRow);
          });
      })
      .catch(function(error) {
          // Handle error
          console.error('Error fetching news data:', error);
      });
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the values of the location and date inputs
  const location = document.getElementById('validationTooltip03').value;
  const date = document.getElementById('validationTooltip05').value;

  // Check if the inputs are valid
  if (this.checkValidity()) {
      // Proceed with fetching news data
      fetchNews(location, date);
  } else {
      // Form inputs are invalid, show validation feedback
      this.classList.add('was-validated');
  }
});
