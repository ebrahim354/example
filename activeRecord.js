// remove post mutation
const { NotFoundError, UnauthorizedError } = require('errors');
const requestContext = require('talawa-request-context');

// new-----------
const mainDB = require('mainDataBase');
const User = mainDB.User;
// new-----------

const removePost = async (parent, args, context) => {
	// new--------
	const myDB = context.database;
	const Post = myDB.Post;
	// new--------

	const user = await User.findOne({ _id: context.userId });
	if (!user) {
		throw new NotFoundError(
			requestContext.translate('user.notFound'),
			'user.notFound',
			'user'
		);
	}

	const post = await Post.findOne({ _id: args.id });
	if (!post) {
		throw new NotFoundError(
			requestContext.translate('post.notFound'),
			'post.notFound',
			'post'
		);
	}

	if (!(post.creator !== context.userId)) {
		throw new UnauthorizedError(
			requestContext.translate('user.notAuthorized'),
			'user.notAuthorized',
			'userAuthorization'
		);
	}

	await Post.deleteOne({ _id: args.id });
	return post;
};

module.exports = removePost;
