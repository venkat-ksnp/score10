const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        lanlord_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author",
            required:true,
        },
        tenant_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author",
            required:true,
        },
        property_id:{
            type    : mongoose.Schema.Types.ObjectId,
            ref     : "Property",
            default : null
        },
        landlord_status:{
            type: String,
            enum: ["Sent","Accepted","Rejected"],
            default:"Sent"
        },
        landlord_reject_reason:{
            type: String,
            default:true,
        }
    },
    {
        timestamps : true,
        collection: 'landlord_tenants'
    }
);

module.exports = mongoose.model('LanlordTenant',ModelSchema);

