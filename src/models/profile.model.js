// api/teachers?subject=Math&minYear=5
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const profileImageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
//   size: {
//     type: Number,
//     required: true
//   }
}, {
  timestamps: true
});

profileImageSchema.plugin(mongoosePaginate)

export const fileModel = mongoose.model("ProfileImage", profileImageSchema);
