export default (sb) => {
    return async (req, res) => {
        //return env variable
        return res.status(200).json({ url: process.env.SUPABASE_URL });
    };
};
