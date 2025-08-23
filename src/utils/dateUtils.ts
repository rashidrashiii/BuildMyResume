/**
 * Utility functions for date formatting in resumes
 */

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString || dateString.trim() === '') {
    return '';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  } catch (error) {
    return '';
  }
};

export const formatDateRange = (startDate: string | undefined | null, endDate: string | undefined | null, current: boolean = false): string => {
  const start = formatDate(startDate);
  const end = current ? 'Present' : formatDate(endDate);
  
  if (!start && !end) {
    return '';
  }
  
  if (!start) {
    return end;
  }
  
  if (!end) {
    return start;
  }
  
  return `${start} - ${end}`;
};

export const shouldShowDate = (dateString: string | undefined | null): boolean => {
  return isValidDate(dateString) && dateString && dateString.trim() !== '';
};

export const isValidDate = (dateString: string | undefined | null): boolean => {
  if (!dateString || dateString.trim() === '') {
    return false;
  }
  
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};
