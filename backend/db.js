import sql from 'mssql'

//db login
const dbConfig = {
    user: 'sa',
    password: 'm3m3c3nt3r',
    server: 'localhost',
    database: 'GAMESTOREDB',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        encrypt: false
    },
}

//export
export const connect = () => sql.connect(dbConfig)