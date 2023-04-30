import { createContext, useEffect, useState } from 'react'
import { getUserDetailsByToken } from '../api/user'

const initialUser = {
  id: 0,
  name: "",
  email: "",
  contact: "",
  city: "",
}

export const AuthContext = createContext({
  user: initialUser,
  selectedCity: "",
  selectedCategory: "",
})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser)
  const [selectedCity, setSelectedCity] = useState("Mumbai")
  const [selectedCategory, setSelectedCategory] = useState(0)
  const auth = {
    user,
    setUser,
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      getUserDetailsByToken()
        .then(({ data }) => {
          setUser({
            id: data.id,
            name: data.name,
            email: data.email,
            contact: data.contact,
            city: data.city,
          })
        })
        .catch((err) => {
          console.log(JSON.stringify(err))
          localStorage.setItem("token", null)
          setUser(initialUser)
        })
    }
  }, [])

  return (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  )
}

