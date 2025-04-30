import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import { useCVForm } from '@/contexts/cv-form-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WorkExperienceForm = () => {
  const [, navigate] = useLocation();
  const { formData, updateFormField, addItemToArray } = useCVForm();
  const [currentJob, setCurrentJob] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/create/3'); // Go to Education form
  };

  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate year options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full bg-blue-500 rounded-full" style={{ width: '22%' }}></div>
        </div>
        <div className="text-right text-sm text-gray-500 mt-1">22%</div>
      </div>

      <div className="bg-white rounded-lg border p-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/create/1')}
          className="text-blue-600 flex items-center mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold mb-2 text-center">Tell us about your job</h1>
        <p className="text-gray-600 mb-8 text-center">Add your work experience details below.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Label htmlFor="title">TITLE <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="e.g. Chief Engineer"
              required
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="employer">EMPLOYER <span className="text-red-500">*</span></Label>
            <Input
              id="employer"
              placeholder="e.g. Driftmark Technologies"
              required
            />
          </div>

          <div className="mb-6">
            <Label htmlFor="location">LOCATION</Label>
            <Input
              id="location"
              placeholder="e.g. Dar es Salaam, Tanzania"
            />
          </div>

          <div className="flex items-center mb-6">
            <Checkbox id="remote" />
            <Label htmlFor="remote" className="ml-2 text-gray-700">Remote</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="startMonth">START DATE <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="endDate">END DATE <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-4">
                <Select disabled={currentJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select disabled={currentJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center mb-8">
            <Checkbox 
              id="currentlyWork" 
              checked={currentJob}
              onCheckedChange={(checked) => setCurrentJob(checked as boolean)}
            />
            <Label htmlFor="currentlyWork" className="ml-2 text-gray-700">I currently work here</Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2">
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkExperienceForm;