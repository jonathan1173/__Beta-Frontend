import React, { useEffect } from 'react';

function Layout({ children, title = "Beta" }) {
  useEffect(() => {
    document.title = title;

    const body = document.body;
    body.classList.add("bg-gray-500", "dark:bg-gray-900");

    return () => {
      body.classList.remove("bg-gray-500", "dark:bg-gray-900");
    };
  }, [title]);

  return (
    <div className="h-[100vh]">
      <div>{children}</div>
    </div>
  );
}

export default Layout;
