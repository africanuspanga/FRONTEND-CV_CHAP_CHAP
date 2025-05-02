/**
 * Work Experience Recommendations Dialog
 * Shows AI-generated bullet points for a job position with options to accept or reject
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkExperienceRecommendationsDialogProps {
  jobTitle: string;
  company: string;
  recommendations: string[];
  onAccept: () => void;
  onReject: () => void;
}

const WorkExperienceRecommendationsDialog: React.FC<WorkExperienceRecommendationsDialogProps> = ({
  jobTitle,
  company,
  recommendations,
  onAccept,
  onReject
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Expert recommendations for {jobTitle}
          </CardTitle>
          <CardDescription>
            You can edit these in the next step.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-3 my-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onReject}
            className="w-32"
          >
            No thanks
          </Button>
          
          <Button 
            onClick={onAccept}
            className="w-48 bg-teal-600 hover:bg-teal-700"
          >
            Add recommendations
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkExperienceRecommendationsDialog;
