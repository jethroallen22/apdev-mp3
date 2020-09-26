const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const mongoose =require("mongoose")
const {User} = require("./models/user.js")
const bcrypt = require("bcrypt")
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");


mongoose.Promise = global.Promise

mongoose.connect("mongodb://localhost:27017/helpinghand-db", {
    useNewUrlParser: true
 })


const app = express()

const urlencoder = bodyparser.urlencoded({
    extended:false
})


app.use(express.static("public"));
app.use(require("/controllers"))

app.use(session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000* 60 * 60
    }
}))

app.set("view engine", "hbs");

app.use(cookieparser())

app.get("/", (req, res) =>{
    if(req.session.username){

        res.render("home.hbs", {
            username: req.session.username
        })

    }else{
    
            res.render("signin.hbs")
    }
})

app.get("/register", (req, res) =>{
    res.render("register.hbs")
})

app.get("/aboutus", (req, res) =>{
    res.render("aboutus.hbs")
})

app.get("/home", (req, res) =>{
    User.findOne({username: req.session.username}).then(user => {
        if (user) {
            let errors = {};
                res.render("home.hbs", {
                    username: req.session.username
                })
        } else {
            console.log("profile not found")
            res.redirect("/")
        }
    })
})


app.get("/inbox", (req, res) =>{
    User.findOne({username: req.session.username}).then(user => {
        if (user) {
            let errors = {};
                res.render("inbox.hbs", {
                    username: req.session.username
                })
        } else {
            console.log("profile not found")
            res.redirect("/")
        }
    })
})

app.get("/message", (req, res) =>{
    User.findOne({username: req.session.username}).then(user => {
        if (user) {
            let errors = {};
                res.render("message.hbs", {
                    username: req.session.username
                })
        } else {
            console.log("profile not found")
            res.redirect("/")
        }
    })
})

app.get("/profile", (req, res) =>{

    User.findOne({username: req.session.username}).then(user => {
        if (user) {
            let errors = {};
            if (user.businessName !== "" ) {
                res.render("bprofile.hbs", {
                    businessName: user.businessName
                })
                console.log("u have a business")
            } else {
                res.render("profile.hbs", {
                    completeName: user.fullname,
                    username: user.username,
                    email: user.email,
                    contactno: user.contactNum
                })
            }
            
        } else {
            console.log("profile not found")
            res.redirect("/")
        }
    })


})

app.get("/bprofile", (req, res) =>{
    res.render("bprofile.hbs")
})


app.post("/register", urlencoder, (req,res)=>{

    let username = req.body.username
    let fullname = req.body.cn
    let password = req.body.password
    let email = req.body.email
    let contactno = req.body.contactNum
    let businessname = req.body.businessName

    console.log(username)

    User.findOne({
        $or: [{
            username: req.body.username
        }, {
            email: req.body.email
        }]
    }).then(user => {
        if (user) {
            let errors = {};
            if (user.username == req.body.username) {
                res.render("register.hbs", {
                    error: "Username not available"
                })
            } else {
                res.render("register.hbs", {
                    error: "email not available"
                })
            }
            
        } else {
            let hash = bcrypt.hashSync(password, 10);
            var user = new User ({
                         username: username,
                         email: email,
                         fullname: fullname,
                         contactNum: contactno,
                         password:hash,
                         businessName: businessname
                       // ,logo: idk
                 })
    
                 user.save().then((doc) =>{
                          console.log("successfully added: " + doc)
                             }, (err) => {
                                 console.log("Error in adding: " + err)
                             })
    
            res.render("home.hbs")
            req.session.username = req.body.username
            res.redirect("/")
        }
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        });
    });
    

})


 app.post("/login", urlencoder, (req,res)=>{

    req.session.username = req.body.username

      User.findOne({username: req.body.username}, function(err, user){
          if(err) {
              console.log(err);
          }
          else if(user){
            if(bcrypt.compareSync(req.body.password, user.password)) {
                res.redirect("/")
              
               } else {
                
                res.render("signin.hbs", {
                    error: "incorrect username or password"
                })
               }
              
          }
          else {
            res.render("signin.hbs", {
                error: "incorrect username or password"
            })
              console.log("invalid");
              
          }
      });


  })


  
app.post("/addBusiness", urlencoder, (req,res)=>{

    //when user adds a business to their profile
    res.render("profile.hbs")
    console.log("business successfully added")
})

app.post("/addProduct", urlencoder, (req,res)=>{

    //when user adds a business to their profile
    res.render("bprofile.hbs")
    console.log("product successfully added")
})

app.post("/editProduct", urlencoder, (req,res)=>{

    //when user edits a product in the business page
    res.render("bprofile.hbs")
    console.log("")
})


app.listen(3000, function(){
    console.log("now listening to port 3000")
})

app.get("/signout", (req, res) =>{
    req.session.destroy()
    res.redirect("/")

})