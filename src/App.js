import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import NavBar from './components/NavBar';
import MembersList from './components/MemberList';
import MemberForm from './components/MemberForm';
import MemberDetails from './components/MemberDetails';
import Home from './components/Home';
import Help from './components/Help';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Toastify Container (should exist only once in app) */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />

        {/* Navbar and spacing */}
        <NavBar fixed="top" />
        <div style={{ height: '32px' }} /> {/* spacer for navbar height */}

        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/members" element={<MembersList />} />
            <Route path="/members/add" element={<MemberForm />} />
            <Route path="/members/edit/:id" element={<MemberForm />} />
            <Route path="/members/:id" element={<MemberDetails />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
