const express = require('express');
const app = express();
const routes = require('./routes/index');
const db = require('./config/db');
const cookieParser = require('cookie-parser')
const passport = require('./middlewers/passport-local');

var session = require('express-session')
var flash = require('connect-flash');

const port = 3002;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/myUploads',express.static("myUploads"));

app.use(session({
    secret: 'myAdminPenal',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

// passport.initialize();
// passport.session();

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(cookieParser());
app.use("/", routes);

app.listen(port, () => {
    console.log(`Server started ${port}`);
});