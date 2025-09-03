import React from 'react';
import { Calendar, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8" />
              <span className="text-2xl font-bold">365 Days</span>
            </div>
            <p className="text-blue-100 max-w-md">
              Your trusted partner for premium digital products. Quality resources to help you succeed every day of the year.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-100 hover:text-white transition-colors">
                About Us
              </a>
              <a href="#" className="block text-blue-100 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-blue-100 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-blue-100 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">support@365days.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">New York, USA</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <p className="text-blue-100">
            © 2025 365 Days. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;