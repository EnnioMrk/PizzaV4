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
        return res.status(200).json(records.map((r) => r.name));
    };
};
