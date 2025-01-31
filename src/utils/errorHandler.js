export const errorHandler = (error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
};
