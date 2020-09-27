const express = require("express")
const router = express.Router()
const app = express()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
var MultiStream = require('multistream')


// load all the controllers into router
router.use("/user", require("./user"))
router.use("/product", require("./product"))

const UPLOAD_PATH = path.resolve(__dirname, "../uploads")


router.get("/", function(req, res){
    console.log("count is now" + req.session.count)
    global.count=0

    if(req.session.username){
        console.log(req.session.username)
        console.log(req.session.feed)
        res.render("home.hbs", {
            businessName: req.session.businessName,
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno,
            posts: req.session.feed
  
          })

    }else{
        
            res.render("signin.hbs")
    }
  
  })

router.get("/register", (req, res) =>{
    res.render("register.hbs")
})

router.get("/profile", (req, res) =>{
    global.count=0
    if(req.session.businessName !== ""){
        console.log(req.session.username)
        console.log(req.session.businessName)
        console.log("hello i am going to bprofile")
        console.log(req.session.userID)
        res.render("bprofileEdit.hbs", {
            businessName: req.session.businessName,
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno,
            images: req.session.prods,
            id: req.session.userID,
            logo: req.session.userID
        })
    } else{
        console.log("hello i am going to profile only!")
        console.log(req.session.username)
        res.render("profile.hbs", {
            completeName: req.session.completeName,
            username: req.session.username,
            email: req.session.email,
            contactno: req.session.contactno
        })
    }

})

router.get("/bprofile", (req, res) =>{
    global.count=0
    res.render("bprofileEdit.hbs", {
        username: req.session.username,
        id: req.session.myProducts[0]
    })
})


router.get("/signout", (req, res) =>{
    req.session.destroy()
    res.redirect("/")

})


router.get("/photo/:id", (req, res)=>{
    console.log(count)
    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.feed[count].filename).toString())).pipe(res)

  global.count++
  
})
module.exports = router