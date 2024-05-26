import React, { useEffect, useState, useContext } from 'react';
import { fetchAllUsers, toggleUserBlockStatus, makeAdmin } from '../services/users.service.js'; // Ensure the path to services is correct
import { AppContext } from '../context/AppContext.jsx';
import './AdminView.css'; // Make sure to create and import this CSS file

const AdminView = () => {
    const [users, setUsers] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useContext(AppContext);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchAllUsers();
                console.log('Fetched Users:', usersData);
                setUsers(usersData);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        loadUsers();
    }, []);

    const handleToggleBlock = async (handle, isCurrentlyBlocked) => {
        if (currentUser.isAdmin === false) {
            console.error("Unauthorized attempt to block/unblock user");
            return;
        }

        try {
            await toggleUserBlockStatus(handle, isCurrentlyBlocked);
            setUsers(prevUsers => ({
                ...prevUsers,
                [handle]: {
                    ...prevUsers[handle],
                    isBlocked: !isCurrentlyBlocked
                }
            }));
        } catch (error) {
            console.error('Failed to toggle block status:', error);
        }
    };

    const handleMakeAdmin = async (handle) => {
        if (currentUser.isAdmin === false) {
            console.error("Unauthorized attempt to make user an admin");
            return;
        }

        try {
            await makeAdmin(handle);
            alert('User is now an admin');
            setUsers(prevUsers => ({
                ...prevUsers,
                [handle]: {
                    ...prevUsers[handle],
                    isAdmin: true
                }
            }));
        } catch (error) {
            console.error('Failed to make user an admin:', error);
            alert('Failed to make user an admin');
        }
    };

    const filteredUsers = searchTerm
        ? Object.values(users).filter(user =>
            (user.handle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
            user.uid !== currentUser?.uid
        )
        : Object.values(users).filter(user => user.uid !== currentUser?.uid);

    return (
        <div className="admin-view">
            <input
                type="text"
                placeholder="Search by handle or email"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <ul className="user-list">
                {filteredUsers.map(user => {
                    console.log(`Rendering user: ${user.handle}, isAdmin: ${user.isAdmin}`);
                    return (
                        <li key={user.uid} className="user-item">
                            <div className="user-info">
                                {user.handle} - {user.email}
                            </div>
                            <div className="user-actions">
                                <button onClick={() => handleToggleBlock(user.handle, user.isBlocked)}>
                                    {user.isBlocked ? 'Unblock' : 'Block'}
                                </button>
                                {!user.isAdmin && (
                                    <button onClick={() => handleMakeAdmin(user.handle)}>
                                        Make Admin
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AdminView;