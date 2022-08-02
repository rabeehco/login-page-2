// const mongoose = require('mongoose')
// const passportLocalMongoose = require('passport-local-mongoose')
// const Schema = mongoose.Schema

// const UserSchema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     }
// })

// UserSchema.plugin(passportLocalMongoose)

// module.exports = mongoose.model('BionetUser', UserSchema)

const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

module.exports = mongoose.model("user", UserSchema)