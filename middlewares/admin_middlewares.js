// this middleware will check the user is admin or not based on the model we have made earlier

const adminMiddleware = (req, res, next) => {
    try {
        const isAdmin = req.user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied.User is not an admin"
            })
        }

        // otherwise if user found as admin we will let him access the route
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "Something went wrong from the admin middleware"
        })
    }
}

export default adminMiddleware;