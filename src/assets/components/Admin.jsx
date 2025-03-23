import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
    const [token, setToken] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [userId, setUserId] = useState('');
    const [discount, setDiscount] = useState('');
    const [payments, setPayments] = useState([]);
    const [message, setMessage] = useState('');

    const login = async () => {
        try {
            const res = await axios.post('http://174.129.173.184:5000/api/admin/login', {
                username: 'admin',
                password: 'admin123'
            });
            setToken(res.data.token);
            setMessage('Logged in successfully');
        } catch (error) {
            setMessage('Login failed');
        }
    };

    const createPromo = async () => {
        try {
            const res = await axios.post('http://174.129.173.184:5000/api/promo/create', {
                promo_code: promoCode,
                user_id: parseInt(userId),
                discount_percentage: parseInt(discount)
            }, { headers: { Authorization: `Bearer ${token}` } });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data.error || 'Failed to create promo');
        }
    };

    const deletePromo = async () => {
        try {
            const res = await axios.delete(`http://174.129.173.184:5000/api/promo/${promoCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response?.data.error || 'Failed to delete promo');
        }
    };

    const getPayments = async () => {
        try {
            const res = await axios.get('http://174.129.173.184:5000/api/payments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(res.data);
            setMessage('Payments fetched');
        } catch (error) {
            setMessage('Failed to fetch payments');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <button onClick={login}>Login</button>
            <div>
                <input placeholder="Promo Code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <input placeholder="Discount %" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                <button onClick={createPromo}>Create Promo</button>
                <button onClick={deletePromo}>Delete Promo</button>
            </div>
            <button onClick={getPayments}>Get Payments</button>
            <p>{message}</p>
            <ul>
                {payments.map((p, i) => (
                    <li key={i}>
                        {p.customer_email} - {p.promo_code} - {p.used_at} - 
                        Gender: {p.gender}, Age: {p.age}, Name: {p.name}, 
                        Game1: {p.game1}, Game2: {p.game2}, Game3: {p.game3}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Admin;