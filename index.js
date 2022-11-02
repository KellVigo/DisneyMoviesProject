let endpoint = `https://green-subdued-atlasaurus.glitch.me/movies`

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
        console.log(moviesData)
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

        console.log(updateRequest)
    }catch(err){
        console.error(err)
    }
}

//Delete a moview
const deleteMovie = async (id) => {
    try{
        let deleteRequest = await fetch(endpoint + `/${id}`,{
            method : 'DELETE'
        })

        console.log(deleteRequest)
    }catch(err){
        console.error(err)
    }
}



(()=>{
    
})