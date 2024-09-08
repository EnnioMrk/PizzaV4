import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        if (!req.body || !req.body.sessionId) {
            log(req.body);
            return res.status(400).json({
                error: 'The body must contain a sessionId',
            });
        }
        pb.collection('sessions')
            .getFirstListItem(`id="${req.body.sessionId}"`, {
                sort: '-created',
                expand: 'orders.ingredients,orders.options',
            })
            .then((record) => {
                //check if last create session is still active (less than 1 hour)
                log('debug', record, 1, 1);
                return res.status(200).json(
                    record.expand?.orders?.map((i) => {
                        return {
                            name: i.name,
                            ingredients:
                                i.expand?.ingredients?.map((i) => i.name) || [],
                            options:
                                i.expand?.options?.map((i) => i.name) || [],
                            comment: i.comment,
                            priority: i.priority,
                        };
                    }) || []
                );
            })
            .catch((error) => {
                return res
                    .status(400)
                    .json({ error: 'The session could not be found' });
            });
    };
};
