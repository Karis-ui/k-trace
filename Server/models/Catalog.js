import mongoose from "mongoose";

const CatalogSchema = new mongoose.Schema({
    lotId: {type:String,required:true,unique:true},
    weight: Number,
    grade: String,
    cuppingScore: Number,
    moisture: Number,
    defects: Object,
    totalPayout: Number,
    date: Date,

    variety: String,
    altitude: String,
    processing: String,
    imageUrl: String,
    status: {type:String,default:"Available"}
});

const Catalog = mongoose.model("Catalog",CatalogSchema);
export default Catalog;