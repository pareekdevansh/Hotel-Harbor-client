import React, { useState, useEffect } from "react";
function Navbar() {
  const [user, setuser] = useState();
  useEffect(() => {
    setuser(JSON.parse(localStorage.getItem("currentUser")));
  }, []);
  return (
    <div>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <a class="navbar-brand" href="/about">
            Hotel Harbour
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            {user ? (
              <li class=" navbar-nav nav-item">
                <h1 color="red">{user.name}</h1>
              </li>
            ) : (
              <ul class="navbar-nav ">
                <li class="nav-item">
                  <a class="nav-link " aria-current="page" href="/register">
                    Register
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/login">
                    Login
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
