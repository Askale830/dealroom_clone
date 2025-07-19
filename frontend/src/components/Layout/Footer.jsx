import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import styles from '../../pages/HomePage.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="max-w-4xl mx-auto px-4">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Dealroom Ethiopia</h3>
          <p className="text-gray-600 text-sm mb-3">
            Ethiopia's startup ecosystem platform connecting companies, investors, and opportunities.
          </p>
          <div className={styles.footerSocials}>
            <a href="https://www.facebook.com/dealroom.et/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com/dealroomet" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com/company/dealroom-ethiopia/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href="https://www.instagram.com/dealroomet/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://t.me/dealroomet" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <FaTelegramPlane />
            </a>
            <a href="https://wa.me/251911234567" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h4>
          <div className="space-y-1">
            <a href="/companies" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">Companies</a>
            <a href="/investors" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">Investors</a>
            <a href="/ecosystem" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">Ecosystem</a>
            <a href="/curated-content" className="block text-gray-600 hover:text-blue-600 transition-colors text-sm">Resources</a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact</h4>
          <div className="space-y-2">
            <a 
              href="/contact" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              <FaEnvelope className="text-xs" />
              <span>Contact Form</span>
            </a>
            
            <a 
              href="mailto:info@dealroom.et" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              <FaEnvelope className="text-xs" />
              <span>info@dealroom.et</span>
            </a>
            
            <a 
              href="tel:+251911234567" 
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
            >
              <FaPhone className="text-xs" />
              <span>+251 911 234 567</span>
            </a>
            
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <FaMapMarkerAlt className="text-xs" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} Dealroom Ethiopia. All rights reserved.
          </div>
          <div className={styles.footerLinks}>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
