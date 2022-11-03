

//Main endpoint for movies
let endpoint = `https://green-subdued-atlasaurus.glitch.me/movies`

console.log("I am getting attached")
//All movies array
let allMovies = []

//The movie we are currently looking at
let currentMovie = null

//Add a movie
const addMovie = async (movie) => {
    try{
        let addMovieRequest = await fetch(endpoint, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(movie)
        })

        console.log("Adding movie was a success")
        console.log(addMovieRequest)
    }catch(err){
        console.error(err)
    }
}

//Pull all movies
const getMovies = async () => {
    try{
        let moviesRequest = await fetch(endpoint)
        let moviesData = await moviesRequest.json()
        allMovies = moviesData
        console.log(allMovies)
    }catch(err){
        console.error(err)
    }
}

//Update a movie
const updateMovie = async (id,movie) => {
    try{
        let updateRequest = await fetch(endpoint + `/${id}`,
            {
                method: 'PUT',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(movie)
            })

        return updateRequest
    }catch(err){
        console.error(err)
    }
}

//Delete a movie
const deleteMovie = async (id) => {
    try{
        let deleteRequest = await fetch(endpoint + `/${id}`,{
            method : 'DELETE'
        })

        return deleteRequest
    }catch(err){
        console.error(err)
    }
}


//Populate the movies div
const displayMovies = () => {
    console.log("I am running")
    const container = document.getElementById('movies')

//Clear the movies container
    container.innerHTML = ''

//Iterate through all movies
    allMovies.forEach(movie=>{

//Create the movie image
        let img = document.createElement('img')
        img.src = movie['image']

//Create the movie title
        let title = document.createElement('h3')
        title.innerText = movie['title']

//Create the movie rating
// let rating = document.createElement('h4')
// rating.innerText = movie['rating']
        let ratingComponent = pizzaRatingComponent(movie,(rating)=>{
            console.log("You clicked " + rating)
        })

//Description
        let description = document.createElement('p')
        description.innerText = movie['description']

//Create the movie card div
        let movieCard = document.createElement('div')

//Add a class for css
        movieCard.className = 'movie-card'

//Put  all the sauce together
        movieCard.appendChild(img)
        movieCard.appendChild(title)
        movieCard.appendChild(ratingComponent)
        movieCard.appendChild(description)

//Let it be like the beatles.
        container.appendChild(movieCard)
    })
}


//Pizza rating component
const pizzaRatingComponent = (movie,onRatingChange) => {
//Make the main container that will hold the pizzas for rating
    let ratingContainer = document.createElement('div')
    let currentIcons = []
    for(let i = 1; i <= 5; i++){
        if(movie['rating'] >= i){
//Draw filled icon
            let singlePizzaIcon = document.createElement('li')
            singlePizzaIcon.classList.add('fa-sharp')
            singlePizzaIcon.classList.add('fa-solid')
            singlePizzaIcon.classList.add('fa-pizza-slice')
            singlePizzaIcon.classList.add('me-1')
            singlePizzaIcon.classList.add('text-primary')
            singlePizzaIcon.setAttribute('rating',i)
            $(singlePizzaIcon).hover(e=>{
                let thisR = e.target.getAttribute('rating')
                if(movie["rating"] < thisR){
                    e.target.classList.add('text-primary')
                }else{
                    e.target.classList.remove('text-primary')
                }
            },e=>{
                let thisR = e.target.getAttribute('rating')
                if(movie["rating"] > thisR){
                    e.target.classList.add('text-primary')
                    let rightIconCount = 5 - thisR
                    for(let i = thisR - 1; i < 5; i++){
                        currentIcons[i].classList.remove('text-primary')
                    }
                }else{
                    e.target.classList.remove('text-primary')
                }
            })
            singlePizzaIcon.onclick = (e) => {
                let r = e.target.getAttribute('rating')
                console.log(r)
                onRatingChange(r)
            }
            ratingContainer.appendChild(singlePizzaIcon)
            currentIcons.push(singlePizzaIcon)
        }else{
//Draw opaque icon
            let singlePizzaIcon = document.createElement('li')
            singlePizzaIcon.classList.add('fa-solid')
            singlePizzaIcon.classList.add('fa-pizza-slice')
            singlePizzaIcon.classList.add('me-1')
            singlePizzaIcon.setAttribute('rating',i)
            $(singlePizzaIcon).hover(e=>{
                let thisR = e.target.getAttribute('rating')
                console.log(thisR)
            })
            singlePizzaIcon.onclick = (e) => {
                let r = e.target.getAttribute('rating')
                console.log(r)
                onRatingChange(r)
            }
            ratingContainer.appendChild(singlePizzaIcon)
            currentIcons.push(singlePizzaIcon)
        }
    }
    return ratingContainer
}

(async ()=>{
    await getMovies()
    displayMovies()
})()