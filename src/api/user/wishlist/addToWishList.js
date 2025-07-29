export const wishList = (req, res, next) => {
    try {
        const userId = req?.user?.userId;
        
    } catch (error) {
        next(error);
    }
};
