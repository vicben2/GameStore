import sql from 'mssql'

//db login
const dbConfig = {
    user: 'sa',
    password: 'admin1',
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