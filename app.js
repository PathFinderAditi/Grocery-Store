const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = 3000;
const SECRET_KEY = 'habdhjabdjk';

app.use(express.json());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

//mongo db
mongoose.connect('mongodb+srv://adititripathi2802:Aditi2002@cluster0.60bqifv.mongodb.net/?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

//schema

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

//model
const User = mongoose.model('User', userSchema);
const Contact = mongoose.model('Contact', contactSchema);







//routes

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/home_page.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public/about.html')));
app.get('/add', (req, res) => res.sendFile(path.join(__dirname, 'public/add.html')));
app.get('/addtocart', (req, res) => res.sendFile(path.join(__dirname, 'public/addtocart.html')));
app.get('/cat1', (req, res) => res.sendFile(path.join(__dirname, 'public/cat1.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public/contact.html')));
app.get('/first-page', (req, res) => res.sendFile(path.join(__dirname, 'public/first page.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public/login.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, 'public/menu.html')));
app.get('/menu1', (req, res) => res.sendFile(path.join(__dirname, 'public/menu1.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public/new_user.html')));



app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

app.post('/contact', async (req, res) => {
    try {
        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        await contact.save();
        res.status(201).send('Message sent successfully');
    } catch (error) {
        res.status(500).send('Error sending message');
    }
});



app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send({ message: 'User not found' });
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid password' });

   
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
