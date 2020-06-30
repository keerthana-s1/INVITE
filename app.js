require('./mongoose')

const User=require('./user')
const Event=require('./event')
const auth =require('./auth')
const path = require('path')
const express = require('express')
const bodyParser=require('body-parser')

var token

const app = express()
const publicDirectoryPath = path.join(__dirname, '/public')
app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use (bodyParser.json()) 
app.get('/reg', (req, res) => {
    res.render('login')
    //console.log(req.body)
})
app.get('/', (req, res) => {
    res.render('blank')
    //console.log(req.body)
})

app.get('/signin', (req, res) => {
    res.render('signin')
    //console.log(req.body)
})

app.post('/reg', (req, res) => {

    //console.log(req.body.name)
    const user = new User (req.body)
    user.save().then(() => {
          res.render('signin')
    }).catch((e) => {
          res.render('login',{
           error:e.message
    }).status(400)
    
 })
})

app.post('/newevent/:id',auth, async (req, res) => {

    //console.log(req.body.name)
    req.body.guests=req.body.guests.split(',')
    const event = await new Event (req.body)
    console.log(req.body)
    console.log(event)
    //console.log(event)
    event.save().then(() => {
          res.redirect('/home/'+req.params.id)
    }).catch((e) => {
        res.redirect('/home/'+req.params.id)
           error:e.message
    })
    
 })


app.get('/:id',async (req,res) => {
    try {
        const url = '/home/'+req.params.id
        res.render('blankin',{user: user, id:url })
        //
    } catch(e){
        res.status(400).send()
    }
    
    //res.send()
})


app.get('/home/:id',auth,async (req,res) => {
    try {
        //const user = await User.findByid (req.params.id)
        const event = await Event.findByguest(req.user.email)
        const url = '/logout/'+req.params.id
        const newu = '/newevent/'+req.params.id
        const my='/events/'+req.params.id
        //console.log(req.user)
        res.render('homepage',{user: req.user, id:url ,newevent:newu,events:my,invite:event,token:req.token})
        //
    } catch(e){
        res.status(400).send()
    }
    
    //res.send()
})


app.get('/invite/:in/:id',auth,async (req,res) => {
    try {
        const event = await Event.findOne({ _id:req.params.in , 'guests.':req.user.email})
        //console.log(event.guests)
        //console.log(req.user.email)
        if(event)
        {
            
            const url = '/logout/'+req.params.id
            const my='/events/'+req.params.id
            const home='/home/'+req.params.id
            //console.log(req.user)
            res.render('eventpage',{home:home,user: req.user, id:url ,events:my,event:event,token:req.token})
        }
        if(!event)
        {
            res.send('nope')
        }
    } catch(e){
        res.status(400).send(e)
    }
    
})

app.get('/myinvite/:in/:id',auth,async (req,res) => {
    try {
        const event = await Event.findOne({ _id:req.params.in , host:req.user.name})
        //console.log(event.guests)
        //console.log(req.user.email)
        if(event)
        {
            
            const url = '/logout/'+req.params.id
            const my='/events/'+req.params.id
            const home='/home/'+req.params.id
            //console.log(req.user)
            res.render('eventpage',{home:home,user: req.user, id:url ,events:my,event:event,token:req.token,guest:event.guests})
        }
        if(!event)
        {
            res.send('nope')
        }
    } catch(e){
        res.status(400).send(e)
    }
    
})


app.get('/events/:id',auth,async (req,res) => {
    try {
       const event = await Event.findByhost(req.user.name)
        //res.render('homepage',{user: req.user, id:url ,newevent:newu})
        const url = '/logout/'+req.params.id
        const newu = '/newevent/'+req.params.id
        const my='/events/'+req.params.id
        const home='/home/'+req.params.id
        //console.log(req.user)
        //res.send(event)
        res.render('myevents',{user: req.user, invite:event,id:url ,newevent:newu,events:my,home:home,token:req.token}) 
    } catch(e){
        res.status(400).send(e)
    }
    
    //res.send()
})

app.get('/logout/:id',auth,async (req,res) => {
    try {
        req.user.tokens=req.user.tokens.filter((token)=> {
              return token.token !== req.token
        })
        req.user.save()
        res.redirect('/signin')
    } catch(e){
        res.status(400).send()
    }
    
    //res.send()
})


app.post('/home', async(req, res) => {

    //console.log(req.body.name)
   /* User.finduser(req.body.email,req.body.password).then((user) => {
     token = User.gentoken(user);
        res.render('home',{
           user,token
     })
     
     //console.log(user)
    // console.log(token)
  }).catch((e) => {
        res.render('login',{
         error:e.message
  }).status(400)
  
})*/
try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    if(user){
        
        const token = await user.generateAuthToken()
        
        const url ='/home/'+token
        //console.log(token)
        res.redirect(url)
    }
    
    
} catch (e) {
    res.status(400).render('signin',{error:e})
}
    
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})