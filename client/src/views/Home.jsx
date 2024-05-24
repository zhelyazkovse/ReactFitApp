import React, { useEffect, useState } from "react";
import { fetchAllUsers } from '../services/users.service'; // Adjust the path as necessary
import "./Home.css";
import backgroundImage from '../assets/Image/Anomander2.jpg';

export default function Home() {
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        const loadUserCount = async () => {
            try {
                const usersData = await fetchAllUsers();
                const usersArray = Object.values(usersData); // Convert to array
                setUserCount(usersArray.length); // Set the user count
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };

        loadUserCount();
    }, []);

    return (
        <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="overlay">
                <h1 className="title">First In - Last Out</h1>
                <div className="content">
                    <h2>Welcome to a space where you can share your stories, get feedback, and delve into the most uselessly detailed discussions 🥹 about every aspect of character development!</h2>
                    <p>Join a community of imagineers, meet new hobbyist writer friends 😃, and cross swords on the battlefield of (*digital*) paper!</p>
                </div>
                <div className="user-count">
                    <p>Number of users in the forum: {userCount}</p>
                </div>
            </div>
        </div>
    );
}