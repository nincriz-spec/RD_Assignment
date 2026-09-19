const express = require('express');
const mysql2 = require('mysql2/promise');
const ejs = require('ejs');

const app = express();
const port = 3000;

require('dotenv').config();

// Tell Express we are using EJS as the view engine.
// A view engine is also known as a template engine.
app.set('view engine', 'ejs');
app.set('views', './views');

// Allow Express to process data submitted through HTML forms.
app.use(express.urlencoded({
    extended: true
}));

// Create a connection pool to the database.
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const dbConnection = mysql2.createPool(dbConfig);


// ==========================================
// Routes
// ==========================================

// Students add their routes here.


// ==========================================
// Start Server
// ==========================================

app.listen(port, function () {
    console.log(`Server has started on port ${port}`);
});