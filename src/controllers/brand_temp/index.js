import  {createBrand}  from "./createBrand.js";
import { DeleteBrand } from "./deleteBrand.js";
import { getAllBrands } from "./getAllBrandsAdmin.js";
import { getCustomerBrands } from "./getAllBrandUser.js";
import { toggleBrandStatus } from "./toggleBrandStatus.js";
import { updateBrand } from "./updateBrand.js";




export default {
 createBrand,
 DeleteBrand,
 getAllBrands, //Admin
 getCustomerBrands,
 toggleBrandStatus,
 updateBrand,

}