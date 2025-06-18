// import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

// const attributeSchema = new mongoose.Schema(
//   {
//     name: { 
//       type: String, 
//       required: true, 
//       unique: true, 
//       trim: true,
//       lowercase: true 
//     },
//     values: [{ 
//       type: String,
//       trim: true 
//     }],
//     isGlobal: { type: Boolean, default: false },
//     categories: [{ 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "Category" 
//     }],
//     isVariantAttribute: { type: Boolean, default: true },
//     isActive: { type: Boolean, default: true },
//     isDeleted: { type: Boolean, default: false },
//     deletedAt: { type: Date },
//     deletionReason: { type: String },
//   },
//   { 
//     timestamps: true,
//     collation: { locale: 'en', strength: 2 } // Case-insensitive collation
//   }
// );

// // Create case-insensitive index for name
// attributeSchema.index({ name: 1 }, { 
//   unique: true, 
//   collation: { locale: 'en', strength: 2 } 
// });

// // Pre-save hook to trim and lowercase name
// attributeSchema.pre('save', function(next) {
//   if (this.isModified('name')) {
//     this.name = this.name.trim().toLowerCase();
//   }
  
//   // Remove duplicate values
//   if (this.isModified('values')) {
//     this.values = [...new Set(this.values.map(v => v.trim()))];
//   }
//   next();
// });

// // Pre-update hook to handle name changes
// attributeSchema.pre('findOneAndUpdate', function(next) {
//   const update = this.getUpdate();
//   if (update.$set && update.$set.name) {
//     update.$set.name = update.$set.name.trim().toLowerCase();
//   }
//   next();
// });

// attributeSchema.plugin(mongoosePaginate);

// export default mongoose.model("Attribute", attributeSchema);



import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const attributeSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      lowercase: true 
    },
    values: [{ 
      type: String,
      trim: true 
    }],

    isGlobal: { type: Boolean, default: false },
    categories: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category" 
    }],
    isVariantAttribute: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletionReason: { type: String },
  },
  { 
    timestamps: true,
    collation: { locale: 'en', strength: 2 }
  }
);

// Create case-insensitive index for name
attributeSchema.index({ name: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});

// Pre-save hook to trim and lowercase name
attributeSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name = this.name.trim().toLowerCase();
  }
  
  // Remove duplicate values
  if (this.isModified('values')) {
    this.values = [...new Set(this.values.map(v => v.trim()))];
  }
  if (this.isModified('selectedValues')) {
    this.selectedValues = [...new Set(this.selectedValues.map(v => v.trim()))];
  }
  next();
});

// Pre-update hook to handle name changes
attributeSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.name) {
    update.$set.name = update.$set.name.trim().toLowerCase();
  }
  next();
});

attributeSchema.plugin(mongoosePaginate);

export default mongoose.model("Attribute", attributeSchema);