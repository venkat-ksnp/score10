const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        landlord_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author",
            required:true
        },
        package_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Package",
            required:true
        },
        is_active:{
            type: Boolean,
            default:true
        },
    },
    {
        timestamps : true,
        collection: 'cities'
    }
);

module.exports = mongoose.model('LandlordPackage',ModelSchema);

