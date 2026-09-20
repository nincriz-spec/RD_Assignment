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



//CRUD FOR CUISINES
// READ: List all cuisines
app.get('/cuisines', async function (req, res) {
    try {
        const [rows] = await dbConnection.query('SELECT * FROM cuisines');
        res.render('cuisines', { cuisines: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// CREATE: Show form
app.get('/cuisines/new', function (req, res) {
    res.render('new-cuisine');
});

// CREATE: Handle form
app.post('/cuisines', async function (req, res) {
    try {
        const { name } = req.body;
        await dbConnection.query(
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
        const [rows] = await dbConnection.query(
            'SELECT * FROM cuisines WHERE cuisine_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).send('Cuisine not found');
        res.render('edit-cuisine', { cuisine: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// UPDATE: Handle edit form
app.post('/cuisines/:id', async function (req, res) {
    try {
        const { name } = req.body;
        await dbConnection.query(
            'UPDATE cuisines SET name = ? WHERE cuisine_id = ?',
            [name, req.params.id]
        );
        res.redirect('/cuisines');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// DELETE
app.post('/cuisines/:id/delete', async function (req, res) {
    try {
        await dbConnection.query(
            'DELETE FROM cuisines WHERE cuisine_id = ?',
            [req.params.id]
        );
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
        const [rows] = await dbConnection.query(
            `SELECT
                r.recipe_id,
                r.title,
                r.instructions,
                r.date_created,
                r.last_updated,
                c.name  AS cuisine_name,
                u.email AS user_email
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
        res.render('new-recipe', { cuisines: cuisines, users: users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// CREATE: Handle form
app.post('/recipes', async function (req, res) {
    try {
        const { title, instructions, cuisine_id, user_id } = req.body;
        await dbConnection.query(
            `INSERT INTO recipes
                (title, instructions, date_created, last_updated, cuisine_id, user_id)
             VALUES (?, ?, NOW(), NULL, ?, ?)`,
            [title, instruction, cuisine_id, user_id]
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
        const [rows] = await dbConnection.query(
            'SELECT * FROM recipes WHERE recipe_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).send('Recipe not found');

        const [cuisines] = await dbConnection.query(
            'SELECT cuisine_id, name FROM cuisines ORDER BY name'
        );
        const [users] = await dbConnection.query(
            'SELECT user_id, email FROM users ORDER BY email'
        );

        res.render('edit-recipe', {
            recipe: rows[0],
            cuisines: cuisines,
            users: users
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// UPDATE: Handle edit form
app.post('/recipes/:id', async function (req, res) {
    try {
        const { title, instructions, cuisine_id, user_id } = req.body;
        await dbConnection.query(
            `UPDATE recipes
                SET title = ?, instructions = ?, cuisine_id = ?, user_id = ?, last_updated = NOW()
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
        await dbConnection.query(
            'DELETE FROM recipes WHERE recipe_id = ?',
            [req.params.id]
        );
        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// SEARCH: Show search form
app.get('/recipes/search', async function (req, res) {
    try {
        const [cuisines] = await dbConnection.query(
            'SELECT cuisine_id, name FROM cuisines ORDER BY name'
        );
        res.render('search-recipes', {
            cuisines: cuisines,
            results: null,   // null = form not submitted yet
            query: {}        // so the form fields don't error on first load
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// SEARCH: Run the search
app.get('/recipes/search/results', async function (req, res) {
    try {
        const { title, cuisine_id, date_created, last_updated } = req.query;

        // Start with base query; build WHERE conditions + params dynamically
        let sql = `
            SELECT
                r.recipe_id,
                r.title,
                r.instructions,        -- or 'instruction' — match your column
                r.date_created,
                r.last_updated,
                c.name  AS cuisine_name,
                u.email AS user_email
            FROM recipes r
            JOIN cuisines c ON r.cuisine_id = c.cuisine_id
            JOIN users    u ON r.user_id    = u.user_id
        `;

        const conditions = [];
        const params = [];

        if (title && title.trim() !== '') {
            conditions.push('r.title LIKE ?');
            params.push('%' + title.trim() + '%');
        }

        if (cuisine_id && cuisine_id !== '') {
            conditions.push('r.cuisine_id = ?');
            params.push(cuisine_id);
        }

        if (date_created && date_created !== '') {
            conditions.push('DATE(r.date_created) = ?');
            params.push(date_created);           // expects 'YYYY-MM-DD'
        }

        if (last_updated && last_updated !== '') {
            conditions.push('DATE(r.last_updated) = ?');
            params.push(last_updated);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY r.date_created DESC';

        const [results] = await dbConnection.query(sql, params);

        const [cuisines] = await dbConnection.query(
            'SELECT cuisine_id, name FROM cuisines ORDER BY name'
        );

        res.render('search-recipes', {
            cuisines: cuisines,
            results: results,
            query: req.query
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});






app.listen(port, function () {
    console.log(`Server has started on port ${port}`);
});