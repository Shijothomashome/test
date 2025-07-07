import Brand from "../../models/brandModel.js";
import mongoose from "mongoose";

/**
 * @desc    Get a single brand by ID (Admin)
 * @route   GET /api/admin/brands/:id
 * @access  Private/Admin
 */
const getBrandByIdForAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the brand (including soft-deleted ones for admin)
        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        res.status(200).json({
            success: true,
            data: brand
        });

    } catch (error) {
        console.error("Error fetching brand:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export default getBrandByIdForAdmin;