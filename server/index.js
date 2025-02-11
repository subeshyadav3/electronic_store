const mongoose = require('mongoose'); 
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const productRouter = require('./routes/productRoute.js');
const authRouter = require('./routes/auth.js');
const checkAuthAdmin=require('./middlewares/checkAdmin.js');
const { checkAuth } = require('./middlewares/checkAuthCustomer.js'); 
const orderRouter=require('./routes/order.js');


// Middleware
const corsOptions = {
    origin:process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
};
// console.log(process.env.FRONTEND_URL);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
// app.use(checkUser);

// EJS setup 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Routes
app.get('/', async(req, res) => {
  res.render('index');
});
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart',checkAuth, require('./routes/cartRoute.js'));

app.use('/api/admin',checkAuth,checkAuthAdmin, require('./routes/admin.js'));
app.use('/api/order',checkAuth, require('./routes/order.js'));




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => {
        console.error('MongoDB Connection Failed', err);
    });