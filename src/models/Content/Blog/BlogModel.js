// models/Post.js
const mongoose = require("mongoose");
const { Timekoto } = require("timekoto");
const { ENUM_POST_PRIVACY } = require("../../constants/PostConstants");
const { postLikeSchema, postCommentSchema } = require("./PostSubschemas");
const { PostCommentDTO, PostLikeDTO } = require("../../dtos/PostDTO");
const { UserPostDTO } = require("../../dtos/UserDTO");
const {
  CustomError,
} = require("../../services/responseHandlers/HandleResponse");
const User = require("../User/UserModel");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    required: true,
  },
  metaTags: {
    type: String,
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  tags: {
    type: [postLikeSchema],
    default: [],
  },
  createdAt: {
    type: Number,
    default: () => Timekoto(),
  },
});

// Define a static method to get all posts
postSchema.statics.getAllPosts = async function () {
  try {
    // Find all posts and populate the postedBy field while excluding the password field
    const posts = await this.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy",
        // model: "User",
        // select: "-password",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });

    if (posts?.length === 0) {
      throw new CustomError(404, "No posts found");
    }

    //sort comments by date created in descending order
    posts.forEach((post) => {
      post?.comments?.sort((a, b) => b?.createdAt - a?.createdAt);
    });

    // Transform user objects into DTO format for each post
    const transformedPosts = posts.map((post) => {
      const userDTO = new UserPostDTO(post?.postedBy);
      // Transform likes array into DTO format
      const likesDTO = post.likes.map((like) => new PostLikeDTO(like));
      // Transform comments array into DTO format
      const commentsDTO = post.comments.map(
        (comment) => new PostCommentDTO(comment)
      );
      const populatedPost = {
        ...post.toObject(),
        postedBy: userDTO,
        likes: likesDTO,
        comments: commentsDTO,
      };

      return populatedPost;
    });
    // Return transformed posts
    return transformedPosts;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//get posts by userId
postSchema.statics.getPostsByUserId = async function (userId) {
  try {
    // Find all posts by userId and populate the postedBy field while excluding the password field except own posts
    const posts = await this.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });

    if (posts?.length === 0) {
      throw new CustomError(404, "No posts found");
    }

    //sort comments by date created in descending order
    posts.forEach((post) => {
      post?.comments?.sort((a, b) => b?.createdAt - a?.createdAt);
    });

    // Transform user objects into DTO format for each post
    const transformedPosts = posts.map((post) => {
      const userDTO = new UserPostDTO(post?.postedBy);
      // Transform likes array into DTO format
      const likesDTO = post.likes.map((like) => new PostLikeDTO(like));
      // Transform comments array into DTO format
      const commentsDTO = post.comments.map(
        (comment) => new PostCommentDTO(comment)
      );
      const populatedPost = {
        ...post.toObject(),
        postedBy: userDTO,
        likes: likesDTO,
        comments: commentsDTO,
      };

      return populatedPost;
    });
    // Return transformed posts
    return transformedPosts;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//get posts that user can see (all public posts and friends post only if the given user is a friend of the post owner)
postSchema.statics.getRelevantPostsForUser = async function (userId) {
  try {
    // Fetch the user and their friends list
    const user = await User.findById(userId).populate("friendsList").exec();
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    // Get the ids of the user's friends with status 'accepted'
    const friendsIds = user.friendsList
      .filter((friend) => friend.status === "accepted")
      .map((friend) => friend.userId._id);

    // Find all relevant posts: public posts and friends' posts where the user is a friend
    const posts = await Post.find({
      $and: [
        // Exclude the user's own posts
        { postedBy: { $ne: userId } },
        {
          $or: [
            { privacy: "public" },
            { privacy: "friends", postedBy: { $in: friendsIds } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      })
      .exec();

    if (posts.length === 0) {
      throw new CustomError(404, "No posts found");
    }

    // Sort comments by creation date in descending order
    posts.forEach((post) => {
      post.comments.sort((a, b) => b.createdAt - a.createdAt);
    });

    // Transform user objects into DTO format for each post
    const transformedPosts = posts.map((post) => {
      const userDTO = new UserPostDTO(post.postedBy);
      // Transform likes array into DTO format
      const likesDTO = post.likes.map((like) => new PostLikeDTO(like));
      // Transform comments array into DTO format
      const commentsDTO = post.comments.map(
        (comment) => new PostCommentDTO(comment)
      );
      const populatedPost = {
        ...post.toObject(),
        postedBy: userDTO,
        likes: likesDTO,
        comments: commentsDTO,
      };

      return populatedPost;
    });

    // Return transformed posts
    return transformedPosts;
  } catch (error) {
    throw new CustomError(error.statusCode, error.message);
  }
};

//get post by id
postSchema.statics.getPostByPostId = async function (postId) {
  try {
    // Populate the postedBy field and exclude the password field
    const post = await this.findById(postId)
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });

    if (!post) {
      throw new CustomError(404, "Post not found");
    }

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(post?.postedBy);

    // Transform likes array into DTO format
    const likesDTO = post?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = post.comments.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...post.toObject(),
      postedBy: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//create a new student
postSchema.statics.createNewPost = async function (post) {
  try {
    const newPost = new this(post);
    const savedPost = await newPost.save();
    // Populate the postedBy field for the saved post
    await savedPost.populate("postedBy");

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(savedPost?.postedBy);

    // Return the saved post with transformed postedBy

    const finalResponse = {
      ...savedPost.toObject(),
      postedBy: userDTO,
    };
    return finalResponse;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post by id
postSchema.statics.updatePostById = async function (postId, post) {
  try {
    const { content, image, privacy } = post;
    // Construct update object with available fields
    const updatedData = {};
    if (content) {
      updatedData.content = content;
    }
    if (image) {
      updatedData.image = image;
    }
    if (privacy) {
      //check if the privacy value valid
      if (ENUM_POST_PRIVACY[privacy] === undefined) {
        throw new CustomError(400, "Invalid privacy value");
      }
      updatedData.privacy = privacy;
    }
    // Find and update the post by id
    const updatedPost = await this.findByIdAndUpdate(
      postId,
      { $set: updatedData },
      { new: true }
    )
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.postedBy);

    // Transform likes array into DTO format
    const likesDTO = updatedPost?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost?.comments?.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost.toObject(),
      postedBy: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post content by id
postSchema.statics.updatePostPrivacyById = async function (postId, privacy) {
  try {
    //check if the privacy value valid
    if (ENUM_POST_PRIVACY[privacy] === undefined) {
      throw new CustomError(400, "Invalid privacy value");
    }
    //check if the post exists
    const post = await this.findById(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }
    // Find and update the post by id
    const updatedPost = await this.findByIdAndUpdate(
      postId,
      { $set: { privacy } },
      { new: true }
    )
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.postedBy);

    // Transform likes array into DTO format
    const likesDTO = updatedPost?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost?.comments?.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost?.toObject(),
      postedBy: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post likes by id
postSchema.statics.updatePostLikesById = async function (postId, postedBy) {
  try {
    // Check if the user has already liked the post
    const post = await this.findById(postId);
    if (!post) {
      throw new CustomError(404, "Post not found");
    }
    const likedIndex = post?.likes?.findIndex((like) =>
      like?.postedBy?.equals(postedBy)
    );

    // Find the post by id and update the likes array
    let updatedPost;
    if (likedIndex !== -1) {
      // User has already liked the post, so remove the like
      updatedPost = await this.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: { postedBy } },
        },
        { new: true }
      );
    } else {
      // User hasn't liked the post, so add the like
      updatedPost = await this.findByIdAndUpdate(
        postId,
        {
          $addToSet: { likes: { postedBy } },
        },
        { new: true }
      );
    }

    // Populate the updated post
    updatedPost = await this.findById(postId)
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.postedBy);

    // Transform likes array into DTO format
    const likesDTO = updatedPost?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost?.comments?.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost?.toObject(),
      postedBy: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//update post comments by id
postSchema.statics.updatePostCommentsById = async function (postId, comment) {
  try {
    //check if the post exists
    const post = await this.findById(postId);

    const { postedBy, repliedTo, repliedOn, content } = comment;

    const newComment = { postedBy, repliedTo, repliedOn, content };

    if (!post) {
      throw new CustomError(404, "Post not found");
    }
    // Find and update the post by id
    const updatedPost = await this.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment },
      },
      { new: true }
    )
      .populate({
        path: "postedBy",
        options: { lean: true },
      })
      .populate({
        path: "likes.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.postedBy",
        options: { lean: true },
      })
      .populate({
        path: "comments.repliedTo",
        options: { lean: true },
      });
    //get details of comment poster
    const commentPostedBy = await User.findById(postedBy);

    // Transform user object into DTO format
    const userDTO = new UserPostDTO(updatedPost?.postedBy);

    // Transform likes array into DTO format
    const likesDTO = updatedPost?.likes?.map((like) => new PostLikeDTO(like));

    // Transform comments array into DTO format
    const commentsDTO = updatedPost?.comments?.map(
      (comment) => new PostCommentDTO(comment)
    );

    const populatedPost = {
      ...updatedPost.toObject(),
      postedBy: userDTO,
      likes: likesDTO,
      comments: commentsDTO,
    };

    return populatedPost;
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

//delete post by id
postSchema.statics.deletePostById = async function (postId) {
  try {
    //to perform multiple filters at once
    const filter = {
      _id: postId,
    };
    // Find and delete the post by id
    const deletedPost = await this.findByIdAndDelete(filter);
    if (!deletedPost) {
      throw new CustomError(404, "Post not found");
    }
    return { message: `Post deleted successfully with id: ${postId}` };
  } catch (error) {
    throw new CustomError(error?.statusCode, error?.message);
  }
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
