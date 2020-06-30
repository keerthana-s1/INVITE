const path = require('path')
const express = require('express')
const bodyParser=require('body-parser')


const app = express()
const publicDirectoryPath = path.join(__dirname, '/public')
app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use (bodyParser.json()) 
app.get('/login', (req, res) => {
    res.render('login')
    //console.log(req.body)
})

app.post('/reg', (req, res) => {
    res.send('submitted!!')
    console.log(req.body.name)
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})