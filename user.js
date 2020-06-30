const mongoose = require('mongoose')
const validator=require('validator')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
    },
    email: {
    type: String,
    required: true,
    trim: true,
    unique:true,
    //lowercase: true,
    validate(value) {
    if (!validator.isEmail(value)) {
    throw new Error('Email is invalid')
    }
    }
    },
    password:{
        type:String,
        required: true,
        trim:true,
        minlength:7,
        validate(value)
        {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error ('Password cannot contain the word password')
            }
        }
    },
    tokens:[{
        token:{
            type:String
        }
    }]
   })
    //HERE!!!!!!
    userSchema.statics.findByCredentials = async (email, password) => {
        const user = await User.findOne({ email:email,password:password })
    
        if (!user) {
            throw new Error('check your Email/Password')
        }
    
        
       console.log(user.name)
        return user
    }

    userSchema.statics.findByid = async (id) => {
        const user = await User.findOne({ _id: id })
    
        if (!user) {
            throw new Error('Unable to login')
        }
    
        
       console.log(user.name)
        return user
    }

    userSchema.methods.generateAuthToken = async function () {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, 'logintoken',{expiresIn : '6 hours'})
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
       }
  
   /*const gentoken =(user)=>{
    const token = jwt.sign({ _id: user._id.toString()}, 'thisismynewcourse', { expiresIn:
        '10 seconds' })
    user.tokens = user.tokens.concat({ token })
    user.save();
    

    return token
   }*/

 
const User = mongoose.model('User', userSchema)

module.exports = User  