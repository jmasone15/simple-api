import BlackJackUser from '../models/BlackJackUser.js';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const user = await BlackJackUser.find({ active: true }, 'email money')
			.skip(skip)
			.limit(limit)
			.sort('-money');
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json(error);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const user = await BlackJackUser.findById(req.params.id);
		return res.status(200).json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).send('Oops');
	}
});

router.post('/', async (req, res) => {
	try {
		const newUser = new BlackJackUser({
			email: req.body.email
		});

		await newUser.save();

		return res.status(200).json(newUser);
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

router.delete('/cleanup', async (req, res) => {
	try {
		const inactiveUser = await BlackJackUser.find({ active: false });

		if (!inactiveUser) {
			return res.status(200).send('No inactive users.');
		}

		const deleteCount = await BlackJackUser.deleteMany({ active: false });

		return res.status(200).json(deleteCount);
	} catch (error) {
		console.error(error);
		return res.status(500).send('Oops');
	}
});

export default router;
