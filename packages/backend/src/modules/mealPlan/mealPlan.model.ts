import mongoose, { Schema, Model, Document } from 'mongoose';
import { recipeSchema, type RecipeDocument } from '../recipes/recipe.model';


type MealPlanDocument = Document & {
  user: Schema.Types.ObjectId;
  week: {
    start: Date;
    end: Date;
  };
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
        cookingInstructions: string;
      }
    }
  ];
  ingredientsNeeded: string[];
};


const mealPlanSchema = new Schema<MealPlanDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  week: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
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
        isCookingDay: { type: Boolean },
        mealToCook: { type: String },
        cookingInstructions: { type: String },
      },
    },
  ],
  ingredientsNeeded: { type: [String], default: [] },
});

const MealPlanModel: Model<MealPlanDocument> = mongoose.model('MealPlan', mealPlanSchema);
export default MealPlanModel;
