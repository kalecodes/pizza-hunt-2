const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// add a comment to a pizza
router.route('/:pizzaId').post(addComment);
// delete a comment from a pizza
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;