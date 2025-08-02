/**
 * Performance optimization utilities
 */

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (img, src) => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target;
        image.src = src;
        image.classList.remove("lazy");
        observer.unobserve(image);
      }
    });
  });

  imageObserver.observe(img);
};

/**
 * Preload critical resources
 */
export const preloadResource = (href, as = "script") => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

/**
 * Optimize images for web
 */
export const optimizeImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return "";
  
  // If it's a base64 image, return as is
  if (url.startsWith("data:")) return url;
  
  // If it's an external URL (like Unsplash), add optimization parameters
  if (url.includes("unsplash.com")) {
    return `${url}?w=${width}&q=${quality}&auto=format&fit=crop`;
  }
  
  return url;
};

/**
 * Measure and log performance metrics
 */
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`${name} took ${end - start} milliseconds`);
    }
    
    return result;
  };
};

/**
 * Virtual scrolling for large lists
 */
export const useVirtualScrolling = (items, itemHeight = 50, containerHeight = 400) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleCount,
    totalHeight,
    getVisibleItems: (scrollTop) => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
      
      return {
        startIndex,
        endIndex,
        items: items.slice(startIndex, endIndex),
        offsetY: startIndex * itemHeight,
      };
    },
  };
};

/**
 * Memoization utility for expensive calculations
 */
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  
  return (...args) => {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};