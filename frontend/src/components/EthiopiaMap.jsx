// Embedded Google Maps iframe component for Ethiopia, styled like Dealroom dashboard
import React from 'react';

const EthiopiaMap = () => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px 0 rgba(16,30,54,0.06)', border: '1.5px solid #e5e7eb', minHeight: 260 }}>
    <iframe
      title="Ethiopia Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15905538.393698586!2d32.0!3d9.145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1635d0cedd6cfd2b%3A0x7bf6a67f5348c55a!2sEthiopia!5e0!3m2!1sen!2set!4v1717950000000!5m2!1sen!2set"
      width="100%"
      height="320"
      style={{ border: 0, minHeight: 260 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
);

export default EthiopiaMap;