// import CollectionProduct from "../../models/collectionProductModel.js";
// import {handleError} from "../../helpers/handleError.js";

// // @desc    Reorder products in collection
// // @route   PUT /api/collections/:id/reorder
// export const reorderCollectionProducts = async (req, res) => {
//   try {
//     const { collectionId } = req.params;
//     const { order } = req.body;

//     if (!order || !Array.isArray(order)) {
//       throw new Error("Order array is required");
//     }

//     const bulkOps = order.map(item => ({
//       updateOne: {
//         filter: { 
//           collection: collectionId,
//           product: item.productId
//         },
//         update: { position: item.position }
//       }
//     }));

//     await CollectionProduct.bulkWrite(bulkOps);

//     res.status(200).json({
//       success: true,
//       message: "Products reordered successfully"
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };