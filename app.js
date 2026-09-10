const express= require('express');
const app= express();
const mongoose= require('mongoose');
const Listing= require('./models/listing.js');
const port= 8080;
const path= require('path');
const methodOverride= require('method-override');
const ejs= require('ejs');
const ejsMate= require('ejs-mate');

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));



const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error connecting to MongoDB:', err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get('/',(req,res)=>{
    res.send('hi i am root');
});

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//crete new listiings\
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id",async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});

});

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect("/listings");
});

//Delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.get('/testlistings',async (req,res)=>{
    let sampleListing= new Listing({
        title: 'My new villa',
        description: "by the beach",
        price: 1000000,
        location: "California",
        country: "USA",
    });
    await sampleListing.save();
    console.log('Sample listing saved to database');
    res.send('Sample listing saved to database');
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
    
