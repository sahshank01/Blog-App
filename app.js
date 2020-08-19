let express=require("express");
let expressSenitizer = require("express-sanitizer");
let bodyParser=require("body-parser");
let mongoose = require("mongoose");
let methodOverride= require("method-override");
const app=express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use((expressSenitizer()));

mongoose.connect('mongodb://localhost:27017/blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


// Mongoose/Model config
var blogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created:{type:Date,default:Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);

//Restful Routes
app.get("/",(req,res)=>{
  res.redirect("/blogs");
})

//Create new Route
app.get("/blogs/new",(req,res)=>{
  res.render("new");
})

//Create blog
app.post("/blogs",(req,res)=>{
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.create(req.body.blog,(err,newBlog)=>{
    if(err)
      res.redirect("/blog/new");
    else
      res.redirect("/blogs");
  })
})

//show blogs
app.get("/blogs",(req,res)=>{
  let blogs=Blog.find({},(err,blogs)=>{
    if(err)
      console.log("ERROR OCCOURED!");
    else
      res.render("index",{blogs:blogs});
  })
})

//show blog of given id
app.get("/blogs/:id",(req,res)=>{
  Blog.findById(req.params.id,(err,blog)=>{
    if(err)
      res.redirect("/blogs");
    else
      res.render("show",{blog:blog});
  })
})


//EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
  Blog.findById(req.params.id,(err,blog)=>{
    if(err)
      res.redirect("/blogs");
    else
      res.render("edit",{blog:blog});
  })
})

//UPDATE BLOG
app.put("/blogs/:id",(req,res)=>{
  req.body.blog.body = req.sanitize(req.body.blog.body)
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
    if(err)
      res.redirect("/blog/new");
    else
      res.redirect("/blogs/"+req.params.id);
  })
})

//DELETE BLOG
app.delete("/blogs/:id",(req,res)=>{
  Blog.findByIdAndDelete(req.params.id,(err)=>{
    if(err)
      res.redirect("/blogs");
    else  
      res.redirect("/blogs");
  })
})


app.listen(3000,()=>{
  console.log("Server is running...");
})