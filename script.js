document.addEventListener('DOMContentLoaded', function(){;

    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
       {text:"Tell me and I forget, teach me and I may remember, involve me and I learn.", category: "Motivational"}, 
       {text:"Develop a passion for learning. If you do, you will never cease to grow", category:"Motivaional"},
       {text:"He who laughs most, learns best", category:"Motivational"},
       {text:"In the end we retain from our studies only that which we practically apply", category:"Motivational"},
       {text: "The beautiful thing about learning is nobody can take it away from you", category: "Motivational"}
    ];


const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');


function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}


function showRandomQuote () {
    const randomIndex = Math.floor(math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}"- ${randomQuote.category}`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
if (lastViewedQuote) {
    quoteDisplay.textContent = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
} else {
    showRandomQuote();
}

showRandomQuote();

newQuoteButton.addEventListener('click', showRandomQuote);

window.addQuote = function(){
    const newQuoteText = document.getElementById('newQuoteText').ariaValueMax.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Please enter both quote text and category.");
            return;
        }

        
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        saveQuotes();


       
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        quoteDisplay.textContent = `"${newQuote.text}" - ${newQuote.category}`;

};
});