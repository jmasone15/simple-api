import { Schema, model } from 'mongoose';

const blackjackUserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	money: {
		type: Number,
		default: 1000
	},
	active: {
		type: Boolean,
		default: true
	}
});

export default model('BlackjackUser', blackjackUserSchema);
