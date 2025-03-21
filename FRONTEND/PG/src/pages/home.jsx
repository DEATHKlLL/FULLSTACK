
import React from 'react';
import './footer.css'



const Home = () => {
  return (
    <>
    <button class="menu-button" onClick="toggleSidebar()">☰</button>
    <div class="sidebar" id="sidebar">
	<h2></h2>
        <h2>BOOK YOUR PG</h2>
        <a href="#">Dashboard</a>
        <a href="#">Manage PGs</a>
        <a href="#">Bookings</a>
        <a href="#">Users</a>
        <a href="#">Reports</a>
        <a href="#">Settings</a>
    </div>
    <div class="main-content" id="main-content">
        <div class="header">
            <h1>Dashboard</h1>
            <div>User Profile</div>
        </div>
        <div class="content-box">
<h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2><h2>BOOK YOUR PG</h2>
            <h2>Welcome to Your PG Booking System</h2>
            <p>Here you can manage your properties, bookings, and users efficiently.</p>
        </div>
    </div>
</>
  );
};

export default Home;
