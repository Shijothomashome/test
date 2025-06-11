import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"; 

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    values: [{ type: String }],// like ["Red", "Blue", "Green"]
    isGlobal: { type: Boolean, default: false },
    // categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isVariantAttribute: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String },
  },
  { timestamps: true }
);

attributeSchema.plugin(mongoosePaginate);

export default mongoose.model("Attribute", attributeSchema);
