const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        property_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Property",
            required:true,
        },
        icon:{
            type: Object,
            default:false
        }
    },
    {
        timestamps : true,
        collection: 'property_gallery'
    }
);

module.exports = mongoose.model('PropertyImage',ModelSchema);

