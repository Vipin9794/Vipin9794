//app.js 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
   console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL );
    
}

app.set("view engine", "ejs" );
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/" , (req , res ) => {
    res.send("Hi , i am root");
});
 

//index route
app.get("/listings", async (req , res ) => {
   const alllistings =  await Listing.find({});
     res.render("listings/index.ejs" , {alllistings})   

});

app.post("/listings" , async (req , res) =>{
    const newlisting = new Listing(req.body.listing) ;
   await newlisting.save();
    res.redirect("/listings");
});

//New Route 
app.get("/listings/new" , (req , res) =>{
    res.render("listings/new.ejs");
});




//Show Route
app.get('/listings/:id', async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId); // Fetch the listing from the database

        if (!listing) {
            return res.status(404).send('Listing not found');
        }

        res.render('listings/show', { listing }); // Pass the listing object to the view
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
//update route 
app.put("/listings/:id" , async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id ,{...req.body.listing} );
    res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listings/:id" , async (req , res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});




//edit route 
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});

// app.get("/testListing" , async (req , res) =>{
//      let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price : 1200,
//         location : " Calangute , Goa",
//         country : "India",
//      });
//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successful testing");

// });


app.listen(8080 , () => {
    console.log("server is listeningto port : 8080");
});