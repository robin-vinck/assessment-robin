import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../users/user.model';
import mongoose from 'mongoose';
import { BaseDocument } from '../common/like.service';

@Schema({ timestamps: true })
@ObjectType()
export class Post {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field(() => String)
  title: string;

  @Prop({ required: true })
  @Field(() => String)
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  @Field(() => User)
  author: User;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  @Field(() => [User])
  likes: User[];

  @Field(() => Boolean, { nullable: true })
  hasLiked?: boolean;

  @Field(() => Number, { nullable: true })
  numberOfLikes?: number;
}

export interface PostDocument extends Post, BaseDocument {}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ author: 1 });
PostSchema.index({ likes: 1 });
PostSchema.index({ author: 1, createdAt: -1 });
