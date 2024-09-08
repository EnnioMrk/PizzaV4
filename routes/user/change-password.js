import log from '../../managers/logger.js';

export default (pb) => {
    return async (req, res) => {
        if (
            !req.body ||
            !req.body.newPassword ||
            req.body.oldPassword == undefined
        ) {
            log(req.body);
            return res.status(400).json({
                error: 'The body must contain newPassword and oldPassword',
            });
        }
        await pb
            .collection('users')
            .update(req.cookies.id, {
                password: req.body.newPassword,
                passwordConfirm: req.body.newPassword,
                oldPassword: req.body.oldPassword,
            })
            .catch((error) => {
                log('error', error);
                return res.status(400).json(error.originalError.data);
            });
    };
};
