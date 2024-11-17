import React, { useEffect } from 'react';

function Layout({ children, title = "Beta" }) {
  useEffect(() => {
    document.title = title;

    const body = document.body;
    body.classList.add("bg-gray-100", "dark:bg-gray-100");

    return () => {
      body.classList.remove("bg-gray-100", "dark:bg-gray-100");
    };
  }, [title]);

  return (
    <div className="h-[100vh]">
      <div>{children}</div>
    </div>
  );
}

export default Layout;
