import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';

const FAQSchema = new Schema({
    questionText: {type: String, required:true, unique:true},
    answerText: {type: String, required:true},
    customer: {type: mongoose.Schema.Types.ObjectId, ref:"Customer"},
    creationDate: {type: Date, default:Date.now},
    questionPossition: {type:Number, unique:true},
})

export default model('FAQ', FAQSchema);