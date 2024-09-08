import log from '../../managers/logger.js';

/*
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pocketbase.haus-marke.com');

...

// example create data
const data = {
    "username": "test_username",
    "email": "test@example.com",
    "emailVisibility": true,
    "password": "12345678",
    "passwordConfirm": "12345678",
    "name": "test"
};

const record = await pb.collection('users').create(data);

// (optional) send an email verification request
await pb.collection('users').requestVerification('test@example.com');
*/
export default (pb) => {
    return async (req, res) => {
        if (
            !req.body ||
            !req.body.email ||
            !req.body.name ||
            !req.body.password
        ) {
            log(req.body);
            return res.status(400).json({
                error: 'The body must contain email, name, and password',
            });
        }
        log({ ...req.body, passwordConfirm: req.body.password });
        await pb
            .collection('users')
            .create({ ...req.body, passwordConfirm: req.body.password })
            .catch((error) => {
                log('error', error);
                return res.status(400).json(error.originalError.data);
            });
        await pb.collection('users').requestVerification(req.body.email);
        return res.status(200).json({ message: 'Success' });
    };
};
