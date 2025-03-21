import { Schema, model } from 'mongoose';

const blackjackUserSchema = new Schema({
	nickname: {
		type: String,
		required: true,
		unique: true
	},
	money: {
		type: Number,
		default: 1000
	},
	total: {
		type: Number,
		default: -1
	},
	active: {
		type: Boolean,
		default: true
	}
});

export default model('BlackjackUser', blackjackUserSchema);
