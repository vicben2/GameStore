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

        const { username, password, email, firstName, lastName, birthdate } = req.body
        const user_type = req.body.user_type === "CLIENT" ? "CLIENT" : "DEV"

        const request = pool.request()
        request.input('USERNAME', sql.VarChar(30), username);

        await request.execute('SP_GET_USERS_BY_USERNAME').then(async (result) => {
            if (result.recordset.length !== 0) {
                res.send({ success: false, message: "Username already exists." })
            }
            else {
                request.input('PASSWORD', sql.VarChar(50), password)
                request.input('USER_TYPE', sql.VarChar(100), user_type)
                request.input('EMAIL', sql.VarChar(50), email)
                request.input('FNAME', sql.VarChar(50), firstName)
                request.input('LNAME', sql.VarChar(50), lastName)
                request.input('DATE_OF_BIRTH', sql.DateTime, birthdate)
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

        const { gameName, gameDesc, genre, devId, price, image } = req.body

        const request = pool.request()
        request.input('DEV_ID', sql.Int, devId)
        request.input('GAME_TITLE', sql.VarChar(50), gameName)
        request.input('GAME_DESC', sql.VarChar(300), gameDesc)
        request.input('PRICE', sql.Money, price)
        request.input('GAME_IMG', sql.VarChar(200), image)
        request.input('GENRE', sql.VarChar(30), genre)

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

//update profile
app.post('/api/update_profile', async (req, res) => {
    try {
        const pool = await connect()

        const { userId, email, firstName, lastName, birthdate, bio, profilePic } = req.body

        const request = pool.request()
        request.input('USERID', sql.Int, userId)
        request.input('EMAIL', sql.VarChar(50), email)
        request.input('FNAME', sql.VarChar(50), firstName)
        request.input('LNAME', sql.VarChar(50), lastName)
        request.input('DATE_OF_BIRTH', sql.DateTime, birthdate)
        request.input('BIO', sql.VarChar(500), bio)
        request.input('PROFILE_PIC', sql.VarChar(500), profilePic)

        await request.execute('SP_UPDATE_PROFILE').then(async (result) => {
            res.send({success: true, message: "Profile updated."})
        })

    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get user
app.post('/api/get_user', async (req, res) => {
    try {
        const pool = await connect()

        const { userId } = req.body

        const request = pool.request()
        request.input('USERID', sql.Int, userId)

        await request.execute('SP_GET_USER').then(async (result) => {
            res.send({success: true, data: result.recordset})
        })

    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get games by dev
app.post('/api/dev_games', async (req, res) => {
    try {
        const pool = await connect()

        const { userId } = req.body

        const request = pool.request()
        request.input('USERID', sql.Int, userId)

        await request.execute('SP_GET_GAMES_BY_DEV').then(async (result) => {
            res.send({success: true, data: result.recordset})
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get genres
app.get('/api/genres', async (req, res) => {
    try {
        const pool = await connect()
        const result = await pool.request().query('EXEC SP_GET_GENRES')
        res.send(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get genres by game
app.post('/api/genres_by_game', async (req, res) => {
    try {
        const pool = await connect()

        const { gameId } = req.body

        const request = pool.request()
        request.input('GAME_ID', sql.Int, gameId)

        await request.execute('SP_GET_GENRES_BY_GAME').then(async (result) => {
            res.send({success: true, data: result.recordset})
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//update game
app.post('/api/update_game', async (req, res) => {
    try {
        const pool = await connect()

        const { gameId, title, description, genre, price } = req.body

        const request = pool.request()
        request.input('GAME_ID', sql.Int, gameId)
        request.input('GAME_TITLE', sql.VarChar(50), title)
        request.input('GAME_DESC', sql.VarChar(300), description)
        request.input('GENRE', sql.VarChar(100), genre)
        request.input('PRICE', sql.Money, price)

        await request.execute('SP_UPDATE_GAME').then(async (result) => {
            res.send({success: true, message: "Game updated."})
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//new order
app.post('/api/order', async (req, res) => {
    try {
        const pool = await connect()

        const { paymentId, userId, gameId, qty, price } = req.body

        const request = pool.request()
        request.input('PAYMENT_ID', sql.Int, paymentId)
        request.input('PLAYER_ID', sql.Int, userId)
        request.input('GAME_ID', sql.Int, gameId)
        request.input('QTY', sql.Int, qty)
        request.input('PRICE', sql.Money, price)

        await request.execute('SP_ADD_NEW_ORDER').then(async (result) => {
            res.send({success: true, message: "Transaction successful."})
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//user purchased games
app.post('/api/user_games', async (req, res) => {
    try {
        const pool = await connect()

        const { userId } = req.body

        const request = pool.request()
        request.input('USER_ID', sql.Int, userId)

        await request.execute('SP_GET_USER_PURCHASED_GAMES').then(async (result) => {
            res.send({success: true, data: result.recordset })
        })
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