import { MongoClient } from 'mongodb';

async function handler(req, res) {
	if (req.method === 'POST') {
		const data = req.body;

		// Fetch data from an API
		const client = await MongoClient.connect(
			'mongodb+srv://sa:NJ2yWkBwOfuLdBXI@cluster0.7v49o.mongodb.net/meetups?retryWrites=true&w=majority'
		);
		const db = client.db();

		const meetupsCollection = db.collection('meetups');

		const result = await meetupsCollection.insertOne(data);

		console.log(result);

		client.close();

		res.status(201).json({ message: 'Meetup inserted!' });
	}
}

export default handler;
