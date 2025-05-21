
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // md breakpoint in Tailwind

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [windowWidth, setWindowWidth] = React.useState<number>(window.innerWidth)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setWindowWidth(window.innerWidth)
    }
    
    // Add event listener
    mql.addEventListener("change", onChange)
    
    // Initial check
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    setWindowWidth(window.innerWidth)
    
    // Handle window resize for more responsive updates
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => {
      mql.removeEventListener("change", onChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return isMobile
}
