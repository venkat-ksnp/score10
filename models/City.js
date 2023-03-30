const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        state_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "State"
        },
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
        collection: 'cities'
    }
);

module.exports = mongoose.model('City',ModelSchema);

