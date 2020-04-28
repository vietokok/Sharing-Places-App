import React from 'react';

import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
	const DUMMY_PLACES = [
		{
			id: 'p1',
			title: 'Empire State Building',
			description: 'One of most famous sky scrapers in the world!',
			imageUrl: 'https://picsum.photos/200/300',
			address: '20 W 34th St, New Y',
			location: {
				lat: 40.7484405,
				lng: -73.9878531,
			},
			creator: 'u1',
		},
		{
			id: 'p2',
			title: 'Empire State Building',
			description: 'One of most famous sky scrapers in the world!',
			imageUrl: 'https://picsum.photos/200/300',
			address: '20 W 34th St, New Y',
			location: {
				lat: 40.7484405,
				lng: -73.9878531,
			},
			creator: 'u2',
		},
	];

	return <PlaceList items={DUMMY_PLACES} />;
};

export default UserPlaces;
