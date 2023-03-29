const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        tenant_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author"
        },
        name:{
            type: String,
            default:null 
        },
        age:{
            type: Number,
            default:null
        },
        relation:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Relation"
        }
    },
    {
        timestamps : true,
        collection: 'co_tenants'
    }
);

module.exports = mongoose.model('CoTenant',ModelSchema);

