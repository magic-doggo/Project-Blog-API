function isAuthorized(user, targetCommentOrPost) { //only targetting comments so far, since only admin can make posts, and can edit any post
    console.log("isauthorized user:", user, "targetcommentorpost: ", targetCommentOrPost)
    if (user.role === "ADMIN") return true;
    if (user.userId === targetCommentOrPost.authorId) return true;
    return false;
}

module.exports = {isAuthorized};