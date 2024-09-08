import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        await pb
            .collection('ingredients')
            .create({
                name: req.query.name,
            })
            .catch((error) => {
                log('error', error);
                return res.status(400).json(error.originalError.data);
            });
        return res.status(200).json({ message: 'Success' });
    };
};
