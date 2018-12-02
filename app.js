	"use strict";

const express = require("express");
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser")
const app = express();

console.log(jwt);
const userModel = require("./src/models/userModel.js");
const config = require("./config.js");
mongoose.connect(config.database, { useNewUrlParser : true}).then( connection => { 
	console.log("connected to mongoDb with mongoose");
})
.catch( error => { 
	console.log("error in the connection between mongoose and mongoDB", error.message);
})
mongoose.set('useCreateIndex', true);
app.set("superNode-auth", config.configName);


app.listen(port, (error) => {
	if(error) 
		console.log(error)
	console.log("server listing in port ", port)
})
app.use(express.json());

const apiRoutes = express.Router();
app.use("/api", apiRoutes);

apiRoutes.get("/", (req, res) => {
	res.send("hello word");
	console.log("test");  
});

apiRoutes.post("/create", async (req, res) => { 
	
	var user = await userModel.create(req.body).catch( error => {
		return res.status(400).json({
			sucess : false,
			message : error
		}) 
	})

		res.json({
		sucess : true
	})
});

apiRoutes.post("/authenticate", (req ,res) => { 
	userModel.findOne({user : req.body.user}, (error, user) => { 

		if(error)	
			return res.json(error)

			if(!user){
				 return res.json({
					sucess : false, 
					message : "user not found, try again!"
				})
			}
			if(req.body.password !== user.password) { 
				return res.json({
					sucess: false,
					message : "password invalid, try again"
				})
			}
			
			var token = jwt.sign(user.toJSON(), app.get("superNode-auth"), { 
				expiresIn : 1440
			});

			res.json({
				sucess : true,
				message : "user authenticate with sucess",
				token
			})
		
	})
})

apiRoutes.use((req, res, next) => { 
	var token = req.body.token || req.query.token || req.headers["x-acesss-token"];

	if(token){
		jwt.verify(token, app.get("superNode-auth"), (error, decoded) => { 
			if(error)
				return res.json({
					sucess : false,
					message : "Falha na autenticação do token!" 
				})

			else {
				req.decoded = decoded
				next();
			}


		})
	}
	else {
		return res.status(403).json({
			sucess : false,
			message : "não há token"
		})
	}
})



apiRoutes.get("/usuarios", (req, res) => { 
	userModel.find({}, (error, users) => { 

		if(error)
			return res.send(error)

		res.json(users);
	})
})




