import { useEffect, useState } from 'react'

/** True once the page has scrolled past `threshold` — used for nav chrome. */
export function useScrolled(threshold = 40) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return on
}
