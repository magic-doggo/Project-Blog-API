function isAuthorized(user, targetCommentOrPost) { //only targetting comments so far, since only admin can make posts, and can edit any post
    if (user.role === "Admin") return true;
    if (user.userId === targetCommentOrPost.authorId) return true;
    return false;
}

module.exports = {isAuthorized};