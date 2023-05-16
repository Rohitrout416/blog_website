//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

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
