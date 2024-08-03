document.addEventListener('DOMContentLoaded', function(){;

    const quotes = [
       {text:"Tell me and I forget, teach me and I may remember, involve me and I learn.", category: "Motivational"}, 
       {text:"Develop a passion for learning. If you do, you will never cease to grow", category:"Motivaional"},
       {text:"He who laughs most, learns best", category:"Motivational"},
       {text:"n the end we retain from our studies only that which we practically apply", category:"Motivational"}
    ];


const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');


function showRandomQuote () {
    const randomIndex = Math.floor(math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}"- ${randomQuote.category}`;
}

showRandomQuote();

newQuoteButton.addEventListener('click', showRandomQuote);
});