export default (pb) => {
    return async (req, res) => {
        if (!global.config.auth.enabled) {
            return res.status(201).json({
                priorityEnabled: global.config.priority.enabled,
                priorityFreeChange: global.config.priority.freeChange,
                message: 'No authentication required',
            });
        }
        if (!req.cookies.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await pb.collection('users').getOne(req.cookies.id);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        return res
            .status(200)
            .json({
                ...user,
                priorityFreeChange: global.config.priority.freeChange,
            });
    };
};
