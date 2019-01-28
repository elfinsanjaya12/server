const mongoose = require('mongoose')
const { hashPassword } = require('../helpers')

const buyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name cannot be empty'],
  },
  phone: {
    type: String,
    minlength: [10, 'Minimun phone number length is 10'],
    maxlength: [13, 'Maximum phone number length is 13'],
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    minlength: [10, 'Minimum address length is 10'],
    required: [true, 'Address is required']
  },
  username: {
    type: String,
    minlength: [5, 'Minimum length of username is 5'],
    validate: [{
      validator: (v) => {
        return User.findOne({
          username: v 
        })
        .then((result) => {
          if (result) {
            throw new Error('Username has been registered')
          }
        }).catch((err) => {
          throw new Error(err.errors)          
        });
      },
      message: props => `${props.value} has been registered`
    }],
    required: [true, 'username is required']
  },
  profilePic: {
    type: String
  },
  password: {
    type: String,
    minlength: [5, 'Minimum length of password is 5'],
    required: [true, 'password is required']
  },
  role: {
    type: String,
    required: [true, 'role is required']
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  }
  // itemList: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Item'
  // }]
})


buyerSchema.pre('save', function(next) {
  this.password = hashPassword(this.password)
  next()
})

const User = mongoose.model('User', buyerSchema)

module.exports = User