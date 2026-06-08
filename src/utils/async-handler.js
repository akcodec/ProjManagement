// requestHandler 1 function ko asynchandler me wrap karna hai taki agar koi error aaye to wo next() ke through error handling middleware tak pahuch jaye
const asynchandler = (requestHandler) => {
    return async (req, res, next) => {
        try {
            await Promise.resolve(requestHandler(req, res, next));
        } catch (err) {
            next(err);
        }
    };
};

export { asynchandler };