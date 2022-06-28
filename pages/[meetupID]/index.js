import { Fragment } from 'react';
import { MongoClient, ObjectId } from 'mongodb';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails() {
	return (
		<MeetupDetail
			image={props.meetupData.image}
			title={props.meetupData.title}
			address={props.meetupData.address}
			description={props.meetupData.description}
		/>
	);
}

/************************************************************* 
Must use getStaticPaths if dynamic page & using getStaticProps
Page is pre-generated during build process
*************************************************************/
export async function getStaticPaths() {
	// Fetch data from an API
	const client = await MongoClient.connect(
		'mongodb+srv://sa:NJ2yWkBwOfuLdBXI@cluster0.7v49o.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: false,
		paths: meetups.map((meetup) => ({
			params: { meetupID: meetup._id.toString() },
		})),
	};
}

export async function getStaticProps(context) {
	// Fetch data for single meetup
	const meetupID = context.params.meetupID;

	const client = await MongoClient.connect(
		'mongodb+srv://sa:NJ2yWkBwOfuLdBXI@cluster0.7v49o.mongodb.net/meetups?retryWrites=true&w=majority'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupID),
	});

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
