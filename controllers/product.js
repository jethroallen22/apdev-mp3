const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Product = require("../models/product")
const bodyparser = require("body-parser")
const auth = require("../middlewares/auth")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
var MultiStream = require('multistream')
const { request } = require("http")

const app = express()

const urlencoder = bodyparser.urlencoded({
  extended : true
})

router.use(urlencoder)

const UPLOAD_PATH = path.resolve(__dirname, "../uploads")
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize : 10000000,
    files : 2
  }
})

global.count = 0

router.post("/deleteProd", (req, res)=>{

  let imgID = req.body.id

  Product.delete(imgID).then((product)=>{
    console.log("successfully deleted")
    global.count=0

    req.session.prods = []
    Product.myProds(req.session.businessName).then((prods)=>{

      console.log("hello this is ur bussiness" + req.session.businessName)
      for(var i=0; i < prods.length; i++){
         
        req.session.prods.push(prods[i])
      }
    })

    console.log(req.session.prods)

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

  },(error)=>{
    res.render("bprofile.hbs", {
      error : error
    })
  })

})


router.post("/addProduct", upload.single("addProduct"), (req, res)=>{
  count=0
  let name = req.body.productName
  let desc = req.body.description
 
  var product = {
    business: req.session.businessName,
    name: name,
    description: desc,
    filename: req.file.filename,
    originalfilename : req.file.originalname
  }


  Product.create(product).then((product)=>{
      console.log("successful " + product)

      console.log(req.session.prods)
      req.session.prods.push(product)

      res.render("bprofileEdit.hbs", {
        businessName: req.session.businessName,
        completeName: req.session.completeName,
        username: req.session.username,
        email: req.session.email,
        contactno: req.session.contactno,
        images: req.session.prods,
        description: desc,
        name: name,
        id: req.session.userID,
        logo: req.session.userID
    })

  },(error)=>{
    res.render("bprofile.hbs", {
      error : error
    })
  })

})



router.get("/photo/:id", (req, res)=>{

    fs.createReadStream(path.resolve(UPLOAD_PATH, (req.session.prods[count].filename).toString())).pipe(res)

  global.count++
  
})





// always remember to export the router for index.js
module.exports = router