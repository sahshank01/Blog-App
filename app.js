let express=require("express");
let bodyParser=require("body-parser");
let mongoose = require("mongoose");
const app=express();

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

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


app.get("/blogs",(req,res)=>{
  let blogs=Blog.find({},(err,blogs)=>{
    if(err)
      console.log("ERROR OCCOURED!");
    else
      res.render("index",{blogs:blogs});
  })
})



app.listen(3000,()=>{
  console.log("Server is running...");
})