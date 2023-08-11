const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());

//CREATE
app.post("/todos", async(req, res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",
        [description]);

        res.json(newTodo.rows[0]);
    }
    catch (error) {
        console.error(error.message);
    }
})

//GET ALL
app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})
//GET ONE
app.get("/todos/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);

        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

//UPDATE
app.put("/todos/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;

        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id])

        res.json("Todo was updated");
    } catch (error) {
        console.error(error.message);
    }
})

//DELETE
app.delete("/todos/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);

        res.json("Todo was deleted");
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(port, () => {
    console.log("Server started at port", port);
})