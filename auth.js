const jwt = require('jsonwebtoken')
const User = require('./user')
const auth = async (req, res, next) => {
 try {
 const token = req.params.id
 //console.log(token)
 const decoded = jwt.verify(token, 'logintoken')
 //console.log(decoded)
 //const user = await User.findOne({ _id: decoded._id })
 //const user = await User.findByid (req.params.id)
 const user = await User.findOne({ _id: decoded._id, 'tokens.token':
 token })
 //console.log(user)
 if (!user) {
 throw new Error()
 }
 req.user = user
 req.token=token
 next()
 } catch (e) {
 //res.status(401).send({ error: 'Please authenticate.' })
 res.redirect('/signin')
 }
}
module.exports = auth 