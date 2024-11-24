const mongoose= require('mongoose');
//defenir le shéma utilisateur 
const UserSchema = new mongoose.Schema({
    firstname:{
    type: String,
    required: true,
   },
lastname:{
    type: String,
    required: true,
    
},
email:{
    type: String,
    required: true,
    unique: true,//l'email doit etre unique
    match: /.+\@.+\..+/
},
password:{
    type: String,
    required:true,//le mot de passe est requis 

},

wishlist: {
    type: [String], // Array of item IDs
    default: [], // Initialize wishlist as an empty array
},
cart: [{
    item_id: {
        type: String, // ID of the item
        // Item ID is required
    },
    quantity: {
        type: Number,
        default: 1, // Default quantity is 1
        min: 1, // Minimum quantity allowed is 1
    },
}],
phoneNumber: {
    type: String,
    required: true,  // Phone number is required
  },
  profilePicture: {
    type: String,  // File path for profile picture
    default: null,  // Default to null if no picture uploaded
  }
});
//creer un model base sur ce schema 
const User= mongoose.model('User',UserSchema);
module.exports=User;