import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        if (!req.body || !req.body.ingredients) {
            log(req.body);
            return res.status(400).json({
                error: 'The body must contain ingredients (and optionally options)',
            });
        }

        //get ingredient ids
        const records = await pb
            .collection('ingredients')
            .getFullList()
            .catch((error) => {
                log('ingredient error', error);
                return res.status(400).json(error.originalError.data);
            });

        log(records);

        let i_ids = records
            .filter((r) => req.body.ingredients.includes(r.name))
            .map((r) => r.id);

        let o_ids = [];
        if (req.body.options)
            o_ids = records
                .filter((r) => req.body.options.includes(r.name))
                .map((r) => r.id);

        log(i_ids);
        log(o_ids);
        await pb
            .collection('sessions')
            .create(
                JSON.stringify({
                    ingredients: i_ids,
                    options: o_ids,
                    orders: [],
                })
            )
            .catch((error) => {
                log('error', error, 1, 1);
                return res.status(400).json(error.originalError.data);
            })
            .then((r) => {
                return res.status(200).json({ message: 'Success', id: r.id });
            });
    };
};
