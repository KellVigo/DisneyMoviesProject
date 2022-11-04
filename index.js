

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
    const container = document.getElementById('movies')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    //Clear the movies container
    container.innerHTML = ''

    //Iterate through all movies
    allMovies.forEach(movie=>{
        //Create delete icon
        let del = document.createElement('li')
        del.classList.add('fa-sharp')
        del.classList.add('fa-solid')
        del.classList.add('fa-trash')
        del.classList.add('me-1')
        del.classList.add('deleteicon')
        del.classList.add('btn')
        del.classList.add('btn-primary')

        del.onclick = async e => {
            let confirm = window.confirm(`Are you sure you want to delete ${movie.title}?`)
            if(confirm){
                await deleteMovie(movie.id)
                await getMovies()
                displayMovies()
            }
        }

        //Create update icon
        let updt = document.createElement('li')
        updt.classList.add('fa-sharp')
        updt.classList.add('fa-solid')
        updt.classList.add('fa-pen')
        updt.classList.add('me-1')
        updt.classList.add('updateicon')
        updt.classList.add('btn')
        updt.classList.add('btn-primary')
        updt.setAttribute('data-bs-toggle','modal')
        updt.setAttribute('data-bs-target','#staticBackdrop')
        //Create the movie rating
        // let rating = document.createElement('h4')
        // rating.innerText = movie['rating']
        let ratingComponent = pizzaRatingComponent(movie,(rating)=>{
            console.log("You clicked " + rating)
        })

        updt.onclick = e => {
            currentMovie = movie
            $('#movie-rating').empty()
            $('#movie-rating').append(pizzaRatingComponent(movie,(rating)=>{
                console.log("You clicked " + rating) 
            }))
            $('#movie-description').text(movie.description)
            $('#movie-title').val(movie.title)
            $('#movie-image-url').val(movie.image)
        }


        //Create the movie image
        let img = document.createElement('img')
        img.src = movie['image']
        img.classList.add('card-img-top')

        //Create the movie title
        let title = document.createElement('h3')
        title.innerText = movie['title']
        title.classList.add('card-title')



        //Description
        let description = document.createElement('p')
        description.innerText = movie['description']
        description.classList.add('card-text')
    

        //Create the movie card div
        let movieCard = document.createElement('div')
        movieCard.classList.add('card')

        //Add a class for css
        movieCard.classList.add('movie-card')

        //Put  all the sauce together
        cardBody.appendChild(del)
        cardBody.appendChild(updt)
        cardBody.appendChild(img)
        cardBody.appendChild(title)
        cardBody.appendChild(ratingComponent)
        cardBody.appendChild(description)
        movieCard.appendChild(cardBody)

        //Let it be like the beatles.
        container.appendChild(movieCard)
    })
}


//Pizza rating component
const pizzaRatingComponent = (movie,onRatingChange) => {
    //Make the main container that will hold the pizzas for rating
    let ratingContainer = document.createElement('div')
    let icons = []
    //Iterate through all the pizza icons
    for(let i = 1; i <= 5; i++){

        //Draw filled icon
        let singlePizzaIcon = document.createElement('li')
        icons.push(singlePizzaIcon)

        //Icon style
        singlePizzaIcon.classList.add('fa-sharp')
        singlePizzaIcon.classList.add('fa-solid')
        singlePizzaIcon.classList.add('fa-pizza-slice')
        singlePizzaIcon.classList.add('me-1')
        singlePizzaIcon.classList.add('pizzaicon')
        singlePizzaIcon.classList.add(movie['rating'] >= i ? 'text-primary' : 'text-black')

        //Set the rating
        singlePizzaIcon.setAttribute('rating', i)

        //Handle click event
        singlePizzaIcon.onclick = async (e) => {
            //Get the rating for the current pizza icon
            let r = Number(e.target.getAttribute('rating'))
            
            if(!currentMovie){
                //Confirm that they want to change the rating
                let confirm = window.confirm(`Are you sure you want to change the rating to ${r}?`)

                //If they confirm
                if(confirm) {

                    // $('#modal-close-btn').click()
                    //Generate an updated movie object for the current movie
                    let newMovieObject = {...movie,rating : r}

                    //Wait for the movie to get updated on the backend
                    await updateMovie(movie.id,newMovieObject)

                    //Get the list of movies again
                    await getMovies()

                    //Display the new updated list of movies
                    displayMovies()
                }
            }else{
                //show new rating but don't update
                //Get the selected rating
                let r = Number(e.target.getAttribute('rating'))
                ratingContainer.parentElement.setAttribute('rating',r)
                //Iterate through the pizza icons and update their color
                console.log("Rating should be " + r)
                icons.forEach((icon,index) => {
                    if(index < r){
                        icon.classList.add('text-primary')
                        icon.classList.remove('text-black')
                    }else{
                        icon.classList.remove('text-primary')
                        icon.classList.add('text-black')
                    }
                })
            }
        }

        //Add the pizza icon to the rating container
        ratingContainer.appendChild(singlePizzaIcon)

    }
    return ratingContainer
}

document.getElementById('modal-update-btn').onclick = async e => {
    console.log("Update button working")

    let id = currentMovie.id    
    let updatedMovie = {
        title : $('#movie-title').val(),
        description : $('#movie-description').val(),
        rating : $('#movie-rating').attr('rating'),
        image : $('#movie-image-url').val()
    }
    // console.log("Updating movie with id " + id)
    // console.log(updatedMovie)

    await updateMovie(id,updatedMovie)
    await getMovies()
    displayMovies()

    // currentMovie = null

    $('#modal-close-btn').click()

}

document.getElementById('modal-close-btn').onclick = e => {
    currentMovie = null
    console.log("Close button working")
}

(async ()=>{
    await getMovies()
    displayMovies()
})()