app.get("/create", () => { 
	var userExample = new User({
		user : "Tiago Oliveira",
		password : "loiradoida",
		admin : true
	})
});

userExample.save((error) => { 
	if(error)
		throw error;

	console.log("Usuario criado com sucesso!!");

	res.json({
		sucess : true
	})
})