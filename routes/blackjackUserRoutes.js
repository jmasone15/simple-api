import BlackJackUser from '../models/BlackJackUser.js';
import { Router } from 'express';

const router = Router();

router.get('/top-ten', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const user = await BlackJackUser.find({ active: true }, 'nickname money')
			.skip(skip)
			.limit(limit)
			.sort('-money');
		return res.status(200).json(user);
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

		if (!existingUser || !req.body.money) {
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
