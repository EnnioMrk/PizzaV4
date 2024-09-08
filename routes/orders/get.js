import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        if (!req.body || !req.body.id) {
            log(req.body);
            return res.status(400).json({
                error: 'The body must contain an id',
            });
        }
        pb.collection('orders')
            .getFirstListItem(`id="${req.body.id}"`, {
                sort: '-created',
                expand: 'ingredients,options',
            })
            .then((record) => {
                //check if last create session is still active (less than 1 hour)
                log('debug', record, 1, 1);
                return res.status(200).json({
                    name: record.name,
                    ingredients:
                        record.expand?.ingredients?.map((i) => i.name) || [],
                    options: record.expand?.options?.map((i) => i.name) || [],
                    comment: record.comment,
                    priority: record.priority,
                });
            })
            .catch((error) => {
                return res
                    .status(400)
                    .json({ error: 'The session could not be found' });
            });
    };
};
