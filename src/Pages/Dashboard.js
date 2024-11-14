import React from 'react';
import LogoutButton from '../components/LogoutButton';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <Link to='favorite/'>Favoritos</Link>
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
