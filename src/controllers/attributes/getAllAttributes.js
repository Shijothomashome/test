import Attribute from "../../models/productAttributeModel.js";

export const getAllAttributes = async (req, res) => {
  try {
    const { isDeleted, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (isDeleted === 'true') filter.isDeleted = true;
    if (isDeleted === 'false') filter.isDeleted = false;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: { path: 'categories', select: 'name slug' }
    };

    const attributes = await Attribute.paginate(filter, options);

    res.json({
      success: true,
      count: attributes.totalDocs,
      totalPages: attributes.totalPages,
      currentPage: attributes.page,
      data: attributes.docs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};