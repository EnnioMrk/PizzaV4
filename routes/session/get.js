import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        let dateBefore = new Date(
            new Date().getTime() - 1000 * 60 * 60 * global.config.sessionTimeout
        )
            .toISOString()
            .replace('T', ' ');
        dateBefore = dateBefore.slice(0, dateBefore.length - 5);
        log('info', dateBefore);
        pb.collection('sessions')
            .getFirstListItem(`active=true && updated >= "${dateBefore}"`, {
                sort: '-created',
                expand: 'ingredients,options,orders',
            })
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
                console.error(error);
                return res
                    .status(400)
                    .json({ error: 'No active session found' });
            });
    };
};
