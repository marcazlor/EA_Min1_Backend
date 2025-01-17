import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const CustomerSchema = new Schema({
    customerName: {type: String, required:true, unique:true},
    fullName: {type: String, required:true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    creationDate: {type: Date, default:Date.now},
    listTastes:[{
        tagName:{type:String},
        relevance:{type:Number}  //This value will be dynamically updated with the user activity.
    }],  
    listDiscounts:[{
        nameRestaurant:{type:String},
        amount:{type:Number},
        expirationDate:{type:String}
    }],
    listReservations: [{type:mongoose.Schema.Types.ObjectId, ref:"Reservation"}] //Array containing the IDs of the reservations of the customer.
})

export default model('Customer', CustomerSchema);