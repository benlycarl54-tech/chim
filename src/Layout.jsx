import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    // Add JivoChat script
    const script = document.createElement('script');
    script.src = '//code.jivosite.com/widget/nBgWA9AJK6';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <>{children}</>;
}