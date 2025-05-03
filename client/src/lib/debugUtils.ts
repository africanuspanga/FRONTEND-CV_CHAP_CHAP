/**
 * Debug Utilities for CV Generation
 * 
 * These utilities help diagnose issues with CV rendering and PDF generation.
 */

/**
 * Log detailed information about DOM elements
 */
export function logDOMInfo(element: HTMLElement | null, label: string = 'Element'): void {
  if (!element) {
    console.error(`[DEBUG] ${label} is null`);
    return;
  }
  
  console.group(`[DEBUG] ${label} Info`);
  console.log('Dimensions:', {
    offsetWidth: element.offsetWidth,
    offsetHeight: element.offsetHeight,
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    scrollWidth: element.scrollWidth,
    scrollHeight: element.scrollHeight,
  });
  console.log('Style:', {
    display: getComputedStyle(element).display,
    visibility: getComputedStyle(element).visibility,
    position: getComputedStyle(element).position,
    opacity: getComputedStyle(element).opacity,
    zIndex: getComputedStyle(element).zIndex,
    overflow: getComputedStyle(element).overflow,
  });
  console.log('Position:', {
    getBoundingClientRect: element.getBoundingClientRect(),
    offsetParent: element.offsetParent,
  });
  console.log('Children count:', element.children.length);
  console.groupEnd();
}

/**
 * Add a visual debug border to an element
 */
export function addDebugBorder(element: HTMLElement | null, color: string = 'red'): void {
  if (!element) return;
  
  const originalBorder = element.style.border;
  element.style.border = `2px solid ${color}`;
  
  console.log(`[DEBUG] Added ${color} border to element`, element);
  
  // Return function to remove the debug border
  return () => {
    element.style.border = originalBorder;
    console.log('[DEBUG] Removed debug border');
  };
}

/**
 * Log information about the current template rendering state
 */
export function logTemplateRenderingInfo(templateId: string, cvData: any): void {
  console.group(`[DEBUG] Template Rendering: ${templateId}`);
  console.log('Template ID:', templateId);
  console.log('Personal Info:', cvData.personalInfo);
  console.log('Work Experience Count:', cvData.workExperiences?.length || 0);
  console.log('Education Count:', cvData.education?.length || 0);
  console.log('Skills Count:', cvData.skills?.length || 0);
  console.groupEnd();
}

/**
 * Create a diagnostic overlay to show information about the DOM
 */
export function createDiagnosticOverlay(): void {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.bottom = '10px';
  overlay.style.right = '10px';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.color = 'white';
  overlay.style.padding = '10px';
  overlay.style.borderRadius = '5px';
  overlay.style.zIndex = '10000';
  overlay.style.fontSize = '12px';
  overlay.style.maxWidth = '300px';
  overlay.style.maxHeight = '200px';
  overlay.style.overflow = 'auto';
  
  document.body.appendChild(overlay);
  
  const updateInfo = () => {
    const templates = document.querySelectorAll('.template-container');
    
    overlay.innerHTML = `
      <div><strong>Debug Info</strong></div>
      <div>Templates in DOM: ${templates.length}</div>
      <div>Window size: ${window.innerWidth}x${window.innerHeight}</div>
      <div>Device pixel ratio: ${window.devicePixelRatio}</div>
    `;
    
    if (templates.length > 0) {
      const template = templates[0] as HTMLElement;
      const rect = template.getBoundingClientRect();
      
      overlay.innerHTML += `
        <div><strong>Template:</strong></div>
        <div>Size: ${Math.round(rect.width)}x${Math.round(rect.height)}</div>
        <div>Position: ${Math.round(rect.left)},${Math.round(rect.top)}</div>
        <div>Visibility: ${getComputedStyle(template).visibility}</div>
        <div>Display: ${getComputedStyle(template).display}</div>
      `;
    }
  };
  
  // Update initially and when window resizes
  updateInfo();
  window.addEventListener('resize', updateInfo);
  
  // Return function to remove the overlay
  return () => {
    document.body.removeChild(overlay);
    window.removeEventListener('resize', updateInfo);
  };
}

/**
 * Benchmark PDF generation performance
 */
export async function benchmarkPDFGeneration(
  generatePDFFunction: (templateId: string, cvData: any) => Promise<Blob>,
  templateId: string,
  cvData: any,
  iterations: number = 3
): Promise<{ avgTime: number, results: number[] }> {
  console.log(`[DEBUG] Benchmarking PDF generation (${iterations} iterations)...`);
  
  const results: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    
    try {
      await generatePDFFunction(templateId, cvData);
      const end = performance.now();
      const time = end - start;
      results.push(time);
      console.log(`[DEBUG] Iteration ${i + 1}: ${time.toFixed(1)}ms`);
    } catch (error) {
      console.error(`[DEBUG] Iteration ${i + 1} failed:`, error);
      results.push(-1); // Mark as failed
    }
  }
  
  const successfulRuns = results.filter(time => time >= 0);
  const avgTime = successfulRuns.length > 0
    ? successfulRuns.reduce((sum, time) => sum + time, 0) / successfulRuns.length
    : -1;
  
  console.log(`[DEBUG] Benchmark results:`);
  console.log(`- Average time: ${avgTime >= 0 ? avgTime.toFixed(1) + 'ms' : 'All attempts failed'}`);
  console.log(`- Success rate: ${successfulRuns.length}/${iterations}`);
  
  return { avgTime, results };
}