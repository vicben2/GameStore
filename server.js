import express from 'express'
import cors from 'cors'
import { connect, sql } from './db.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import multer from 'multer'
import fs from 'fs'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadFolder = path.join(__dirname, 'frontend/uploads');
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },

    filename: function (req, file, cb) {
        //prefix to avoid overwriting
        const prefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, prefix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });
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

//file upload for pic
app.post('/upload', upload.single('picture'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const newPath = path.join('uploads', req.file.filename);
    
    res.json({
        message: 'File uploaded successfully!',
        path: newPath.replace(/\\/g, "/")
    });
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

//get games-average score - 50 games
app.get('/api/games_avg', async (req, res) => {
    try {
        const pool = await connect()
        const result = await pool.request().query('EXEC SP_GET_GAMES_AVG @COUNT = 50')
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
            res.send({ success: true, message: "Game added." })
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

        switch (entity) {
            case "users": query = "SP_GET_ALL_USERS_COUNT"; break
            case "devs": query = "SP_GET_DEV_COUNT"; break
            case "games": query = "SP_GET_ALL_GAMES_COUNT"; break
            default: res.send({ success: false, message: "Invalid entity." })
        }

        const pool = await connect()
        const result = await pool.request().query(`EXEC ${query}`)
        res.send({ success: true, data: result.recordset });
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
            res.send({ success: true, message: "Profile updated." })
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
            res.send({ success: true, data: result.recordset })
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

        const { devId } = req.body

        const request = pool.request()
        request.input('USERID', sql.Int, devId)

        await request.execute('SP_GET_GAMES_BY_DEV').then(async (result) => {
            res.send({ success: true, data: result.recordset })
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
            res.send({ success: true, data: result.recordset })
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

        const { gameId, title, description, genre, price, img } = req.body

        const request = pool.request()
        request.input('GAME_ID', sql.Int, gameId)
        request.input('GAME_TITLE', sql.VarChar(50), title)
        request.input('GAME_DESC', sql.VarChar(300), description)
        request.input('GENRE', sql.VarChar(100), genre)
        request.input('PRICE', sql.Money, price)
        request.input('GAME_IMG', sql.VarChar(200), img)

        await request.execute('SP_UPDATE_GAME').then(async (result) => {
            res.send({ success: true, message: "Game updated." })
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
            res.send({ success: true, message: "Transaction successful." })
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
            res.send({ success: true, data: result.recordset })
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//disable game
app.post('/api/toggle_game', async (req, res) => {
    try {
        const pool = await connect()

        const { gameId } = req.body

        const request = pool.request()
        request.input('GAME_ID', sql.Int, gameId)

        await request.execute('SP_TOGGLE_DISABLE_GAME').then(async (result) => {
            res.send({ success: true, message: "Game availability has been toggled." })
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//add review
app.post('/api/review', async (req, res) => {
    try {
        const pool = await connect()

        const { gameId, userId, score, comment } = req.body

        const request = pool.request()
        request.input('GAME_ID', sql.Int, gameId)
        request.input('PLAYER_ID', sql.Int, userId)
        request.input('SCORE', sql.Int, score)
        request.input('COMMENT', sql.VarChar(1000), comment)

        await request.execute('SP_ADD_REVIEW').then(async (result) => {
            res.send({ success: true, message: "Your feedback is appreciated." })
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

//get sales
app.post('/api/dev_sales', async (req, res) => {
    try {
        const pool = await connect()

        const { userId } = req.body

        const request = pool.request()
        request.input('DEV_ID', sql.Int, userId)

        await request.execute('SP_GET_SALES_REPORT_BY_DEV').then(async (result) => {
            res.send({ success: true, data: result.recordset })
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

app.post('/api/dev_per_game_sales', async (req, res) => {
    try {
        const pool = await connect()

        const { userId } = req.body

        const request = pool.request()
        request.input('DEV_ID', sql.Int, userId)

        await request.execute('SP_GET_PER_GAME_SALES_REPORT_BY_DEV').then(async (result) => {
            res.send({ success: true, data: result.recordset })
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

app.post('/api/all_game_sales', async (req, res) => {
    try {
        const pool = await connect()

        const { orderBy, dev, gameTitle } = req.body

        const request = pool.request()
        request.input('ORDER_BY', sql.NVarChar(128), orderBy)
        request.input('DEV', sql.NVarChar(128), dev)
        request.input('GAME_TITLE', sql.NVarChar(128), gameTitle)

        await request.execute('SP_GET_ALL_PER_GAME_SALES').then(async (result) => {
            res.send({ success: true, data: result.recordset })
        })
    } catch (err) {
        console.error('SQL error', err);
    } finally {
        await sql.close();
    }
});

app.get('/api/user_purchases', async (req, res) => {
    try {
        const pool = await connect()
        const request = pool.request()

        await request.execute('SP_GET_ALL_USER_PURCHASES').then(async (result) => {
            res.send({ success: true, data: result.recordset })
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