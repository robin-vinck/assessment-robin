import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.model';
import { CreatePostInputDTO } from './post.dto';
import { UserService } from '../users/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private userService: UserService
  ) {}

  async createPost(postInput: CreatePostInputDTO): Promise<Post> {
    const { title, content, authorId } = postInput;

    const author = await this.userService.findById(authorId);

    if (!author) {
      throw new NotFoundException(`User with ID ${authorId} not found`);
    }

    return new this.postModel({
      title,
      content,
      author,
    }).save();
  }

  async findById(id: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(id).populate('author').populate('likes').exec();

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    const hasLiked = post.likes.some((like) => like._id.toString() === userId);

    return {
      ...post.toObject(),
      hasLiked,
      numberOfLikes: post.likes.length ?? 0
    };
  }

  async findAll(userId: string): Promise<Array<Post>> {
    const posts = await this.postModel.find().populate('author').populate('likes').exec();

    return posts.map(post => {
      const hasLiked = post.likes.some(like => like._id.toString() === userId);
      return {
        ...post.toObject(),
        hasLiked,
        numberOfLikes: post.likes.length ?? 0
      };
    });
  }

  async findByEmail(email: string): Promise<Post> {
    return this.postModel.findOne({ email }).exec();
  }


  async togglePostLike(postId: string, userId: string): Promise<Post> {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const userAlreadyLiked = post.likes.some((u) => u._id.toString() === userId);

    if (userAlreadyLiked) {
      post.likes = post.likes.filter((u) => u._id.toString() !== userId);
    } else {
      post.likes.push(user);
    }

    return post.save();
  }


}
