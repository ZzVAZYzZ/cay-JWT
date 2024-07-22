const User = require("../models/userModel");

const deleteOldTokens = async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            if (user.oldtoken.length > 1) {
                user.oldtoken.splice(0, user.oldtoken.length - 1);
                await user.save();
            }
        }
        console.log("Job: deleteOldTokens successful");
    } catch (error) {
        console.error("Job: deleteOldTokens failed:", error.message);
    }
};

module.exports = deleteOldTokens;

