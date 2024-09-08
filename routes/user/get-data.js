export default (pb) => {
    return async (req, res) => {
        if (!req.cookies.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await pb.collection('users').getOne(req.cookies.id);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res.status(200).json(user);
    };
};
