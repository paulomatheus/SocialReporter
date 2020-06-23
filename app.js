/*Authors:
Guilherme Costa
Gustavo Marins
Paulo Matheus
*/ 

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/database');

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var csrf = require('csurf'); 

const app = express();

var options = {                             
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bb5b1eafda0483',
    password: '01f25e13',
    database: 'heroku_0956afd54f3bb46'
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'mySecret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false })); 

app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

var csrfProtection = csrf();
/************************* CSRF PROTECTION ********************************/

app.use((req, res, next) => { 
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;   
    
    next();
});


/****************************************************************************/


app.use(userRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3000);
