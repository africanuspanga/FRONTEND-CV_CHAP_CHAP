import React from 'react';

// This component is used to display the template previews for demo purposes
const DemoTemplates: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 p-6">
      <h2 className="text-2xl font-bold">New Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg overflow-hidden bg-[#e6f2ff] flex flex-col">
          <div className="p-4 flex-grow relative">
            <img 
              src="Moonlight Sonata template preview" 
              alt="Moonlight Sonata template preview"
              className="text-center text-gray-600 absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-xl font-bold">Moonlight Sonata</h3>
            <p className="text-gray-600 mt-2">A modern template with a warm orange sidebar and clean layout</p>
          </div>
        </div>
        
        <div className="rounded-lg overflow-hidden bg-[#e6f2ff] flex flex-col">
          <div className="p-4 flex-grow relative">
            <img 
              src="Kazi Fasta template preview" 
              alt="Kazi Fasta template preview"
              className="text-center text-gray-600 absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-4 bg-white">
            <h3 className="text-xl font-bold">Kazi Fasta</h3>
            <p className="text-gray-600 mt-2">Clean two-column layout with skill bars and detailed professional experience sections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoTemplates;