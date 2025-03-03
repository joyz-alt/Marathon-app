// Example of an admin-only component
import React from 'react';
import { useUser } from '../contexts/UserContext';

const AdminPanel = () => {
    const user = useUser();

    if (!user || user.role !== 'admin') {
        return <p>Access Denied</p>;
    }

    return <div>Welcome to the Admin Panel!</div>;
};

export default AdminPanel;
