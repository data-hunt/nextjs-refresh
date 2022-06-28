// import { useEffect, useState } from 'react';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

// const DUMMY_MEETUPS = [
// 	{
// 		id: 'm1',
// 		title: 'A first meetup',
// 		image:
// 			'https://www.state.gov/wp-content/uploads/2018/11/Spain-2109x1406.jpg',
// 		address: '12345, Some City',
// 		description: 'This is a first meetup!',
// 	},
// 	{
// 		id: 'm3',
// 		title: 'A second meetup',
// 		image:
// 			'https://www.state.gov/wp-content/uploads/2018/11/Spain-2109x1406.jpg',
// 		address: '12345, Some City',
// 		description: 'This is a first meetup!',
// 	},
// 	{
// 		id: 'm2',
// 		title: 'A third meetup',
// 		image:
// 			'https://www.state.gov/wp-content/uploads/2018/11/Spain-2109x1406.jpg',
// 		address: '12345, Some City',
// 		description: 'This is a first meetup!',
// 	},
// ];

function HomePage(props) {
	/******************************************************** 
FOLLOWING BAD FOR SEO - DON'T NEED THIS CODE IF USING SSG
*********************************************************/
	// const [loadedMeetups, setLoadedMeetups] = useState([]);

	// useEffect(() => {
	// 	// Send an http request and fetch data
	// 	setLoadedMeetups(DUMMY_MEETUPS);
	// }, []);

	return <MeetupList meetups={props.meetups} />;
}

/****************************************************
Server Side Rendering Example
No need to revalidate, runs for each request
Use - don't need data updated multiple times per sec
and don't need req/res body for ex: auth
*****************************************************/
// export async function getServerSideProps(context) {
// 	const req = context.req;
// 	const res = context.res;

// 	// Fetch data from an API
// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// }

/*****************************
Static Site Generation Example
Recommended Approach
******************************/
export async function getStaticProps() {
	// Fetch data from an API
	const client = await MongoClient.connect(
		'mongodb+srv://sa:NJ2yWkBwOfuLdBXI@cluster0.7v49o.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find().toArray();

	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				id: meetup._id.toString(),
			})),
		},
		// Incremental Static Regneration (in seconds)
		revalidate: 10,
	};
}

export default HomePage;
