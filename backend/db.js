import sql from 'mssql'

//db login
const dbConfig = {
    user: 'readwriteuser',
    password: 'admin1',
    server: 'localhost\\SQLEXPRESS',
    database: 'GAMESTOREDB',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true
    },
}

//export
export const connect = () => sql.connect(dbConfig)