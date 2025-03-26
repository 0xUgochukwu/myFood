import mongoose, { Schema, Model, Document } from 'mongoose';

export type RecipeDocument = Document & {
  name: string;
  description: string;
  ingredients: [];
  instructions: string[];
  cookTime: number;
  prepTime: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export const recipeSchema = new Schema<RecipeDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [], required: true },
  instructions: { type: [String], required: true },
  cookTime: { type: Number, required: true },
  prepTime: { type: Number, required: true },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
  },
});

const RecipeModel: Model<RecipeDocument> = mongoose.model('Recipe', recipeSchema);
export default RecipeModel;
