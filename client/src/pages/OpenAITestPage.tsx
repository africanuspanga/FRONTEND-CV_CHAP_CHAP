/**
 * OpenAI Test Page
 * A test page for checking OpenAI integration functionality
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle, Brain } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAIStatus } from '@/hooks/use-ai-status';
import { getWorkExperienceRecommendations, getSkillRecommendations, enhanceProfessionalSummary } from '@/lib/openai-service';

const OpenAITestPage: React.FC = () => {
  const { hasOpenAI, isLoading: isCheckingAI } = useAIStatus();
  
  // Work Experience test
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [company, setCompany] = useState('Tech Solutions Inc');
  const [workExperienceLoading, setWorkExperienceLoading] = useState(false);
  const [workExperienceResults, setWorkExperienceResults] = useState<string[]>([]);
  const [workExperienceError, setWorkExperienceError] = useState<string | null>(null);
  
  // Skills test
  const [profession, setProfession] = useState('Software Engineer');
  const [yearsExperience, setYearsExperience] = useState('3');
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsResults, setSkillsResults] = useState<string[]>([]);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  
  // Summary test
  const [summaryText, setSummaryText] = useState('I am a software engineer with experience in React and Node.js. I have worked on several projects involving web development.');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  const testWorkExperience = async () => {
    setWorkExperienceLoading(true);
    setWorkExperienceError(null);
    setWorkExperienceResults([]);
    
    try {
      const results = await getWorkExperienceRecommendations(jobTitle, company);
      setWorkExperienceResults(results);
    } catch (error) {
      console.error('Work experience test error:', error);
      setWorkExperienceError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setWorkExperienceLoading(false);
    }
  };
  
  const testSkills = async () => {
    setSkillsLoading(true);
    setSkillsError(null);
    setSkillsResults([]);
    
    try {
      const results = await getSkillRecommendations(profession, parseInt(yearsExperience) || undefined);
      setSkillsResults(results);
    } catch (error) {
      console.error('Skills test error:', error);
      setSkillsError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setSkillsLoading(false);
    }
  };
  
  const testSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryResult('');
    
    try {
      const result = await enhanceProfessionalSummary(summaryText);
      setSummaryResult(result);
    } catch (error) {
      console.error('Summary test error:', error);
      setSummaryError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setSummaryLoading(false);
    }
  };
  
  return (
    <div className="container py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">OpenAI Integration Tests</h1>
        <div className="flex items-center">
          {isCheckingAI ? (
            <span className="flex items-center text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking API Status
            </span>
          ) : hasOpenAI ? (
            <span className="flex items-center text-green-500">
              <CheckCircle className="mr-2 h-4 w-4" /> OpenAI API Available
            </span>
          ) : (
            <span className="flex items-center text-red-500">
              <AlertCircle className="mr-2 h-4 w-4" /> OpenAI API Unavailable
            </span>
          )}
        </div>
      </div>
      
      {/* Work Experience Recommendations Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Work Experience Recommendations</CardTitle>
          <CardDescription>
            Test generating bullet points for a work experience entry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Tech Company Inc."
            />
          </div>
          
          {workExperienceResults.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="font-medium mb-2">Generated Work Experience:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {workExperienceResults.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {workExperienceError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Error:</h3>
              </div>
              <p className="mt-1">{workExperienceError}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testWorkExperience}
            disabled={workExperienceLoading || !hasOpenAI || isCheckingAI}
          >
            {workExperienceLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Test Work Experience Recommendations
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Skills Recommendations Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Skills Recommendations</CardTitle>
          <CardDescription>
            Test generating skill recommendations for a profession
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of Experience</Label>
            <Input
              id="yearsExperience"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="e.g. 3"
              type="number"
            />
          </div>
          
          {skillsResults.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="font-medium mb-2">Generated Skills:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {skillsResults.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {skillsError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Error:</h3>
              </div>
              <p className="mt-1">{skillsError}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testSkills}
            disabled={skillsLoading || !hasOpenAI || isCheckingAI}
          >
            {skillsLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Test Skills Recommendations
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Professional Summary Test */}
      <Card>
        <CardHeader>
          <CardTitle>Test Professional Summary Enhancement</CardTitle>
          <CardDescription>
            Test enhancing a professional summary using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="summaryText">Original Summary</Label>
            <Textarea
              id="summaryText"
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={4}
              placeholder="Enter a professional summary to enhance"
            />
          </div>
          
          {summaryResult && (
            <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-200">
              <h3 className="font-medium mb-2">Enhanced Summary:</h3>
              <p className="text-gray-800">{summaryResult}</p>
            </div>
          )}
          
          {summaryError && (
            <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200 text-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Error:</h3>
              </div>
              <p className="mt-1">{summaryError}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={testSummary}
            disabled={summaryLoading || !hasOpenAI || isCheckingAI}
          >
            {summaryLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Test Summary Enhancement
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OpenAITestPage;
