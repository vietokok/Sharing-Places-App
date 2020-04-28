import React from 'react';

import UserList from '../components/UserList';

const Users = () => {
	const USERS = [
		{
			id: 'u1',
			name: 'Vietokok',
			image: 'https://picsum.photos/200/300',
			places: 3,
		},
	];

	return <UserList items={USERS} />;
};

export default Users;
