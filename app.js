var express= require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");mongoose.connect("mongodb://localhost/blog_app");
var methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static("public"));

//SCHEMA
var BlogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type: Date ,default: Date.now}
});
var Blog=mongoose.model("Blog",BlogSchema);

app.get("/",function (req,res) {
    res.redirect("/blogs");
})
// Blog.create({
//     title:"Test Blog",
//     image:"https://images.unsplash.com/photo-1485832329521-e944d75fa65e?auto=format&fit=crop&w=750&q=80",
//     body:"Hello This is the test blog"
// })

//index
app.get("/blogs",function(req,res){
    Blog.find({},function(err, blogs){
        if (err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs})
        }
    })
});

//new
app.get("/blogs/new",function(req,res){
    res.render("new")
});
//Create
app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    });
});

//show
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if (err){
            console.log(err)
        }else{
            res.render("show",{blog: blog });
        }
    });

})

//edit
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if (err){
            console.log(err)
        }else{
            res.render("edit",{blog: blog });
        }
    });
})

//update
app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//destroy
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
});


app.listen("3000",function(){
    console.log("Server started successfully ")
})