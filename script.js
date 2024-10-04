const apiKey = 'AIzaSyBnls-lLepKLZ_f65ZUedf6c_aYS93VWFs'; // Make sure the API key is valid
const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const favoriteBooks = document.getElementById('favoriteBooks');

// Function to search for books from Google Books API
function searchBooks(query = '') {
    query = query || searchInput.value.trim(); // Use the input value or provided default query
    if (!query) {
        alert('Please enter a search term.');
        return;
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                displayBooks(data.items);
            } else {
                bookList.innerHTML = `<p>No books found for "${query}".</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            bookList.innerHTML = `<p>Sorry, an error occurred: ${error.message}</p>`;
        });
}

// Function to display the books in the UI
function displayBooks(books) {
    bookList.innerHTML = ''; // Clear previous results

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        const title = book.volumeInfo.title || 'No title';
        const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown Author';
        const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';
        const description = book.volumeInfo.description ? book.volumeInfo.description.substring(0, 100) + '...' : 'No description available';

        bookCard.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
            <p>by ${author}</p>
            <button onclick="addToFavorites('${title}', '${author}', '${thumbnail}')">Add to Favorites</button>
        `;

        bookList.appendChild(bookCard);
    });
}

// Function to add a book to the favorites list
function addToFavorites(title, author, thumbnail) {
    const favoriteBookCard = document.createElement('div');
    favoriteBookCard.className = 'book-card';

    favoriteBookCard.innerHTML = `
        <img src="${thumbnail}" alt="${title}">
        <h3>${title}</h3>
        <p>by ${author}</p>
    `;

    favoriteBooks.appendChild(favoriteBookCard);
}

// Perform a default search for "Macbeth" on page load
window.onload = function() {
    searchInput.value = 'Macbeth'; // Set default search input
    searchBooks('Macbeth'); // Perform default search
};
