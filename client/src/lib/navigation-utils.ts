// Navigation utility functions

/**
 * Navigates to the specified URL with scroll to top behavior
 * This ensures a consistent experience across the application
 * @param navigate - The navigation function from useLocation()
 * @param url - The URL to navigate to
 */
export const navigateWithScrollReset = (navigate: (url: string) => void, url: string) => {
  // First scroll to top
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  
  // Then navigate after a small delay to ensure the scroll completed
  setTimeout(() => {
    navigate(url);
  }, 100);
};