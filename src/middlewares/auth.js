

export const auth = (req, res, next) => {
    
    
    const user = {_id:"687530ee5bd63aaf0810c8ec"}
    
    req.user =  user;
    next();
};
