const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        amenity_category_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "AmenityCategory"
        },
        name:{
            type: String,
            default:null 
        },
        icon:{
            type: String,
            default:null
        },
        is_active:{
            type: Boolean,
            default:true
        },
    },
    {
        timestamps : true,
        collection: 'amenities'
    }
);

module.exports = mongoose.model('Amenity',ModelSchema);

