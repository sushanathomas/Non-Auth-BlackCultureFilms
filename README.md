# Films: Classics from the Culture

A full-stack movie watchlist celebrating Black stories, talent, and cinema.

I built this project to practice using Express, EJS, and MongoDB to create a CRUD application without authentication.

## Features

- Add films with a title, genre, release year, watched status, and optional poster URL.
- View saved films and their posters.
- Search saved films by title.
- Change films between watched and unwatched.
- Delete films.
- Validate information before saving it.

This version has no login. Everyone using the app shares the same watchlist.

## Built With

- Node.js
- Express
- EJS
- MongoDB Atlas and the MongoDB Node.js driver
- JavaScript
- CSS
- dotenv
- Nodemon

## Run Locally

1. Clone this repository and open its folder.
2. Install dependencies:

   npm install

3. Create a `.env` file in the project root with your own MongoDB connection string:

   MONGODB_URI=your_mongodb_connection_string

4. Make sure your Atlas database user can access the database and your IP address is allowed.
5. Start the development server:

   npm run dev

6. Open http://localhost:8010 in your browser.

The application uses the `BlackCultureFilms` database and the `movies` collection.

## Routes

- GET / — Display films and search by title.
- POST /movies — Add a film.
- PUT /movies — Update watched status.
- DELETE /movies — Delete a film.

## Environment Variables

- MONGODB_URI — Your private MongoDB connection string.

Keep your actual connection string in `.env`. Do not commit that file or share your database password.

## What I Learned

- How forms send information to an Express server.
- How to save, read, update, and delete MongoDB documents.
- How to display database information with EJS.
- How to use fetch for update and delete requests.
- How to validate form information on the server.
- How to use environment variables for private settings.