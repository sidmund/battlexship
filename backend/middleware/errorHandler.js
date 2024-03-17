// Exceptions are internal errors
export const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: `Internal server error: ${err}` });
};
