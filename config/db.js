require('dotenv').config()
const mongoose = require('mongoose')

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const host = process.env.DB_HOST
const port = process.env.DB_PORT
const databaseName = process.env.DB_NAME

// const connectionUrl = 'mongodb://' + username + ":" + password + "@" + host + ":" + port + "/" + databaseName
connectionUrl = username ? `mongodb://${username}:${password}@${host}:${port}/${databaseName}` : `mongodb://${host}:${port}/${databaseName}`

mongoose.set('runValidators', true);
mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (error, client) => {
    if (error) return console.log(error)
    console.log(`Database ${databaseName} connected successfully`)
})
mongoose.set("debug", process.env.DB_DEBUG, (collectionName, method, query, doc) => {
    console.log('${collectionName}.${method}', JSON.stringify(query), doc);
});