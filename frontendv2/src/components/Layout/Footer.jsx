import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-4 px-6 border-t border-gray-200">
      <div className="container mx-auto">
        <p className="text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Skill-Peak. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;