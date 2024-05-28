const mongoose = require('mongoose');
const fileSchema = new mongoose.Schema({
    filename: String,
    size: Number,
    uploadedAt: Date,
    photoPath:String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

});

const File=mongoose.model("File",fileSchema);
module.exports=File;