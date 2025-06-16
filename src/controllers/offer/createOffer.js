import Offer from "../../models/offerModel.js";

const createOffer = async (req, res) => {
  try {
    const existingOffer = await Offer.findOne({
      title: req.body.title.trim(),
      isDeleted: false,
    });

    if (existingOffer) {
      return res.status(409).json({
        success: false,
        message: "Offer with this title already exists",
      });
    }

    const offer = new Offer(req.body);
    const saved = await offer.save();
    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: saved,
    });
  } catch (err) {
    console.error("Error creating offer:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export default createOffer;
