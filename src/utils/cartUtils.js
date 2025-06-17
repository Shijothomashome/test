const isValidCart = (products = []) => {
    let cartItems = [];
    let totalPrice = 0;
    let totalMRP = 0;
    if (!Array.isArray(products) || products.length === 0) {
        return { success: false, message: "Empty or invalid product list" };
    }

    const productIds = products.map(p => p._id?.toString());
    const uniqueProductIds = new Set(productIds);

    if (productIds.length !== uniqueProductIds.size) {
        return { success: false, message: "Duplicate product IDs" };
    }

    for (const product of products) {
        if (!Array.isArray(product.variants) || product.variants.length === 0) {
            return { success: false, message: "Invalid product or no variants found" };
        }

        for (const variant of product.variants) {
            const quantity = parseInt(variant.selectedQuantity);
            const stock = parseInt(variant.inventory?.stock || 0);
            const price = parseFloat(variant.price?.sellingPrice);
            const mrp = parseFloat(variant.price?.mrp);

            if (isNaN(quantity) || isNaN(stock) || isNaN(price)) {
                return { success: false, message: "Invalid quantity, stock, or price" };
            }

            if (quantity < 1) {
                return { success: false, message: "Quantity must be at least 1" };
            }

            if (quantity > stock) {
                return { success: false, message: "Selected quantity exceeds stock" };
            }

            const subTotal = quantity * price;
            const subMRPTotal = quantity * mrp;

            cartItems.push({
                productId: product._id.toString(),
                variantId: variant._id.toString(),
                quantity,
                mrp,
                sellingPrice: price,
                subTotal,
                subMRPTotal
            });

            totalPrice += subTotal;
            totalMRP += subMRPTotal
        }
    }
    const savedAmount = totalMRP - totalPrice;

    return { success: true, cartItems, totalPrice, totalMRP, savedAmount };
};

const isValidCartWithExist = (products = [], existingProducts = []) => {
    let updatedCartItems = [];
    let totalPrice = 0;
    let totalMRP = 0;
    const seenKeys = new Set();

    if (!Array.isArray(products) || products.length === 0) {
        return { success: false, message: "Empty or invalid product list" };
    }

    const existingMap = new Map();
    const existingPlainProducts = existingProducts.map(doc => doc.toObject());

    for (const item of existingPlainProducts) {
        const key = `${item.productId}_${item.variantId}`;
        existingMap.set(key, { ...item });
    }

    for (const product of products) {
        if (!Array.isArray(product.variants) || product.variants.length === 0) {
            return { success: false, message: `Product ${product._id} has no valid variants` };
        }

        for (const variant of product.variants) {
            const productId = product._id?.toString();
            const variantId = variant._id?.toString();
            const key = `${productId}_${variantId}`;

            if (seenKeys.has(key)) {
                return { success: false, message: `Duplicate variant in cart: ${key}` };
            }
            seenKeys.add(key);

            const quantity = parseInt(variant.selectedQuantity);
            const stock = parseInt(variant.inventory?.stock || 0);
            const price = parseFloat(variant.price?.sellingPrice);
            const mrp = parseFloat(variant.price?.mrp);

            if (isNaN(quantity) || isNaN(stock) || isNaN(price)) {
                return { success: false, message: `Invalid values for ${key}` };
            }

            if (quantity < 1) {
                return { success: false, message: `Quantity must be at least 1 for ${key}` };
            }

            if (quantity > stock) {
                return { success: false, message: `Quantity exceeds stock for ${key}` };
            }

            if (existingMap.has(key)) {
                return { success: false, message: `Item already exists in cart:  ${variant.sku}:${key}` };
            }

            const subTotal = quantity * price;
            const subMRPTotal = quantity * mrp;

            existingMap.set(key, {
                productId,
                variantId,
                quantity,
                sellingPrice: price,
                mrp,
                subTotal,
                subMRPTotal
            });
        }
    }

    for (const item of existingMap.values()) {
        updatedCartItems.push(item);
        console.log(item)
        totalPrice += parseInt(item.subTotal);
        totalMRP += parseInt(item.subMRPTotal);
    }
    const savedAmount = totalMRP - totalPrice;

    return { success: true, cartItems: updatedCartItems, totalPrice, totalMRP, savedAmount };
};

const updateCartItemQtyValidator = (products = [], existingProducts = []) => {
    let updatedItems = [];
    let totalPrice = 0;
    let totalMRP = 0;

    const seenKeys = new Set();

    for (const product of products) {
        if (!Array.isArray(product.variants) || product.variants.length === 0) {
            return { success: false, message: `Product ${product._id} has no variants` };
        }

        for (const variant of product.variants) {
            const productId = product._id?.toString();
            const variantId = variant._id?.toString();
            const key = `${productId}_${variantId}`;

            if (seenKeys.has(key)) {
                return { success: false, message: `Duplicate item: ${key}` };
            }
            seenKeys.add(key);

            const quantity = parseInt(variant.selectedQuantity);
            const stock = parseInt(variant.inventory?.stock || 0);
            const price = parseFloat(variant.price?.sellingPrice);
            const mrp = parseFloat(variant.price?.mrp);
            if (isNaN(quantity) || isNaN(stock) || isNaN(price)) {
                return { success: false, message: `Invalid values for ${key}` };
            }

            if (quantity < 1) {
                return { success: false, message: `Quantity must be at least 1 for ${key}` };
            }

            if (quantity > stock) {
                return { success: false, message: `Quantity exceeds stock for ${key}` };
            }

            const existingItem = existingProducts.find(
                ep => ep.productId.toString() === productId && ep.variantId.toString() === variantId
            );

            if (!existingItem) {
                return { success: false, message: `Item ${key}: not found in existing cart` };
            }

            if (parseFloat(existingItem.sellingPrice) !== price) {
                return { success: false, message: `Price changed for ${key}` };
            }

            const subTotal = quantity * price;
            const subMRPTotal = quantity * mrp;

            updatedItems.push({
                productId,
                variantId,
                quantity,
                sellingPrice: price,
                subTotal,
                mrp,
                subMRPTotal
            });

            totalPrice += subTotal;
        }
    }
    const savedAmount = totalMRP - totalPrice;


    return { success: true, cartItems: updatedItems, totalPrice, totalMRP, savedAmount };
};
const deleteCartItems = (items, itemsToDelete) => {
    if (!items.length) {
        return { success: false, message: 'No items found to delete', cartDelete: true };
    }

    for (const itm of itemsToDelete) {
        const index = items.findIndex(item =>
            item.productId.toString() === itm.productId.toString() &&
            item.variantId.toString() === itm.variantId.toString()
        );

        if (index === -1) {
            return {
                success: false,
                message: `Item with productId: ${itm.productId} and variantId: ${itm.variantId} not found in cart`,
                cartDelete: false
            };
        }

        // Remove item from the array
        items.splice(index, 1);
    }

    const totalPrice = items.reduce((acc, item) => acc + item.subTotal, 0);

    const totalMRP = items.reduce((acc, item) => acc + item.subMRPTotal, 0);

    const savedAmount = totalMRP - totalPrice;

    return {
        success: true,
        message: items.length === 0 ? 'Full cart delete' : 'All items successfully deleted from cart',
        cartDelete: items.length === 0,
        updatedCart: items,
        totalPrice,
        totalMRP,
        savedAmount

    };
};


export default {
    isValidCart,
    isValidCartWithExist,
    updateCartItemQtyValidator,
    deleteCartItems
};
