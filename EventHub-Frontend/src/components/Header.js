import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <nav className="sm:sticky top-0 z-50 w-full bg-white">
      <div className="w-full flex justify-between items-center px-40 py-5">
        <div className="flex items-center">
          <a href="/"><img src="/logo.png" /></a>
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              size="lg"
              color="white"
              className="absolute top-1.5 pl-6"
            />
            <input type="text" placeholder="Search Events" className="bg-gray-550 rounded-xl h-8 pl-8 ml-5" />
          </div>
        </div>
        <div className="flex items-center text-lg text-gray-650 font-medium">
          <p className="mr-5">About</p>
          {!user.id ? (
            <a href="/login">Login</a>
          ) : (
            <select
              className="bg-white w-28 hover:cursor-pointer"
              value="Account"
              onChange={(e) => {
                switch(e.target.value) {
                  case "Profile": {
                    navigate("/user/profile")
                    break
                  }
                  case "My Events": {
                    navigate("/user/events")
                    break
                  }
                  case "Transactions": {
                    navigate("/user/transactions")
                    break
                  }
                  case "Logout": {
                    localStorage.setItem("token", null)
                    setUser({
                      id: 0,
                      name: "",
                      email: "",
                      contact: "",
                      city: "",
                    })
                    break
                  }
                }
              }}
            >
              <option className="hidden" >Account</option>
              <option className="hover:cursor-pointer">
                Profile
              </option>
              <option className="hover:cursor-pointer">
                My Events
              </option>
              <option className="hover:cursor-pointer">
                Transactions
              </option>
              <option className="hover:cursor-pointer">
                Logout
              </option>
            </select>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
