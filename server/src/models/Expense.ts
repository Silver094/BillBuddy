import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
    description: string;
    amount: number;
    paidBy: mongoose.Types.ObjectId;
    group: mongoose.Types.ObjectId;
    splitType: 'EQUAL' | 'PERCENTAGE' | 'SHARES' | 'EXACT';
    splits: {
        user: mongoose.Types.ObjectId;
        amount?: number;
        percentage?: number;
        shares?: number;
    }[];
    category: string;
    date: Date;
    createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    splitType: {
        type: String,
        enum: ['EQUAL', 'PERCENTAGE', 'SHARES', 'EXACT'],
        default: 'EQUAL'
    },
    splits: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number },
        percentage: { type: Number },
        shares: { type: Number }
    }],
    category: { type: String, default: 'General' },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IExpense>('Expense', ExpenseSchema);
