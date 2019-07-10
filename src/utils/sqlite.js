import { Database } from 'sqlite3'
import { config } from './config'

const initDb = () => {
  const db = new Database(config.sqlite.path, err => {
    if (err) {
      console.error(err.message)
    }
    console.log('Database %s connected !', config.sqlite.path)
  })

  return db
}
export const database = initDb()

export const executeSql = (db, query, params) => {
  return new Promise((resolve, reject) => {
    if (query.toUpperCase().includes('SELECT')) {
      db.all(query, params, (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      })
    } else {
      db.run(query, params, err => {
        if (err) reject(err)
        return resolve(true)
      })
    }
  })
}
