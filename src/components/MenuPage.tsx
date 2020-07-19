import React, { FC } from 'react';
import { Button } from 'grommet';
import { useAuth } from '../contexts/auth';

const MenuPage: FC = () => {
  const { logOut } = useAuth();

  const handleLogout = () => {
    logOut();
  };
  return (
    <div>
      <p>Menu Page</p>
      <Button label="LOG OUT" onClick={() => handleLogout()} />
    </div>
  );
};

export default MenuPage;
