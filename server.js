const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/login', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

app.post('/api/register', async (req,res) => {
    
    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: "Invalid Username" })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: "Invalid password" })
    }

    if (plainTextPassword.length < 8) {
        return res.json({ status: 'error', error: "Password to short. At least 8 characters" })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)
    
    try {
        const response = await User.create({
            username,
            password
        })
        console.log('User made: ', response)
    } catch(error) {
        if(error.code === 11000) {
            return res.json({status: 'error', error: "Username In Use!"})
        }
        throw error
    }

    res.json({ status: 'ok' })
})

app.listen(9999, () => {
    console.log("Server up on port 9999")
})