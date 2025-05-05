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
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, "frontend")))


//API endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dashboard.html"))
});

//get games up to 50
app.get('/api/games', async (req, res) => {
    try {
        const pool = await connect()
        const result = await pool.request().query('EXEC SP_GET_GAMES @COUNT = 50')
        res.send(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get game-genres - 50 games
app.get('/api/games_genres', async (req, res) => {
    try {
        const pool = await connect()
        const result = await pool.request().query('EXEC SP_GET_GAMES_GENRES @COUNT = 50')
        res.send(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//signup
app.post('/api/signup', async (req, res) => {
    try {
        const pool = await connect()

        const { username, password } = req.body
        const user_type = req.body.user_type === "user" ? "USER" : "DEV"

        const request = pool.request()
        request.input('USERNAME', sql.VarChar(30), username);

        await request.execute('SP_GET_USERS_BY_USERNAME').then(async (result) => {
            if (result.recordset.length !== 0) {
                res.send({ success: false, message: "Username already exists." })
            }
            else {
                request.input('PASSWORD', sql.VarChar(50), password)
                request.input('USER_TYPE', sql.VarChar(100), user_type)
                await request.execute('SP_SIGNUP_USER').then(result => {
                    res.send({ success: true })
                })
            }
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//login
app.post('/api/login', async (req, res) => {
    try {
        const pool = await connect()

        const { username, password } = req.body

        const request = pool.request()
        request.input('USERNAME', sql.VarChar(30), username)
        request.input('PASSWORD', sql.VarChar(50), password)

        await request.execute('SP_LOGIN_USER').then(async (result) => {
            if (result.recordset.length === 0) {
                res.send({ success: false, message: "Invalid username/password" })
            }
            else {
                await request.execute('SP_LOGIN_USER').then(result => {
                    res.send({ success: true, user: result.recordset[0] })
                })
            }
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//add game
app.post('/api/upload_game', async (req, res) => {
    try {
        const pool = await connect()

        const { gameName, gameDesc, devId } = req.body

        const request = pool.request()
        request.input('DEV_ID', sql.Int, devId)
        request.input('GAME_TITLE', sql.VarChar(50), gameName)
        request.input('GAME_DESC', sql.VarChar(300), gameDesc)
        request.input('PRICE', sql.Money, 400) //default to 400 money for now, edit later

        await request.execute('SP_ADD_GAME').then(async (result) => {
            res.send({success: true, message: "Game added."})
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get entity count
app.get('/api/get_count', async (req, res) => {
    try {
        const { entity } = req.query
        let query = ""

        switch(entity) {
            case "users": query = "SP_GET_ALL_USERS_COUNT"; break
            case "devs": query = "SP_GET_DEV_COUNT"; break
            case "games": query = "SP_GET_ALL_GAMES_COUNT"; break
            default: res.send({success: false, message: "Invalid entity."})
        }

        const pool = await connect()
        const result = await pool.request().query(`EXEC ${query}`)
        res.send({success: true, data: result.recordset});
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//listener
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});