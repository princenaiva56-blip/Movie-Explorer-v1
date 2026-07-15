const userInput = document.querySelector(".search");
const btnEl = document.querySelector(".submit");
const loading = document.querySelector(".loading");
const title = document.getElementById("movie-title");
const menu = document.querySelector(".menu");
const year = document.getElementById("year");
const genre = document.getElementById("genre");
const rating= document.getElementById("rating");
const runtime = document.getElementById("runtime");
const plot = document.getElementById("plot");
const page = document.querySelector(".app");
const histButton = document.querySelector(".history-btn");
const historyCard = document.querySelector(".historyCard");

btnEl.addEventListener("click", () => {
    if(userInput.value.trim() === ""){
        userInput.placeholder = "Enter a movie!";
        userInput.classList.add("error")
        
        return;
    }
    else{
         getMovie();
    }

});

userInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        btnEl.click();
    }
});

window.addEventListener("DOMContentLoaded", () => {
    const lastMovie = localStorage.getItem("movie");

    if(lastMovie){
        userInput.value = lastMovie;
        getMovie(lastMovie);
    }
    else if(data.response === "False"){
        return;
    }
    
});

histButton.addEventListener("click", () => {
    historyCard.style.display = "flex";
    movieHistory();
});

menu.addEventListener("click", (e) => {
    e.stopPropagation();

    historyCard.style.display ="flex"
    movieHistory();
});


document.addEventListener("click", (e) => {
    if(
        !historyCard.contains(e.target) && 
        !histButton.contains(e.target)
    ){
        historyCard.style.display = "none";
    }
});

async function getMovie(){
    
    loading.textContent = "Loading..."
    try{
        const response = await fetch(`https://omdbapi.com/?apikey=d78a801d&t=${userInput.value}`);
       
        
        const data = await response.json();
        console.log("data:", data);

        if (data.Response === "False") {
            throw new Error(data.Error);
        }
        localStorage.setItem("movie", userInput.value);
        saveMovieHistory(userInput.value);
        displayMovie(data);
    }
    catch (error){
        page.textContent = error.message;
        
    }
    loading.textContent ="";
    userInput.value = "";
}

function displayMovie(data){
        const poster = document.querySelector("#poster");
        if (data.Poster !== "N/A") {
            poster.src = data.Poster; 
            
        }

        title.textContent = `Title: ${data.Title}`;
        year.innerHTML = `<span class ="subhead">Year :</span> ${data.Year}`;
        genre.innerHTML = `<span class ="subhead">Genre :</span> ${data.Genre}`;
        rating.innerHTML = `⭐⭐⭐: ${data.Ratings[0].Value}`;
        runtime.innerHTML = `<span class ="subhead">Runtime :</span> ${data.Runtime}`;
        plot.innerHTML = `<span class ="subhead">Plot :</span> ${data.Plot}`;
}

function clearMovie(data){
    const poster = document.querySelector("#poster");
        if (data.Poster !== "N/A") {
            poster.src = ""; 
            
        }

        title.textContent = "";
        year.textContent = "";
        genre.textContent = "";
        rating.textContent = "";
        runtime.textContent = "";
        plot.textContent = "";
}

function saveMovieHistory(movie) {

    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Remove duplicate if it already exists
    history = history.filter(item => item !== movie);

    // Add newest movie to top
    history.unshift(movie);

    // Keep only latest 10 searches
    history = history.slice(0, 10);

    localStorage.setItem("history", JSON.stringify(history));

}

function movieHistory(){
    historyCard.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("history")) || [];

    if(history.length === 0){
        historyCard.innerHTML = "No Search History"
    }

    history.forEach((movie, index) => {
        
        const li = document.createElement("li");
        li.classList.add("list")
        li.innerHTML =`
        <div class = "hist-movie"> ${movie}</div>
        <button class = "delete" data-index ="${index}"> x </button>
        `

        li.addEventListener("click", (e) => {
            if(e.target.classList.contains("delete")){
                return;
            }

            userInput.value = movie;
            historyCard.style.display = "none";
            getMovie(movie);
        });

        historyCard.appendChild(li);
        
    });
}

//deleting search history by index

historyCard.addEventListener("click", (e) => {
    

    if(e.target.classList.contains("delete")){
        e.stopPropagation();

        let history = JSON.parse(localStorage.getItem("history"));
        const index = Number(e.target.dataset.index);
    
        history.splice(index, 1);
        

        localStorage.setItem("history", JSON.stringify(history));
        movieHistory();

    }

});

