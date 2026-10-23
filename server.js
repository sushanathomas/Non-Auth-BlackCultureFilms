require('dotenv').config() //it'll load the settings from my .env file. 
const express = require('express') //declaring and requiring express framework
const app = express() //Storing my express inside the app variable. 
const bodyParser = require('body-parser') //declaring and requiring bodyparser
const MongoClient = require('mongodb').MongoClient //decalring the requiring the mongodb-database. 
const ObjectId = require('mongodb').ObjectId //Mongodb is storing the object ObjectId, the browser sends a text and it's converted beofre finding the movie. 
let db, collections;

const url = process.env.MONGODB_URI //this is readinf the value saved my .env file, so it doesn't display my password and stays out of the server. 
const dbName = "BlackCultureFilms" //This is the mongo URL - this is the url that in the mongodb atlas website

const PORT = process.env.PORT || 8010
//This is the port in which our server will start and run on. The console.log only prin't the message inside our terminal to show that it's running. 
app.listen(PORT, async () => {
    try {
        //Create a variable (client), and keep it consistent. Then store(=) the value from the client variable, then it's waititng for the information from the MongoDB. Once it made the connection, and store it inside the client variable. 
        const client = await MongoClient.connect(url)

        db = client.db(dbName) //Use the connected client(BlackCultureFilms) databade, and store that information inside the db. 

        console.log(`Connected to ${dbName}!`)
        console.log(`Server listening on port ${PORT}`)
    } catch (error) {
        console.error('Cannot connect to MongoDB:', error.message)
    }
})


app.set('view engine', 'ejs') //This is to tell EJS we're using Express for our pages. 

//This will take the information from the submitted form & make them available through body reuest.
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json()) //This lets the server read the information our button sends. 
app.use(express.static('public')) //Thus makes the files in our public folder available to the browser. 

//Follow the GET route. find() - means select all documents in the movies. 
app.get('/', async (req, res) => {
    const search = (req.query.search || '').trim()

    try {
        const movies = await db.collection('movies').find().toArray()

        const filteredMovies = movies.filter(function (movie) {
            const title = movie.title || ''

            return title.toLowerCase().includes(search.toLowerCase())
        })
        res.render('index.ejs', { movies: filteredMovies })
    } catch (error) {
        console.error('could ot load films:', error.message)
        res.status(500).send('We could not load your films. Please try again.')
    }
})

//This will receive the form sent to the /movies. 
//Post to /movies(route), save in movies. 
app.post('/movies', async (req, res) => {
    // Check the movie title.
    const title = (req.body.title || '').trim()

    if (!title) {
        return res.status(400).send('Please enter a movie title.')
    }

    // Check the genre, and trims any spacing inside or after the words. 
    const genre = (req.body.genre || '').trim()

    if (!genre) {
        return res.status(400).send('Please enter a genre.')
    }

    // Check the release year.
    const year = Number(req.body.year)
    const currentYear = new Date().getFullYear()

    if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
        return res.status(400).send(
            `Please enter a whole-number release year between 1900 and ${currentYear}.`
        )
    }

    // Check the watched status.
    const status = req.body.status

    if (status !== 'watched' && status !== 'unwatched') {
        return res.status(400).send('Please choose a valid watched status.')
    }

    // Check the poster URL if one was entered.
    const poster = (req.body.poster || '').trim()

    if (poster) {
        try {
            const posterUrl = new URL(poster)

            if (posterUrl.protocol !== 'http:' && posterUrl.protocol !== 'https:') {
                return res.status(400).send(
                    'Please enter an http:// or https:// poster URL.'
                )
            }
        } catch (error) {
            return res.status(400).send('Please enter a valid poster URL.')
        }
    }

    // Save the movie after the checks pass.
    try {
        await db.collection('movies').insertOne({
            title: title,
            genre: genre,
            year: year,
            status: status,
            poster: poster
        })

        console.log('Film saved to database!')
        res.redirect('/')
    } catch (error) {
        console.error('Could not save film:', error.message)
        res.status(500).send('We could not save your film. Please try again.')
    }
})

app.put('/movies', async (req, res) => {
    const id = req.body.id
    const status = req.body.status

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid movie ID.')
    }

    if (status !== 'watched' && status !== 'unwatched') {
        return res.status(400).send('Invalid watched status.')
    }

    try {
        const result = await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: status } }
        )

        if (result.matchedCount === 0) {
            return res.status(404).send('Movie not found.')
        }

        res.send('Watched status updated!')
    } catch (error) {
        console.error('Could not update film:', error.message)
        res.status(500).send('Could not update watched status.')
    }
})

//Deleting Route; 
// When the browser send a delete reequest to the '/movie, it reads the movie's ID, check it and then delete that movie from the MongoDB, then sends back a message(saying succesful). if there's an error, it'll send error and to try again. 
app.delete('/movies', async (req, res) => {
    const id = req.body.id

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid movie ID.')
    }

    try {
        const result = await db.collection('movies').deleteOne({ //Find the movie with the ID and delete that document. 
            _id: new ObjectId(id)
        })

        if (result.deletedCount === 0) {
            return res.status(404).send('Movie not found.')
        }

        res.send('Film deleted!')
    } catch (error) {
        console.error('Could not delete film:', error.message)
        res.status(500).send('Could not delete film. Please try again.')
    }
})