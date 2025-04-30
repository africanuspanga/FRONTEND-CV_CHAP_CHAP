import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en', { 
    year: 'numeric', 
    month: 'long'
  });
  
  return formatter.format(date);
}

export function capitalizeFirstLetter(string: string): string {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function objectToFormData(obj: Record<string, any>, formData = new FormData(), namespace = ''): FormData {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const formKey = namespace ? `${namespace}[${key}]` : key;
      
      if (obj[key] instanceof Date) {
        formData.append(formKey, obj[key].toISOString());
      } else if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof File)) {
        objectToFormData(obj[key], formData, formKey);
      } else {
        formData.append(formKey, obj[key] === null ? '' : obj[key]);
      }
    }
  }
  
  return formData;
}

export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
