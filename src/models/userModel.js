const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	"user" : {
		type : String,
		unique : true,
		required : true
	},
	"password" : {
		type : String,
		required : true
	},
	admin : {
		type : Boolean,
		default : false
	}
})

module.exports = mongoose.model("User", userSchema);
