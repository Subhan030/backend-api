import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container">
            <div style={{ marginTop: '2rem' }}>
                <h1>Welcome, {user?.username}!</h1>
                <div className="auth-card" style={{ maxWidth: '600px', margin: '2rem 0' }}>
                    <h3>Your Profile</h3>
                    <p><strong>ID:</strong> {user?.id}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Roles:</strong> {user?.roles?.join(', ')}</p>
                </div>
                <button onClick={logout} className="btn-primary" style={{ maxWidth: '200px' }}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
