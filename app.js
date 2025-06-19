require('./config/db')
require('dotenv').config()
require('./config/sendinblue')
const exhbs = require('express-handlebars')
const {LoggerMiddleware} = require('./app/middlewares/global')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path');
const app = express()


const doWorkPromise = new Promise(((resolve, reject) => {
    setTimeout(() => {
        resolve([1,2,3])
    })
}))

doWorkPromise.then((result) => {
    console.log("Success!", result)
}).catch((error) => {
    console.log("Error!", error)
})

// app.use(logger('dev'));
const hbs = exhbs.create({
    extname: 'hbs',
    layoutsDir : './app/views/'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('port', process.env.PORT)

app.use('/web', LoggerMiddleware, require('./app/modules/web/'))
app.use('/public', express.static(path.join(__dirname, 'public')))

// INVALID ROUTE
app.use(function(req, res) {
    res.status(404)
    res.send({code: 404, error: "Invalid URL"})
});

// DEFAULT RETURN VALUE IF ERROR
app.use(function(err, req, res) {
    let status = err.statusCode || 500
    res.status(status).send({code: status, message: err.message})
});

app.listen(process.env.PORT, () => {
    console.log('Server is up on port ' + process.env.PORT)
})

// sudo /Users/sultan/mongodb/4.4.1/bin/mongod --dbpath=/Users/sultan/mongodb-data
