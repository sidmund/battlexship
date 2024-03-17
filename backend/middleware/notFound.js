// Catch-all rule for non-existing routes
export const notFound = (req, res) => {
    res.status(404).json({ error: "No such route" });
};
