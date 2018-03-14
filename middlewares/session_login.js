var User = require("../models/user").User;
module.exports= function(req,res,next){
	if(req.session.user_id){
		res.redirect("/app");
	}else{
		next();
	}
}