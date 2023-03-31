const mongoose = require("mongoose");
const bcrypt   = require("bcrypt");
mongoose.set('runValidators', true);

const ModelSchema = new mongoose.Schema(
    {
        author_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "Author",
            required:true,
        },
        icon:{
            type: Object,
            default:false
        },
        title:{
            type: String,
            required:true,
        },
        description:{
            type: String,
            required:true,
        },
        type:{
            type: String,
            enum: ["Appartment","Villa","IndividualHouse"],
            default:"Appartment"
        },
        status:{
            type: String,
            enum: ["Rented","Vacant"],
            default:"Rented"
        },
        pincode:{
            type: Number,
            default:null
        },
        address:{
            type: String,
            default:true
        },
        flat_no:{
            type: Number,
            default:null
        },
        tax_number:{
            type: Number,
            default:null
        },
        total_floors:{
            type: Number,
            default:null
        },
        floor_of_property:{
            type: Number,
            default:null
        },
        age_of_property:{
            type: Number,
            default:null
        },
        face:{
            type: String,
            enum: ["East", "West", "South","North"],
            default:"East"
        },
        property_category:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "PropertyCategory"
        },
        state:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "State"
        },
        city:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "City"
        },
        amenities:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Amenity"
        }],
        rooms:[{
            room_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Room"
            },
            total:{
                type:Number
            }
        }],
        furnishes:[{
            furnish_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Furnish"
            },
            total:{
                type:Number
            }
        }]
    },
    {
        timestamps : true,
        collection: 'properties'
    }
);

module.exports = mongoose.model('Property',ModelSchema);

