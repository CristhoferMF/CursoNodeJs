var express=require("express");
var bodyParser=require("body-parser");
var User= require("./models/user").User;
var router_app= require("./router_app");
var cookieSession=require("cookie-session");
var session_middleware= require("./middlewares/session");
var session_middleware_login= require("./middlewares/session_login");
var methodOverride=require("method-override");
var app= express();


//middleware
app.use("/public",express.static('public'));
app.use(methodOverride("_method"));
app.use(bodyParser.json());// para peticiones json
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));
app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
}));
app.use("/login",session_middleware_login);
app.use("/signup",session_middleware_login);
app.set("view engine","jade");

/* /app */

/* / */

app.get("/",function(req,res){
	console.log(req.session.user_id);
	res.render("index");
});
app.get("/signup",function(req,res){
	User.find(function(err,doc) {
		console.log(doc);
		res.render("signup");
	});
	
});
app.get("/login",function(req,res){
		res.render("login");
});
app.post("/users",function(req,res){
	var user= new User({
		email:req.body.email,
		password: req.body.password,
		username: req.body.username,
		password_confirmation:req.body.password_confirmation});
	//console.log(user.password_confirmation);
	user.save().then(function(us){
		res.send("Guardamos el usuario exitosamente");
	}),function(err){
		if(err){
			console.log(String(err));
			res.send("No podemos guardar la informacion");
		}
	};
});
app.post("/sessions",function(req,res){
	/*res.render("sessions");
	User.findById("5a86f77e8147010d7c487c5c",function(){

	});*/
	User.findOne({
		email:req.body.email,
		password:req.body.password},
		function(err,user){
			console.log(user);
			req.session.user_id = user._id;
			res.redirect("app/");
	});
});
app.use("/app",session_middleware);
app.use("/app",router_app);
app.listen(8080);