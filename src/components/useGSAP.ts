import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface UseGSAPOptions {
  scope?: React.RefObject<Element | null>;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
}

/**
 * Robust React 18/19 GSAP Context Hook
 * Encapsulates GSAP tweens and ScrollTriggers within a gsap.context().
 * Automatically reverts all created animations and ScrollTriggers on unmount
 * or when dependencies change, ensuring zero memory leaks and full React Strict Mode safety.
 */
export function useGSAP(
  callback: (context: gsap.Context) => void,
  options: UseGSAPOptions = {}
) {
  const { scope, dependencies = [], revertOnUpdate = true } = options;
  const contextRef = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    const scopeElement = scope?.current || undefined;

    contextRef.current = gsap.context((ctx) => {
      callback(ctx);
    }, scopeElement);

    return () => {
      if (revertOnUpdate) {
        contextRef.current?.revert();
      }
    };
  }, dependencies);

  return contextRef;
}
