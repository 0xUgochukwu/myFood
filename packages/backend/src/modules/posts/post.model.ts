import mongoose, { Schema, Model, Document } from 'mongoose';

type PostDocument = Document & {
  userId: Schema.Types.ObjectId;
  type: "achievement" | "recipe";
  image: string;
  title: string;
  content: string;
};
