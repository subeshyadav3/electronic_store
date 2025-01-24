const mongoose = require('mongoose'); 
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const productRouter = require('../routes/productRoute.js');
const authRouter = require('../routes/auth.js');
const { checkAuth } = require('../middlewares/checkAuth.js'); 
const multer=require('multer');
const axios = require('axios'); 

// file uploading 
// Set storage engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  });
  
  // Check file type
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
  app.get('/upload', (req, res) => {
    res.render('file');
  }
    );
  app.post('/upload', upload.single('myFile'), (req, res) => {
    if (req.file) {
      res.send('File uploaded successfully!');
    } else {
      res.send('Error: No file selected!');
    }
  });


// Middleware
const corsOptions = {
    origin: 'http://localhost:5173', // Replace this with your frontend URL
    credentials: true, // Allow cookies to be sent
};

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
  res.send("Hello")
});
app.get('/login', (req, res) => res.render('login'));
app.get('/register', (req, res) => res.render('register'));

app.use('/api/auth', authRouter);
app.use('/api/product',checkAuth, productRouter);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Ecommerce")
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => {
        console.error('MongoDB Connection Failed', err);
    });
