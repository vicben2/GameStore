import express from 'express'
import sql from 'mssql'
import cors from 'cors'

const app = express()
const sqlConfig = {
    user: 'readwriteuser',
    password: 'admin1',
    server: 'LAPTOP-RKDKUAJG',
    database: 'GAMESTOREDB',
    options: {
        encrypt: false, //true if using Azure
        trustServerCertificate: true //true for local dev / self-signed certs
    },
}

(async () => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig)
        const result = await sql.query(`SELECT * FROM GAME`)
        console.dir(result)
    } catch (err) {
        // ... error checks
    }
})()