import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        pb.collection('sessions')
            .getFirstListItem(
                `active=true && updated > ${new Date() - 1000 * 60 * 60 * 12}`,
                {
                    sort: '-created',
                    expand: 'ingredients,options,orders',
                }
            )
            .then((record) => {
                //check if last create session is still active (less than 1 hour)
                if (!record) {
                    return res.status(400).json({
                        error: 'No active session found that was created in the last 12 hour',
                    });
                }
                return res.status(200).json({
                    id: record.id,
                    ingredients: record.expand.ingredients.map((i) => i.name),
                    options: record.expand?.options?.map((i) => i.name) || [],
                    orders:
                        record.expand?.orders?.map((i) => {
                            return {
                                name: i.name,
                                ingredients:
                                    i.ingredients?.map((i) => i.name) || [],
                                options: i.options?.map((i) => i.name) || [],
                                comment: i.comment,
                            };
                        }) || [],
                });
            })
            .catch((error) => {
                return res
                    .status(400)
                    .json({ error: 'No active session found' });
            });
    };
};
