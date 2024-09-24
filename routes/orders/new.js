import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        if (
            !req.body ||
            !req.body.sessionId ||
            !req.body.name ||
            !req.body.ingredients ||
            !req.body.priority
        ) {
            log(req.body);
            return res.status(400).json({
                error: 'The body must contain a name, ingredients, priority and a sessionId (and optionally a comment ands options)',
            });
        }

        //get session
        await pb
            .collection('sessions')
            .getFirstListItem(`id="${req.body.sessionId}"`, {
                expand: 'ingredients,options',
            })
            .then(async (record) => {
                let i_ids = record.expand.ingredients
                    .filter((r) => req.body.ingredients.includes(r.name))
                    .map((r) => r.id);

                let o_ids = [];
                if (req.body.options)
                    o_ids = record.expand.options
                        .filter((r) => req.body.options.includes(r.name))
                        .map((r) => r.id);

                log(i_ids);
                log(o_ids);

                pb.collection('orders')
                    .create(
                        JSON.stringify({
                            name: req.body.name,
                            ingredients: i_ids,
                            options: o_ids,
                            comment: req.body.comment,
                            priority: global.config.priority.reverse
                                ? 7 - req.body.priority
                                : req.body.priority,
                        })
                    )
                    .catch((error) => {
                        log('error', error, 1, 1);
                        return res.status(400).json(error.originalError.data);
                    })
                    .then((r) => {
                        log(r);
                        //add order to session
                        pb.collection('sessions')
                            .update(req.body.sessionId, {
                                'orders+': r.id,
                            })
                            .catch((error) => {
                                log('error', error, 1, 1);
                                return res
                                    .status(400)
                                    .json(error.originalError.data);
                            })
                            .then((r) => {
                                return res
                                    .status(200)
                                    .json({ message: 'Success', id: r.id });
                            });
                    });
            })
            .catch((error) => {
                log('session error', error);
                return res.status(400).json({ message: 'Session not found' });
            });
    };
};
