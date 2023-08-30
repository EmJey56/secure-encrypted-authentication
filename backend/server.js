const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')

const SECRET_KEY = 'secretkey'



const app = express()

// connect to mongoDB
const dbURI = 'mongodb+srv://junaidh5642:123456qwerty@cluster0.qg0qbpo.mongodb.net/UsersDB?retryWrites=true&w=majority'
mongoose
.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    app.listen(3001, () => {
        console.log('Server connected to port 3001 and MongoDb')
    })
})
.catch((error) => {
    console.log('Unable to connect to Server and/or MongoDB', error)
})

//middleware
app.use(bodyParser.json())
app.use(cors())



//Routes
//USER REGISTRATION
//POST REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email, username, password: hashedPassword})
        await newUser.save()
        res.status(201).json({ message: 'User created successfully'})
    } catch (error) {
        res.status(500).json({ error: 'Error signing up'})
    }
})

//GET REGISTERED USERS
app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
    }catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
})


//GET LOGIN
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' })
        res.json({ message: 'Login successful' })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
})


//create // post request
//read // get request
//update // put or patch request
//Delete // delete request