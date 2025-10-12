import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const Help = () => {
  return (
    <div className="container py-5">
      {/* Header */}
      <header className="text-center mb-5">
        <p className="lead text-muted">How can we help you today?</p>
      </header>


      {/* Contact Section */}
      <section className="mb-5">
        <h2 className="mb-4 text-secondary">Contact Us</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <p><strong>Phone:</strong> +91  70200 82571</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
