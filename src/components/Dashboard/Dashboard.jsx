import React, { useEffect } from 'react';

export default function Dashboard() {

  useEffect(() => {
    if (!window.sessionStorage.getItem("auth_token")) {
      window.location.href = "/login";
    }
  });

  return(
    <h2>Dashboard</h2>
  );
}