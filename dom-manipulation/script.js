document.addEventListener('DOMContentLoaded', () => {
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" },
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const formContainer = document.getElementById('formContainer');
    const notification = document.getElementById('notification');
  
    function showRandomQuote() {
        const filteredQuotes = getFilteredQuotes();
        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = 'No quotes available for the selected category.';
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        displayRandomQuote(randomQuote);
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
    }
  
    function displayRandomQuote(quote) {
        while (quoteDisplay.firstChild) {
            quoteDisplay.removeChild(quoteDisplay.firstChild);
        }
  
        const quoteText = document.createElement('p');
        quoteText.textContent = quote.text;
        const quoteCategory = document.createElement('p');
        quoteCategory.textContent = `- ${quote.category}`;
        quoteDisplay.appendChild(quoteText);
        quoteDisplay.appendChild(quoteCategory);
    }
  
    function createAddQuoteForm() {
        while (formContainer.firstChild) {
            formContainer.removeChild(formContainer.firstChild);
        }
  
        const newQuoteText = document.createElement('input');
        newQuoteText.id = 'newQuoteText';
        newQuoteText.type = 'text';
        newQuoteText.placeholder = 'Enter a new quote';
  
        const newQuoteCategory = document.createElement('input');
        newQuoteCategory.id = 'newQuoteCategory';
        newQuoteCategory.type = 'text';
        newQuoteCategory.placeholder = 'Enter quote category';
  
        const addQuoteButton = document.createElement('button');
        addQuoteButton.textContent = 'Add Quote';
        addQuoteButton.addEventListener('click', addQuote);
  
        formContainer.appendChild(newQuoteText);
        formContainer.appendChild(newQuoteCategory);
        formContainer.appendChild(addQuoteButton);
    }
  
    async function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
        if (newQuoteText && newQuoteCategory) {
            const newQuote = { text: newQuoteText, category: newQuoteCategory };
            quotes.push(newQuote);
            saveQuotes();
            updateCategoryFilter();
            createAddQuoteForm(); // Reset the form after adding a quote
            showNotification('Quote added successfully!');
            await postQuoteToServer(newQuote);
        } else {
            showNotification('Please enter both a quote and a category.');
        }
    }
  
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }
  
    function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", "quotes.json");
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
  
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            updateCategoryFilter();
            showNotification('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }
  
    function getCategories() {
        const categories = quotes.map(quote => quote.category);
        return ['all', ...new Set(categories)];
    }
  
    function updateCategoryFilter() {
        const categories = getCategories();
        categoryFilter.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        const lastSelectedCategory = localStorage.getItem('selectedCategory') || 'all';
        categoryFilter.value = lastSelectedCategory;
    }
  
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('selectedCategory', selectedCategory);
        showRandomQuote();
    }
  
    function getFilteredQuotes() {
        const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
        return selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    }
  
    function populateCategories() {
        const uniqueCategories = getCategories();
        uniqueCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
  
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();
            const serverQuoteTexts = serverQuotes.map(quote => quote.text);
            let hasUpdates = false;
  
            serverQuotes.forEach(serverQuote => {
                if (!quotes.some(localQuote => localQuote.text === serverQuote.text)) {
                    quotes.push({ text: serverQuote.body, category: 'Server' });
                    hasUpdates = true;
                }
            });
  
            if (hasUpdates) {
                saveQuotes();
                updateCategoryFilter();
                showNotification('Quotes updated from server!');
                alert('Quotes updated from server!');
            }
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            showNotification('Error fetching quotes from server.');
            alert('Error fetching quotes from server.');
        }
    }
  
    async function postQuoteToServer(quote) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quote)
            });
            const data = await response.json();
            console.log('Posted new quote to server:', data);
        } catch (error) {
            console.error('Error posting quote to server:', error);
            showNotification('Error posting quote to server.');
            alert('Error posting quote to server.');
        }
    }
  
    async function syncQuotes() {
        await fetchQuotesFromServer();
  
        quotes.forEach(quote => {
            if (!quote.synced) {
                postQuoteToServer(quote).then(() => {
                    quote.synced = true;
                    saveQuotes();
                });
            }
        });
  
        showNotification('Quotes synced with server!');
        alert('Quotes synced with server!');
    }
  
    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000); 
    }
  
    newQuoteButton.addEventListener('click', showRandomQuote);
    exportQuotesButton.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
  
    updateCategoryFilter();
    createAddQuoteForm();
    showRandomQuote();
  
    setInterval(syncQuotes, 10 * 60 * 1000); 
  });