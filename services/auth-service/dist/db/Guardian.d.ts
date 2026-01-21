import mongoose, { Document, Types } from 'mongoose';
export interface IGuardian extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    refreshTokens: string[];
    role: 'parent' | 'teacher';
    reputation: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Guardian: mongoose.Model<IGuardian, {}, {}, {}, mongoose.Document<unknown, {}, IGuardian, {}, {}> & IGuardian & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Guardian;
//# sourceMappingURL=Guardian.d.ts.map