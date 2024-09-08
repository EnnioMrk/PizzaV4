import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        const records = await pb
            .collection('options')
            .getFullList({
                sort: '-created',
            })
            .catch((error) => {
                log('error', error);
                return res.status(400).json(error.originalError.data);
            });
        await pb
            .collection('options')
            .delete(records.find((r) => r.name == req.query.name).id)
            .catch((error) => {
                log('error', error);
                return res.status(400).json(error.originalError.data);
            });

        return res.status(200).json({ message: 'Success' });
    };
};
