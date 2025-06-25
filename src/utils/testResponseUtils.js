const testResponse = (req, res) => {
    res.status(200).json({ message: 'You are authenticated', user: req.user });
};

export default testResponse;