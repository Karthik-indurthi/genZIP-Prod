import React from 'react';

import { motion } from 'framer-motion';

const companies = [
  { name: 'TechNova', logo: 'https://via.placeholder.com/100x40?text=TechNova' },
  { name: 'HireWorks', logo: 'https://via.placeholder.com/100x40?text=HireWorks' },
  { name: 'Peoplely', logo: 'https://via.placeholder.com/100x40?text=Peoplely' },
  { name: 'NextHire', logo: 'https://via.placeholder.com/100x40?text=NextHire' },
  { name: 'BrightMind', logo: 'https://via.placeholder.com/100x40?text=BrightMind' },
  { name: 'MetaEdge', logo: 'https://via.placeholder.com/100x40?text=MetaEdge' },
  { name: 'BlueOrbit', logo: 'https://via.placeholder.com/100x40?text=BlueOrbit' },
  { name: 'LoopHire', logo: 'https://via.placeholder.com/100x40?text=LoopHire' },
  { name: 'OptiStaff', logo: 'https://via.placeholder.com/100x40?text=OptiStaff' },
  { name: 'TalentZen', logo: 'https://via.placeholder.com/100x40?text=TalentZen' },
];


const LogoScroller = () => {
  return (
    <div className="py-10 bg-gray-50 overflow-hidden">
      <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">
        Trusted by top hiring teams and aligners
      </h3>
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-12 animate-slide"
          initial={{ x: 0 }}
          animate={{ x: '-100%' }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
        >
          {[...companies, ...companies].map((company, index) => (
            <img
              key={index}
              src={company.logo}
              alt={company.name}
              className="h-12 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LogoScroller;
