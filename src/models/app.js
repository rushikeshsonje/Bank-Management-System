const express = require('express');
const path = require('path')
const app = express();
const session = require('express-session')
const flash = require('connect-flash')
const csrf = require('csurf')
const errorController = require('../../controller/error')
const mongoose = require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const Employee = require('../models/employees')
const {
    json
} = require('express');

const port = process.env.port || 8000;
app.use(express.static('../../STATICFILES'))

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));



const MONGODB_URI = "mongodb://0.0.0.0:27017/bankmanagementsystem";
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../../views'))

const employeeRoutes = require('../../routes/employee')
const authRoutes = require('../../routes/auth');
const Customer = require('./customer');

app.use(session(
    {
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store
}
));
app.use(flash());

app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    Employee.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        // console.log(req.user);
        next();
      })
      .catch(err => console.log(err));
  });

app.use((req, res, next) => {
  // throw new Error('sync dummy');
    if (!req.session.user) {
      return next();
    }
    Customer.findById(req.session.user._id)
    .then(user => {
      req.user1 = user;
      // console.log(req.user);
      next();
    })
    .catch(err => console.log(err));
});

app.use(authRoutes)
app.use(employeeRoutes)

app.use(errorController.get404)

app.get('/500', errorController.get500);

app.use((error, req, res, next) => {
  res.redirect('/500')
})

mongoose
    .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex:true
}).then(() => {
    console.log('connection successful');
}).catch((e) => {
    console.log('no connection')
    console.log(e);
})

app.listen(port, () => {
    console.log(`server started at port http://localhost:${port}`);
})