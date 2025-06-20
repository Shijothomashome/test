const me = (req, res) => {
    try {
        const { _id, ...rest } = req.user.toObject(); // remove _id

        return res.status(200).json({
            success: true,
            user: rest, // returns all fields except _id
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: Internal Server error',
        });
    }
};

export default me;
