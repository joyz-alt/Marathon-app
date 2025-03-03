// src/components/AdminRoleManager.js
import React, { useState } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";

const AdminRoleManager = () => {
    const [email, setEmail] = useState('');

    const makeAdmin = () => {
        const functions = getFunctions();
        const addAdminRole = httpsCallable(functions, 'addAdminRole');

        addAdminRole({ email })
            .then(result => {
                alert(result.data.message); // Alert the response from your cloud function
            })
            .catch(error => {
                alert("Error making admin: " + error.message);
            });
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
            />
            <button onClick={makeAdmin}>Make Admin</button>
        </div>
    );
};

export default AdminRoleManager;
