const me = (req, res) => {

    try {
    return res.status(200).json({
       success:true,
       user:req.user 
    })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error:Internal Server error',
        });
    }
}
export default me