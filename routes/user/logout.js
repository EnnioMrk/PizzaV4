export default (pb) => {
    return async (req, res) => {
        global.authCache[req.cookies.id] = null;
    };
};
