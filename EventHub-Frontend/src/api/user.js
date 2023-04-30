import api from "."

export const getUserDetailsByEmail = (email) => {
  return api.post("/user/details", { email })
}
export const getUserDetailsByToken = () => {
  return api.post("/user/verify/details")
}
