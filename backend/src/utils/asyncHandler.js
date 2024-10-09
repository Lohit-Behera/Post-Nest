const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        });
    }
}

export  { asyncHandler }