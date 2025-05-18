/**
 * Test utilities for ensuring application stability and catching issues early
 */

import { CVFormData } from '@/contexts/cv-form-context';
import { validateCVData, isWebsiteLink, isWorkExperience, isEducation } from './data-validator';

interface TestResult {
  passed: boolean;
  name: string;
  message?: string;
  details?: any;
}

/**
 * Runs a series of validation checks on CV data to ensure it's well-formed
 * @param data CV form data to validate
 * @returns Test results for each validation check
 */
export function validateCVStructure(data: CVFormData): TestResult[] {
  const results: TestResult[] = [];
  
  // Test: Check if personal info exists and has required fields
  results.push({
    name: 'Personal Info Basic Structure',
    passed: data && data.personalInfo && typeof data.personalInfo === 'object',
    message: data?.personalInfo ? 'Personal info exists' : 'Personal info missing'
  });
  
  // Test: Check critical personal info fields
  if (data?.personalInfo) {
    const { firstName, lastName, email } = data.personalInfo;
    results.push({
      name: 'Personal Info Required Fields',
      passed: Boolean(firstName && lastName && email),
      message: firstName && lastName && email 
        ? 'Required personal fields present' 
        : 'Missing required personal fields',
      details: { 
        firstName: Boolean(firstName), 
        lastName: Boolean(lastName), 
        email: Boolean(email) 
      }
    });
  }
  
  // Test: Validate work experience array structure
  if (data?.workExperiences || data?.workExp) {
    const workExp = data.workExperiences || data.workExp || [];
    results.push({
      name: 'Work Experience Structure',
      passed: Array.isArray(workExp),
      message: Array.isArray(workExp) 
        ? 'Work experience is a valid array' 
        : 'Work experience is not an array',
      details: { length: Array.isArray(workExp) ? workExp.length : 0 }
    });
    
    // Test: Check work entries for required fields
    if (Array.isArray(workExp) && workExp.length > 0) {
      const allValid = workExp.every(exp => isWorkExperience(exp));
      results.push({
        name: 'Work Experience Items Validation',
        passed: allValid,
        message: allValid 
          ? 'All work experiences have required fields' 
          : 'Some work experiences missing required fields',
        details: { 
          validCount: workExp.filter(exp => isWorkExperience(exp)).length,
          totalCount: workExp.length 
        }
      });
    }
  }
  
  // Test: Validate education array structure
  if (data?.education) {
    results.push({
      name: 'Education Structure',
      passed: Array.isArray(data.education),
      message: Array.isArray(data.education) 
        ? 'Education is a valid array' 
        : 'Education is not an array',
      details: { length: Array.isArray(data.education) ? data.education.length : 0 }
    });
    
    // Test: Check education entries for required fields
    if (Array.isArray(data.education) && data.education.length > 0) {
      const allValid = data.education.every(edu => isEducation(edu));
      results.push({
        name: 'Education Items Validation',
        passed: allValid,
        message: allValid 
          ? 'All education entries have required fields' 
          : 'Some education entries missing required fields',
        details: { 
          validCount: data.education.filter(edu => isEducation(edu)).length,
          totalCount: data.education.length 
        }
      });
    }
  }
  
  // Test: Website links validation (if present)
  if (data?.websites) {
    results.push({
      name: 'Websites Structure',
      passed: Array.isArray(data.websites),
      message: Array.isArray(data.websites) 
        ? 'Websites is a valid array' 
        : 'Websites is not an array'
    });
    
    // Test: Check if website links have proper structure
    if (Array.isArray(data.websites) && data.websites.length > 0) {
      const allValid = data.websites.every(site => isWebsiteLink(site));
      results.push({
        name: 'Website Link Format',
        passed: allValid,
        message: allValid 
          ? 'All website links have proper format' 
          : 'Some website links have incorrect format',
        details: { invalidLinks: allValid ? [] : data.websites.filter(site => !isWebsiteLink(site)) }
      });
    }
  }
  
  // Test: Check template ID exists
  results.push({
    name: 'Template ID',
    passed: Boolean(data?.templateId),
    message: data?.templateId 
      ? `Template ID present: ${data.templateId}` 
      : 'Template ID missing'
  });
  
  return results;
}

/**
 * Checks the consistency between work experiences arrays 
 * (workExperiences and workExp) used by different templates
 * @param data CV form data to check
 * @returns Test results for consistency checks
 */
export function checkWorkExperienceConsistency(data: CVFormData): TestResult {
  // Skip if one or both arrays don't exist
  if (!data || (!data.workExperiences && !data.workExp)) {
    return {
      name: 'Work Experience Consistency',
      passed: true,
      message: 'No work experience arrays to compare',
    };
  }
  
  // If only one array exists, return true (nothing to compare)
  if (!data.workExperiences || !data.workExp) {
    return {
      name: 'Work Experience Consistency',
      passed: true,
      message: 'Only one work experience array exists',
    };
  }
  
  // Compare array lengths
  const lengthMatch = data.workExperiences.length === data.workExp.length;
  
  // For detailed validation, compare each entry's ID
  const workExpIds = data.workExp.map(item => item.id).sort();
  const workExperiencesIds = data.workExperiences.map(item => item.id).sort();
  const idsMatch = workExpIds.join(',') === workExperiencesIds.join(',');
  
  return {
    name: 'Work Experience Consistency',
    passed: lengthMatch && idsMatch,
    message: lengthMatch && idsMatch 
      ? 'Work experience arrays are consistent' 
      : 'Work experience arrays are inconsistent',
    details: {
      lengthMatch,
      idsMatch,
      workExpCount: data.workExp.length,
      workExperiencesCount: data.workExperiences.length,
    }
  };
}

/**
 * Checks if CV data structure is valid for template rendering
 * @param templateId Template ID to check against
 * @param data CV data to validate
 * @returns Test result with rendering readiness
 */
export function checkTemplateRenderReadiness(templateId: string, data: CVFormData): TestResult {
  if (!templateId) {
    return {
      name: 'Template Render Readiness',
      passed: false,
      message: 'No template ID provided',
    };
  }
  
  if (!data || !data.personalInfo) {
    return {
      name: 'Template Render Readiness',
      passed: false,
      message: 'Missing required personal information',
    };
  }
  
  // Each template might have specific requirements
  // This is a basic check for common fields
  const { firstName, lastName } = data.personalInfo;
  const hasName = Boolean(firstName && lastName);
  
  // Check for minimum fields based on template
  let templateSpecificResult = true;
  let templateMessage = '';
  
  switch (templateId) {
    case 'kilimanjaro':
    case 'tanzanitePro':
      // These templates need job title and summary
      templateSpecificResult = Boolean(
        data.personalInfo.professionalTitle || 
        data.personalInfo.jobTitle
      );
      if (!templateSpecificResult) {
        templateMessage = 'Missing professional title for this template';
      }
      break;
      
    // Add specific checks for other templates as needed
  }
  
  return {
    name: 'Template Render Readiness',
    passed: hasName && templateSpecificResult,
    message: hasName && templateSpecificResult 
      ? 'Data is ready for template rendering' 
      : `Data is not ready for template: ${templateMessage || 'Missing required fields'}`,
    details: {
      hasName,
      templateSpecificResult,
      templateId
    }
  };
}

/**
 * Runs all CV data tests and returns comprehensive results
 * @param data CV data to test
 * @returns Results of all tests
 */
export function runAllCVTests(data: CVFormData): {
  allPassed: boolean;
  results: TestResult[];
} {
  const structureResults = validateCVStructure(data);
  const consistencyResult = checkWorkExperienceConsistency(data);
  const renderReadyResult = checkTemplateRenderReadiness(data.templateId, data);
  
  const allResults = [...structureResults, consistencyResult, renderReadyResult];
  const allPassed = allResults.every(result => result.passed);
  
  return {
    allPassed,
    results: allResults
  };
}

/**
 * Logs test results to console in a readable format
 * @param results Test results to log
 */
export function logTestResults(results: TestResult[]): void {
  console.group('CV Data Test Results');
  
  const passedTests = results.filter(test => test.passed);
  const failedTests = results.filter(test => !test.passed);
  
  console.log(`✅ Passed: ${passedTests.length}/${results.length} tests`);
  
  if (failedTests.length > 0) {
    console.group('❌ Failed Tests:');
    failedTests.forEach(test => {
      console.log(`- ${test.name}: ${test.message}`);
      if (test.details) {
        console.log('  Details:', test.details);
      }
    });
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return;
}