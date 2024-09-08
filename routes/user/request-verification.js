export default (pb) => {
    return async (req, res) => {
        try {
            const { data, error } = await pb
                .collection('users')
                .requestVerification(req.query.email);
            if (error) {
                return res.status(400).json(error);
            }
            return res.status(200).json(data);
        } catch (error) {
            return res.status(400).json(error);
        }
    };
};
