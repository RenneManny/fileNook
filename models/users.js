const { name } = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = mongoose.Schema({
  username: { type: "string", required: true },
  email: { type: "String", required: true, unique: true },
  password: { type: "String", required: true },
  
});

// defining the middleware 💯

UserSchema.pre("save", function (next) {
  // console.log(this);
 if(this.password && this.isModified("password")){
  bcrypt.hash(this.password,10,(err,hash)=>{
    if(err)return next(err);
    this.password=hash;
    next();
  });
 }
 else{
  next();
 }
});
// creating function

UserSchema.methods.verifyPassword=function(password,cb){
bcrypt.compare(password,this.password,(err,result)=>{
  return cb(err,result);
})
}

const User = mongoose.model("User", UserSchema);
module.exports = User;

