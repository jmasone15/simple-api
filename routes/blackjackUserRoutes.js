import BlackJackUser from '../models/BlackJackUser.js';
import { Router } from 'express';

const router = Router();

router.get('/top-ten', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const users = await BlackJackUser.find({ active: true }, 'nickname money')
			.skip(skip)
			.limit(limit)
			.sort('-money');

		let cleanedUsers = [];

		for (let i = 0; i < users.length; i++) {
			const newObj = {
				rank: i + 1,
				nickname: users[i].nickname,
				money: users[i].money
			};

			cleanedUsers.push(newObj);
		}

		return res.status(200).json(cleanedUsers);
	} catch (error) {
		console.error(error);
		return res.status(500).json(error);
	}
});

router.get('/user/:id', async (req, res) => {
	try {
		const existingUser = await BlackJackUser.findById(req.params.id);

		if (!existingUser) {
			return res.status(400).json({ message: 'No user found.' });
		}

		return res.status(200).json(existingUser);
	} catch (error) {
		console.error(error);
		return res.status(500).json(error);
	}
});

router.post('/login', async (req, res) => {
	try {
		const existingUser = await BlackJackUser.findOne({
			nickname: req.body.nickname
		});

		if (!existingUser) {
			const newUser = new BlackJackUser({
				nickname: req.body.nickname
			});

			await newUser.save();

			return res.status(200).json(newUser);
		}

		return res.status(200).json(existingUser);
	} catch (error) {
		console.error(error);
		return res.status(500).send('Oops');
	}
});

router.put('/:id', async (req, res) => {
	try {
		const existingUser = await BlackJackUser.findById(req.params.id);

		if (
			!existingUser ||
			req.body.money === null ||
			req.body.money === undefined
		) {
			return res.status(400).send('Bad Request');
		}

		existingUser.money = req.body.money;
		await existingUser.save();

		return res.status(200).send('Success');
	} catch (error) {
		console.error(error);
		return res.status(500).send('Oops');
	}
});

export default router;
