import express from 'express'
import cors from 'cors'
import { connect, sql } from './db.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3333;


//Middleware
app.use(cors())
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, "frontend")))


//API endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dashboard.html"))
});


app.get('/api/games', async (req, res) => {
    try {
        //Connect to DB
        const pool = await connect()
        //Begin query
        const result = await pool.request().query(
            'EXEC SP_GET_GAMES @COUNT = 50'
        )
        res.send(result.recordset); // Output the result
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        // Close the connection
        await sql.close();
    }
});


app.get('/api/games_genres', async (req, res) => {
    try {
        //Connect to DB
        const pool = await connect()
        //Begin query
        const result = await pool.request().query(
            'EXEC SP_GET_GAMES_GENRES @COUNT = 50'
        )
        res.send(result.recordset); // Output the result
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        // Close the connection
        await sql.close();
    }
});


//listener
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});