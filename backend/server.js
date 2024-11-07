import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './config/models/product.model.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json()); // Allows us to accept JSON data in the body

app.get("/api/products",async (req,res)=>{
    try {
        const products=await Product.find({});
        res.status(200).json({success:true,data:products});
    } catch (error) {
        console.log("error in fetching products",error.message);
        res.status(500).json({success:false,message:"Server error"});
        
    }
})

// Define POST route for creating products
app.post('/api/products', async (req, res) => {
    const product = req.body;  // The user sends this data in the request body

    // Updated validation logic: Check each field individually
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // If all fields are provided, create a new Product instance
    const newProduct = new Product(product);
    try {
        // Save the product to the database
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creating product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//UPDATING A PRODUCT
app.put("/api/products/:id",async(req,res)=>{
    const{id}=req.params;
    const product=req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success:false,message:"Invalid Product id"});
    }
    try {
       const updatedProduct= await Product.findByIdAndUpdate(id,product,{new:true});
        res.status(200).json({success:true,data:updatedProduct});

    } catch (error) {
        console.log("error in deleting a product:",error.message);
        res.status(500).json({success:false,message:"Product not found"});
        
    }

})
//Deleting a product
app.delete("/api/products/:id",async(req,res)=>{
    const{id}=req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({success:true,message:"Product deleted"});

    } catch (error) {
        console.log("error in deleting a product:",error.message);
        res.status(500).json({success:false,message:"Product not found"});
        
    }
});

// Start server and connect to database
app.listen(5000, () => {
    connectDB();
    console.log('Server started at http://localhost:5000');
});
