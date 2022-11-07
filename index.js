(() => {

    //Main endpoint for movies
    let endpoint = `https://green-subdued-atlasaurus.glitch.me/movies`

    console.log("I am getting attached")
    //All movies array
    let allMovies = []

    //The movie we are currently looking at
    let currentMovie = null

    //The genre filter
    let genreFilter = 'all'

    //Modal mode
    let modalMode = 'update'

    //Add a movie
    const addMovie = async (movie) => {
        try {
            let addMovieRequest = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movie)
            })

            console.log("Adding movie was a success")
            console.log(addMovieRequest)
        } catch (err) {
            console.error(err)
        }
    }

    //Pull all movies
    const getMovies = async () => {
        try {
            let moviesRequest = await fetch(endpoint)
            let moviesData = await moviesRequest.json()
            fullMovieData = moviesData
            allMovies = moviesData
            console.log(allMovies)
        } catch (err) {
            console.error(err)
        }
    }

    //Update a movie
    const updateMovie = async (id, movie) => {
        try {
            let updateRequest = await fetch(endpoint + `/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(movie)
            })

            return updateRequest
        } catch (err) {
            console.error(err)
        }
    }

    //Delete a movie
    const deleteMovie = async (id) => {
        try {
            let deleteRequest = await fetch(endpoint + `/${id}`, {
                method: 'DELETE'
            })

            return deleteRequest
        } catch (err) {
            console.error(err)
        }
    }

    const generateMovieDeleteBtn = (cardBody, movie) => {
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
            if (confirm) {
                await deleteMovie(movie.id)
                await getMovies()
                displayMovies()
            }
        }

        cardBody.appendChild(del)
    }

    const handleUpdateButtonClick = (movie) => {
        currentMovie = movie //Set the current movie to this one
        modalMode = 'update' //Set the modal mode to update
        $('#modal-title').text("Update Movie") //Change the modal title
        $('#modal-action-btn').text("Update") //Change the modal action button to update
        $('#movie-rating').empty() ///Empty the rating component on the modal
        //Add it back with the rating for the current movie
        $('#movie-rating').append(pizzaRatingComponent(movie, (rating) => {
            console.log("You clicked " + rating)
        }))
        //Set the description
        $('#movie-description').val(movie.description ? movie.description : '')
        //Set the title
        $('#movie-title').val(movie.title ? movie.title : '')
        //Set the image URL
        $('#movie-image-url').val(movie.image ? movie.image : '')
    }

    const generateMovieUpdateBtn = (cardBody, movie) => {
        //Create update icon
        let updt = document.createElement('li')
        updt.classList.add('fa-sharp')
        updt.classList.add('fa-solid')
        updt.classList.add('fa-pen')
        updt.classList.add('me-1')
        updt.classList.add('updateicon')
        updt.classList.add('btn')
        updt.classList.add('btn-primary')
        updt.setAttribute('data-bs-toggle', 'modal')
        updt.setAttribute('data-bs-target', '#staticBackdrop')
        //Create the movie rating
        // let rating = document.createElement('h4')
        // rating.innerText = movie['rating']


        //When the user clicks the update button
        updt.onclick = () => handleUpdateButtonClick(movie)

        //Append the update button to the card
        cardBody.appendChild(updt)

    }

    const generateMovieImage = (cardBody, movie) => {
        //Create the movie image
        let img = document.createElement('img')
        img.src = movie['image']
        img.classList.add('card-img-top', "img-thumbnail", "movie-image")

        //Append the movie image to the card body
        cardBody.appendChild(img)
    }

    const generateMovieTitle = (cardBody, movie) => {
        //Create the movie title
        let title = document.createElement('h5')
        title.innerText = movie['title']
        title.classList.add('card-title')

        //Add the title to the card body
        cardBody.appendChild(title)
    }

    const generateRatingComponent = (cardBody, movie) => {
        //generate the rating component
        let ratingComponent = pizzaRatingComponent(movie, (rating) => {
            console.log("You clicked " + rating)
        })

        //add the rating component to the card
        cardBody.appendChild(ratingComponent)
    }

    const generateMovieDescription = (cardBody, movie) => {
        //Description
        let description = document.createElement('p')
        description.innerText = movie['description']
        description.classList.add('card-text', "p-4", "card-description")

        //Add the description to the card body
        cardBody.appendChild(description)
    }

    const generateMovieCard = (movie, container) => {
        const cardBody = document.createElement('div')
        cardBody.style.zIndex = 2
        cardBody.classList.add('card-body')

        //generate the movie image component
        generateMovieImage(cardBody, movie)

        //generate the movie title component
        generateMovieTitle(cardBody, movie)

        //generate the rating component
        generateRatingComponent(cardBody, movie)

        //generate the movie description component
        generateMovieDescription(cardBody, movie)

        //generate the delete button for the current card
        generateMovieDeleteBtn(cardBody, movie)

        //generate the update button for the current card
        generateMovieUpdateBtn(cardBody, movie)

        //Create the movie card div
        let movieCard = document.createElement('div')
        movieCard.classList.add('card', "mt-2", "mb-2", "mx-1", "col-12", "col-md-5", "col-lg-3", "col-xl-2")
        movieCard.style.position = 'relative'

        let movieCardBg = document.createElement('img')
        movieCardBg.style.position = 'absolute'
        movieCardBg.style.left = '0px'
        movieCardBg.style.top = '0px'
        movieCardBg.style.width = '100%'
        movieCardBg.style.height = '100%'
        movieCardBg.style.opacity = '0.2'
        movieCardBg.style.zIndex = 0
        movieCardBg.src = movie.image
        movieCard.append(movieCardBg)
        // movieCard.style.background = "url('" + movie.image + "')";
        // movieCard.style.backgroundSize = "cover"
        // movieCard.style.backgroundBlendMode = 'subtraction'

        //Add a class for css
        movieCard.classList.add('movie-card')

        //Put  all the sauce together
        movieCard.appendChild(cardBody)

        //Let it be like the beatles.
        container.append(movieCard)
    }

    //Populate the movies div
    const displayMovies = () => {
        // if(genreFilter != 'all'){
        //     //Filter the movies by the genre
        //     allMovies = allMovies.filter(i=>{
        //         i.genre == filter
        //     })
        // }

        //Grab on to the movies container
        const container = document.getElementById('movies')

        //Clear the movies container
        container.innerHTML = ''

        //Iterate through all movies
        allMovies.forEach(movie => {
            generateMovieCard(movie, container)
        })
    }

    let fullMovieData

    $('#searchbox').on('change', e => {
        if (e.target.value.length > 0) {
            console.log(e)
            allMovies = allMovies.filter(i => (i.title.toLowerCase().includes($(e.target).val().toLowerCase())))
            displayMovies()
        } else {
            allMovies = fullMovieData
            displayMovies()
        }
    })


    //Pizza rating component
    const pizzaRatingComponent = (movie, onRatingChange) => {
        //Make the main container that will hold the pizzas for rating
        let ratingContainer = document.createElement('div')
        ratingContainer.classList.add('rating-container')
        let icons = []
        //Iterate through all the pizza icons
        for (let i = 1; i <= 5; i++) {

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

                if (!currentMovie) {
                    //Confirm that they want to change the rating
                    let confirm = window.confirm(`Are you sure you want to change the rating to ${r}?`)

                    //If they confirm
                    if (confirm) {

                        // $('#modal-close-btn').click()
                        //Generate an updated movie object for the current movie
                        let newMovieObject = {
                            ...movie,
                            rating: r
                        }

                        //Wait for the movie to get updated on the backend
                        await updateMovie(movie.id, newMovieObject)

                        //Get the list of movies again
                        await getMovies()

                        //Display the new updated list of movies
                        displayMovies()
                    }
                } else {
                    //show new rating but don't update

                    //Get the selected rating
                    let r = Number(e.target.getAttribute('rating'))
                    ratingContainer.parentElement.setAttribute('rating', r)

                    //Iterate through the pizza icons and update their color
                    icons.forEach((icon, index) => {
                        if (index < r) {
                            icon.classList.add('text-primary')
                            icon.classList.remove('text-black')
                        } else {
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

    document.getElementById('modal-action-btn').onclick = async e => {
        if (modalMode == 'update') {
            console.log("Update button working")

            let id = currentMovie.id
            let updatedMovie = {
                title: $('#movie-title').val(),
                description: $('#movie-description').val(),
                rating: $('#movie-rating').attr('rating'),
                image: $('#movie-image-url').val()
            }
            // console.log("Updating movie with id " + id)
            // console.log(updatedMovie)

            await updateMovie(id, updatedMovie)
            await getMovies()
            displayMovies()

            // currentMovie = null

            $('#modal-close-btn').click()
        } else {
            ///Add a new movie
            console.log("Adding a new movie")
            let title = $('#movie-title').val()
            let desc = $('#movie-description').val()
            let rating = $('#movie-rating').attr('rating')
            let imgSrc = $('#movie-image-url').val()
            const newMovieModel = {
                title: title,
                description: desc,
                rating: Number(rating),
                image: imgSrc
            }
            await addMovie(newMovieModel)
            $('#modal-close-btn').click()
            clearModal()
            await getMovies()
            displayMovies()

        }

    }

    document.getElementById('add-movie-btn').onclick = async e => {
        modalMode = 'add'

        //Set the current movie to an empty movie
        currentMovie = {
            title: '',
            description: '',
            rating: 0,
        }

        clearModal()
        $('#modal-title').text("Add New Movie")
        $('#modal-action-btn').text("Add")
        $('#movie-rating').empty()
        $('#movie-rating').append(pizzaRatingComponent(currentMovie, (rating) => {
            console.log("You clicked " + rating)
        }))
    }

    const clearModal = () => {
        $('#movie-title').val('')
        $('#movie-description').val('')
        $('#movie-image-url').val('')
    }

    document.getElementById('modal-close-btn').onclick = e => {
        currentMovie = null
        console.log("Close button working")

    }

    const displayLoader = () => {
        //Create the loader container
        const loader = document.createElement('div')
        loader.classList.add('loader')
        loader.classList.add('w-100')
        loader.classList.add('h-100')
        loader.classList.add('d-flex')
        loader.classList.add('flex-col')
        loader.classList.add('justify-content-center')
        loader.classList.add('align-items-center')

        const loadingLabel = document.createElement('h3')
        loadingLabel.classList.add('me-5')
        loadingLabel.innerText = "Loading..."

        //Create the pizza slice icon
        const pizzaSliceIcon = document.createElement('li')
        pizzaSliceIcon.classList.add('fa-solid')
        pizzaSliceIcon.classList.add('fa-pizza-slice')
        pizzaSliceIcon.classList.add('spinning')
        pizzaSliceIcon.style.fontSize = '120'

        //Add the loading label
        loader.appendChild(loadingLabel)
        // loader.appendChild(document.createElement('br'))
        //Add the pizza slice icon to the loader container
        loader.appendChild(pizzaSliceIcon)


        const container = document.getElementById('movies')
        container.appendChild(loader)

    }


    $(".dropdown-item").click(function () { //Genre option on menu is clicked
        let option = $(this).text()
        console.log(`You want ${option.split(' ')[0].toLowerCase()} movies`)

        //Deactivate all the menu options
        let genreMenu = Array.from($('#genre-menu')[0].children)
        genreMenu.forEach(item => {
            if ($(item).attr('genre') == option) {
                $(item).attr('active', true)
                genreFilter = option
            } else {
                $(item).attr('active', false)
            }
        })


        displayMovies()


        //Activate the menu option they clicked on
        this.setAttribute('active', true)

    })

    const init = async () => {
        displayLoader() //Display the loading pizza animation
        await getMovies() //Wait until we have some movies
        setTimeout(() => { //Wait two seconds
            displayMovies() //And display the movies
        }, 5000)
    }

    init()

})()