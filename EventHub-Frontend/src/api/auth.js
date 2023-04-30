import api from "."

export const register = async (
  name,
  email,
  contact,
  password,
  address,
  city,
) => {
  return await api.post("/user/register", {
    name,
    email,
    contact,
    password,
    address,
    city,
  })
}

export const login = async (email, password) => {
  return await api.post("/user/login", { email, password })
}
