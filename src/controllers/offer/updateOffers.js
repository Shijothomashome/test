import mongoose from "mongoose";
import Offer from "../../models/offerModel.js";

const updateOffers = async (req, res) => {
  try {
    const offerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer ID.",
      });
    }

    const updatableFields = [
      "title",
      "description",
      "discountType",
      "discountValue",
      "maxDiscountAmount",
      "minPurchaseAmount",
      "validFrom",
      "validTill",
      "usageLimit",
      "isActive",
      "isDeleted",
    ];

    const payload = updatableFields.reduce((obj, key) => {
      if (req.body[key] !== undefined) {
        obj[key] = req.body[key];
      }
      return obj;
    }, {});

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update.",
      });
    }

    payload.updatedAt = new Date();

    const updatedOffer = await Offer.findByIdAndUpdate(offerId, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully.",
      offer: updatedOffer,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(422).json({
        success: false,
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }

    console.error("Offer Update Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export default updateOffers;