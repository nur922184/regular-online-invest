import React from 'react';
import UserProfile from '../Pages/UserProfile';
import useUsers from '../hooks/useUsers';

const ProfilePage = () => {
  const { users, loading, error, refetch } = useUsers();

  return (
    <UserProfile 
      users={users}
      loading={loading}
      error={error}
      refetch={refetch}
    />
  );
};

export default ProfilePage;