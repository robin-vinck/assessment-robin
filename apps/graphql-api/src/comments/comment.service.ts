import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentInputDTO } from './comment.dto';
import { UserService } from '../users/user.service';
import { Comment, CommentDocument } from './comment.model';
import { PostService } from '../posts/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private userService: UserService,
    private postService: PostService
  ) {}

  async findByPostId(
    postId: string,
    limit: number,
    skip: number
  ): Promise<Comment[]> {
    return this.commentModel
      .find({ post: postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('author')
      .exec();
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
}
