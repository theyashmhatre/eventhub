import api from "."

export const fetchCategories = async () => {
  return api.get("/event/types")
}

export const fetchEvents = async (city, categoryId=0, page=1, limit=10) => {
  return api.get(`/event/events/${city}/${page}/${limit}?categoryId=${categoryId}`)
}

export const fetchEventById = async (eventId) => {
  return api.get(`/event/eventDetail/${eventId}`)
}

export const createEvent = async (
  name,
  description,
  start,
  end,
  capacity,
  category,
  price,
  address,
  city,
  owners,
) => {
  return api.post("/event/create", {
    name,
    description,
    startDate: start,
    endDate: end,
    maxparticipants: capacity,
    categoryId: category,
    price,
    location: address,
    city,
    owners,
    userToken: localStorage.getItem("token")
  })
}
