import { useState, useEffect } from 'react'

export function useBreakpoint() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width,
    isMobile:  width < 768,
    isTablet:  width >= 768 && width < 1024,
    isLaptop:  width >= 1024 && width < 1280,
    isDesktop: width >= 1280,
    isTouch:   width < 1024,
  }
}
