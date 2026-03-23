// src/config/breakpoints.js
export const BP = {
  xs: '320px',   // small phones
  sm: '480px',   // large phones  
  md: '768px',   // tablets
  lg: '1024px',  // small laptops
  xl: '1280px',  // desktops
  xxl: '1536px'  // large screens
}

// CSS media query strings for use in styled components or inline:
export const MQ = {
  mobile:  '@media (max-width: 767px)',
  tablet:  '@media (min-width: 768px) and (max-width: 1023px)',
  laptop:  '@media (min-width: 1024px) and (max-width: 1279px)',
  desktop: '@media (min-width: 1280px)',
  touch:   '@media (max-width: 1023px)',  // mobile + tablet combined
}
