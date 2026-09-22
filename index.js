const express = require('express');
const mysql2 = require('mysql2/promise');
const ejs = require('ejs');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;


require('dotenv').config();

// Tell Express we are using EJS as the view engine.
// A view engine is also known as a template engine.
app.set('view engine', 'ejs');
app.set('views', './views');

// Allow Express to process data submitted through HTML forms.
app.use(express.urlencoded({ extended: true }));

//app.use() is use to set the configurations and the middlewares
//middleware helps to changes to the request and the response objects
//middleware can end the request-response cycle
//middleware call the next middleware function in the stack

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true, }));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //extended helps us to pass the nested object
app.use(cookieParser()); //cookie configuration in the app



// Create a connection pool to the database.
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

const dbConnection = mysql2.createPool(dbConfig);


//CRUD FOR CUISINES
// READ: List all cuisines
app.get('/cuisines', async function (req, res) {
    try {
        const [rows] = await dbConnection.execute('SELECT * FROM cuisines');
        res.render('cuisines', { cuisines: rows });

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// CREATE: Show form
app.get('/cuisines/create', function (req, res) {
    res.render('create-cuisines');
});

// CREATE: Handle form
app.post('/cuisines', async function (req, res) {
    try {
        const { name } = req.body;
        await dbConnection.execute(
            'INSERT INTO cuisines (name) VALUES (?)',
            [name]
        );
        res.redirect('/cuisines');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// UPDATE: Show edit form
app.get('/cuisines/:id/edit', async function (req, res) {
    try {
        const [rows] = await dbConnection.execute(
            'SELECT * FROM cuisines WHERE cuisine_id = ?',
            [req.params.id]
        );
        res.render('edit-cuisines', { cuisine: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// UPDATE: Handle edit form
app.post('/cuisines/:id', async function (req, res) {
    try {
        const cuisineId = req.params.id;
        const { name } = req.body;

        const sql = "UPDATE cuisines SET name = ? WHERE cuisine_id = ?";
        const [result] = await dbConnection.execute(sql, [name, cuisineId]);

        res.redirect('/cuisines');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// DELETE
app.post('/cuisines/:id/delete', async function (req, res) {
    try {
        const cuisineId = req.params.id
        const sql = "DELETE FROM cuisines WHERE cuisine_id = ?";
        await dbConnection.execute(sql, [cuisineId]);
        res.redirect('/cuisines');

    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

//CRUD FOR RECIPES
// READ: List all recipes (with JOINs to cuisines and users)
app.get('/recipes', async function (req, res) {
    try {
        const [rows] = await dbConnection.execute(
            `SELECT
                r.recipe_id,
                r.title,
                r.instructions,
                r.date_created,
                r.last_updated,
                c.name  AS cuisine_name,
                u.email AS email
             FROM recipes r
             JOIN cuisines c ON r.cuisine_id = c.cuisine_id
             JOIN users    u ON r.user_id    = u.user_id
             ORDER BY r.date_created DESC`
        );
        res.render('recipes', { recipes: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// CREATE: Show form (with DB-driven dropdowns)
app.get('/recipes/new', async function (req, res) {
    try {
        const [cuisines] = await dbConnection.query(
            'SELECT cuisine_id, name FROM cuisines ORDER BY name'
        );
        const [users] = await dbConnection.query(
            'SELECT user_id, email FROM users ORDER BY email'
        );
        res.render('new-recipes', { cuisines: cuisines, users: users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// CREATE:
app.post('/recipes', async function (req, res) {
    try {
        const { title, instructions, cuisine_id, user_id } = req.body;

        await dbConnection.execute(
            `INSERT INTO recipes (title, instructions, cuisine_id, user_id)
             VALUES (?, ?, ?, ?)`,
            [title, instructions, cuisine_id, user_id]
        );

        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// UPDATE: Show edit form (with dropdowns pre-selected)
app.get('/recipes/:id/edit', async function (req, res) {
    try {
        const [rows] = await dbConnection.execute(
            'SELECT * FROM recipes WHERE recipe_id = ?',
            [req.params.id]
        );

        const [cuisines] = await dbConnection.query(
            'SELECT cuisine_id, name FROM cuisines ORDER BY name'
        );
        const [users] = await dbConnection.query(
            'SELECT user_id, email FROM users ORDER BY email'
        );

        res.render('edit-recipes', {
            recipe: rows[0],
            cuisines: cuisines,
            users: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// UPDATE
app.post('/recipes/:id', async function (req, res) {
    try {
        const { title, instructions, cuisine_id, user_id } = req.body;

        await dbConnection.execute(
            `UPDATE recipes
                SET title = ?, instructions = ?, cuisine_id = ?, user_id = ?
             WHERE recipe_id = ?`,
            [title, instructions, cuisine_id, user_id, req.params.id]
        );

        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// DELETE
app.post('/recipes/:id/delete', async function (req, res) {
    try {
        await dbConnection.execute(
            'DELETE FROM recipes WHERE recipe_id = ?',
            [req.params.id]
        );
        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// SEARCH
app.get('/recipes/search', async function (req, res) {
    try {
        const { title, cuisine_id, date_created, last_updated } = req.query;

        if (!title && !cuisine_id && !date_created && !last_updated) {
            return res.render('search-recipes', {
                cuisines: cuisines,
                results: null,
                query: {}
            });
        }

        const bindings = [];
        let query = "SELECT * FROM recipes WHERE 1";

        if (title) {
            query += " AND title LIKE ?";
            bindings.push("%" + title.trim() + "%");
        }

        if (cuisine_id) {
            query += " AND cuisine_id = ?";
            bindings.push(cuisine_id);
        }

        if (date_created) {
            query += " AND date_created = ?";
            bindings.push(date_created);
        }

        if (last_updated) {
            query += " AND last_updated = ?";
            bindings.push(last_updated);
        }

        const [rows] = await dbConnection.execute(query, bindings);

        const [cuisines] = await dbConnection.execute("SELECT * FROM cuisines");

        res.render('search-recipes', {
            cuisines: cuisines,
            results: rows,
            query: req.query
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});
// // 7. 404 handler (optional, should be last route)
// app.use((req, res) => res.status(404).send('Not found'));

// // 8. Error handler (optional, must be last)
// app.use((err, req, res, next) => {

// });




app.listen(port, function () {
    console.log(`Server has started on port 3000`);
});