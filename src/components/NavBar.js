import React from "react"
import LogoutButton from "./LogoutButton"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function NavBar() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold">Beta</h1>
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="challenges/" className="hover:text-gray-300 transition-colors">
                Challenges
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-gray-300 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="hover:text-gray-300 transition-colors">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}