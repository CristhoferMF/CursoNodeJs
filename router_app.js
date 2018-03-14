var express=require("express");
var router= express.Router();
var Imagen= require("./models/imagenes");
var image_finder_middleware= require("./middlewares/findimage");

router.get("/",function(req,res){
	/*buscar al usuario*/
	res.render("app/home");
});

/*REST*/
router.get("/imagenes/new",function(req,res){
		res.render("app/imagenes/new");
	});

router.all("/imagenes/:id*",image_finder_middleware);

router.get("/imagenes/:id/edit",function(req,res){
		res.render("app/imagenes/edit");
	});
router.route("/imagenes/:id")
	.get(function(req,res){
		res.render("app/imagenes/show");
	})
	.put(function(req,res){
			res.locals.imagen.title=req.body.title;
			res.locals.imagen.save(function(err){
				if(!err){
					res.render("app/imagenes/show");
				}else{
					res.render("app/imagenes/"+req.params.id+"/edit");
				}
			});
			res.render("app/imagenes/show");
		
	})
	.delete(function(req,res){
		Imagen.findOneAndRemove({_id:req.params.id},function(err){
			if(!err){
				res.redirect("/app/imagenes");
			}else{
				console.log(err);
				res.redirect("/app/imagenes"+req.paramas.id);
			}
		});
	});

router.route("/imagenes")
	.get(function(req,res){
		Imagen.find({creator:res.locals.user._id},function(err,imagenes) {
			if(err){
				re.redirect("/app");
				return;
			}
			res.render("app/imagenes/index",{imagenes:imagenes})
		});
	})
	.post(function(req,res){
		console.log(res.locals.user._id);
		var data={
			title: req.body.title,
			creator: res.locals.user._id
		}

		var imagen= new Imagen(data);

		imagen.save(function(err){
			if(!err){
				res.redirect("/app/imagenes/"+imagen._id);
			}else{
				res.render(err);
			}
		});
	});


module.exports = router;