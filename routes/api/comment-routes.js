const router = require('express').Router();
const { 
    addComment,
    removeComment,
    addReply,
    removeReply
} = require('../../controllers/comment-controller');

// callback function of a 'route' method has 'req' and 'res' as parameters, so we dont have to expicitly pass any arguments to our methods
// add a comment to a pizza
router.route('/:pizzaId').post(addComment);
// delete a comment from a pizza or add a reply to a comment
router.route('/:pizzaId/:commentId')
    .put(addReply)
    .delete(removeComment);
// delete a reply from a comment
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);


module.exports = router;