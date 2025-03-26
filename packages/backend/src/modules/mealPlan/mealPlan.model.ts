import mongoose, { Schema, Model, Document } from 'mongoose';
import { recipeSchema, type RecipeDocument } from '../recipes/recipe.model';


type MealPlanDocument = Document & {
  userId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  dailyPlans: [
    {
      day: string;
      meals: [
        {
          mealTime: string;
          recipe: RecipeDocument;
        }
      ];
      cooking: {
        isCookingDay: boolean;
        mealToCook: string;
      }
    }
  ];
  ingredientsNeeded: string[];
};


const mealPlanSchema = new Schema<MealPlanDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  dailyPlans: [
    {
      day: { type: String, required: true },
      meals: [
        {
          mealTime: { type: String, required: true },
          recipe: { type: recipeSchema, required: true },
        },
      ],
      cooking: {
        isCookingDay: { type: Boolean, required: true },
        mealToCook: { type: String },
      },
    },
  ],
  ingredientsNeeded: { type: [String], default: [] },
});

const MealPlanModel: Model<MealPlanDocument> = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlanModel;
