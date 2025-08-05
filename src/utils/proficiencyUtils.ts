import React from 'react';

// Standardized proficiency level utilities for resume templates

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  rating: number; // 1-5 stars (legacy field, now calculated from proficiency)
}

/**
 * Maps proficiency level to CEFR level for display
 */
export const getProficiencyLevel = (proficiency: string): string => {
  switch (proficiency) {
    case 'Native': return 'Native (C2)';
    case 'Fluent': return 'Fluent (C1)';
    case 'Conversational': return 'Conversational (B2)';
    case 'Basic': return 'Basic (A2)';
    default: return proficiency;
  }
};

/**
 * Maps proficiency level to rating (1-5) for visual indicators
 */
export const getProficiencyRating = (proficiency: string): number => {
  switch (proficiency) {
    case 'Native': return 5;
    case 'Fluent': return 4;
    case 'Conversational': return 3;
    case 'Basic': return 2;
    default: return 1;
  }
};

/**
 * Renders star rating based on proficiency level
 */
export const renderStars = (proficiency: string, size: string = 'h-3 w-3', filledColor: string = '#2563eb', emptyColor: string = '#9ca3af') => {
  const rating = getProficiencyRating(proficiency);
  
  return Array.from({ length: 5 }, (_, i) => {
    const isFilled = i < rating;
    return React.createElement(
      'svg',
      {
        key: i,
        className: size,
        style: {
          fill: isFilled ? filledColor : 'none',
          stroke: isFilled ? filledColor : emptyColor,
        },
        viewBox: "0 0 24 24",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      React.createElement('polygon', {
        points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      })
    );
  });
};

/**
 * Renders dot rating based on proficiency level
 */
export const renderDots = (proficiency: string, size: string = 'w-2 h-2', filledColor: string = 'bg-gray-900', emptyColor: string = 'bg-gray-300') => {
  const rating = getProficiencyRating(proficiency);
  
  return Array.from({ length: 5 }, (_, i) => 
    React.createElement('div', {
      key: i,
      className: `${size} rounded-full ${i < rating ? filledColor : emptyColor}`
    })
  );
};

/**
 * Renders proficiency bar based on proficiency level
 */
export const renderProficiencyBar = (proficiency: string, segments: number = 12, filledColor: string = '#000', emptyColor: string = '#e0e0e0') => {
  const rating = getProficiencyRating(proficiency);
  
  return Array.from({ length: segments }, (_, i) => {
    const isFilled = i < Math.round((rating / 5) * segments);
    return React.createElement('div', {
      key: i,
      style: {
        height: '8px',
        width: `${100 / segments}%`,
        backgroundColor: isFilled ? filledColor : emptyColor,
        marginRight: '2px'
      }
    });
  });
}; 