const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            default:null 
        },
        icon:{
            type: Object,
            default:null
        },
        is_active:{
            type: Boolean,
            default:true
        },
    },
    {
        timestamps : true,
        collection: 'property_categories'
    }
);

module.exports = mongoose.model('PropertyCategory',ModelSchema);

