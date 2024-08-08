import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../users/user.model'
import { Post } from '../posts/post.model'

@Schema({ timestamps: true })
@ObjectType()
export class Comment {
  @Field(() => ID)
  _id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  @Field(() => Post)
  post: Post;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @Field(() => User)
  author: User;

  @Prop({ required: true })
  @Field(() => String)
  content: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @Field(() => [User])
  likes: User[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);