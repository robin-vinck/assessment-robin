import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentInputDTO } from './comment.dto';
import { Comment, CommentDocument } from './comment.model';
import { LikeService } from '../common/like.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private likeService: LikeService
  ) {}

  async findByPostId(
    postId: string,
    limit: number,
    skip: number,
    userId: string
  ): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ post: postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('author')
      .exec();

    // Add hasLiked and numberOfLikes properties to each comment
    return comments.map(comment => {
      const hasLiked = comment.likes.some(
        user => user._id.toString() === userId
      );
      return {
        ...comment.toObject(),
        hasLiked,
        numberOfLikes: comment.likes.length ?? 0,
      };
    });
  }

  async countComments(postId: string): Promise<number> {
    return this.commentModel.countDocuments({ post: postId });
  }

  async findMostLikedComment(): Promise<Comment> {
    return this.commentModel.findOne().sort({ likes: -1 }).exec();
  }

  async createComment(commentInput: CreateCommentInputDTO): Promise<Comment> {
    const { content, authorId, postId } = commentInput;

    const newComment = new this.commentModel({
      content,
      author: authorId,
      post: postId,
    });

    return newComment.save();
  }

  async toggleCommentLike(commentId: string, userId: string): Promise<Comment> {
    return this.likeService.toggleLike(this.commentModel, commentId, userId);
  }
}
