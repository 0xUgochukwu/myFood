import mongoose, { Schema, Model, Document } from 'mongoose';


type UserDocument = Document & {
  firstName: string;
  lastName: string;
  email: string;
  preferences: {
    diets: string[];
    allergies: string[];
    favoriteFoods: string[];
  };
  goals: {
    dailyCalories: number;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFat: number;
    dailyFiber: number;
  };
  availableIngredients: string[];
  savedRecipes: Schema.Types.ObjectId[];
  onboardingCompleted: boolean;
};


const userSchema = new Schema<UserDocument>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferences: {
    diets: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    favoriteFoods: { type: [String], default: [] },
  },
  goals: {
    dailyCalories: { type: Number, required: true },
    dailyProtein: { type: Number, required: true },
    dailyCarbs: { type: Number, required: true },
    dailyFat: { type: Number, required: true },
    dailyFiber: { type: Number, required: true },
  },
  availableIngredients: { type: [String], default: [] },
  savedRecipes: { type: [String], default: [] },
});


const UserModel: Model<UserDocument> = mongoose.model('User', userSchema);
export default UserModel;
