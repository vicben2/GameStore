import express from 'express'
import cors from 'cors'
import { connect } from './db.js'


const app = express();
const port = 3333;


//Middleware
app.use(cors())
app.use(express.urlencoded({
    extended: false
}));
app.use(express.static("../frontend"))


connect()
    .then(function(conn) {
        console.log("Successfully connected.")
    })
    .catch(function(err) {
        console.error("Database connection failed: " + err)
    })



//API endpoints
app.get('/', (req, res) => {
    res.send("Hello world")
});


app.get('/api/games', async (req, res) => {

});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});