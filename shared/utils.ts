import { useState, useEffect } from 'react';

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function makeUrlName(title: string, addTimestamp: boolean = false) {
  let urlname = title.trim();
  urlname = urlname.toLowerCase();
  urlname = urlname.replace(/ /gim, '_');
  if (addTimestamp) {
    const now = new Date().valueOf();
    urlname = `${urlname}-${now}`;
  }
  return urlname;
}
