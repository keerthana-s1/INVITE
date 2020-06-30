const mongoose = require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const userSchem = new mongoose.Schema({
    host: {
        type: String,
        required: true,
        trim: true
        },
    guests:[{
        
                type:String
            
        }] ,   
    name: {
    type: String,
    required: true,
    trim: true
    },
    date: {
    type: Date,
    required: true,
    trim: true
  
    },
    place:{
        type:String,
        required: true,
        trim:true
    }
    
   })
   userSchem.statics.findByhost = async (host) => {
       //console.log('here')
    const event = await Event.find({ host:host })

    if (!event) {
        throw new Error('No events exist')
    }

    var ename=[]
    var eid=[]
    event.forEach((item)=>{
        //ename=ename.concat({name :item.name})
        ename=ename.concat(item.name)
        eid=eid.concat(item._id)
        //console.log(item.name)
    })
    //console.log(ename)
   //console.log(event[0].name)
   return {
    eid:eid,
    ename:ename
}
}

userSchem.statics.findByguest = async (host) => {
 const event = await Event.find({ 'guests.':host })

 if (!event) {
     throw new Error('No events exist')
 }

 var eid=[]
 var ename=[]
 event.forEach((item)=>{
     //ename=ename.concat({name :item.name})
     ename=ename.concat(item.name)
     eid=eid.concat(item._id)
     //console.log(item.name)
 })
 //console.log(ename)
//console.log(event[0].name)
 return {
     eid:eid,
     ename:ename
 }
}
   const Event = mongoose.model('Event', userSchem)

   module.exports = Event  