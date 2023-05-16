//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const homeStartingContent = "This is a blog website where you can post your blogs. You can also view other people's blogs. You can also delete your blogs.";
const aboutContent = "I am Rohit Kumar Rout. I am a final year student of VIT, Vellore University. I am a web developer. I have made this website using Node.js, Express.js, EJS, MongoDB, Mongoose, Lodash, HTML, CSS, Bootstrap.";
const contactContent = "You can contact me at rohitiitrout416@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p1fuuzq.mongodb.net/Blog?retryWrites=true&w=majority`);

const blogSchema = {
  title: String,
  post: String
};

const Blog = mongoose.model("Blog", blogSchema);

const posts = [];

app.get("/", async(req, res)=>{
  const posts = await Blog.find({}).exec();
  res.render("home", {homeStartingContent: homeStartingContent,posts: posts});
})

app.get("/about", (req, res)=>{
  res.render("about", {about: aboutContent});
})

app.get("/contact", (req,res)=>{
  res.render("contact", {contact: contactContent});
})

app.get("/compose", (req,res)=>{
  res.render("compose");
})

app.post("/compose", (req,res)=>{
  const blogPost = new Blog({title:lodash.capitalize(req.body.postTitle), post:req.body.blogPost});
  blogPost.save();
  res.redirect('/');
})

app.get("/posts/:post", async(req, res)=>{
  var url_id = lodash.capitalize(req.params.post);
  const post = await Blog.findOne({title: url_id}).exec();
    if(!post)
      res.send("No post found");
    else
      res.render("post", {title: post.title, content: post.post});
});







app.listen(process.env.PORT, function() {
  console.log("Server started on port 3000");
});
