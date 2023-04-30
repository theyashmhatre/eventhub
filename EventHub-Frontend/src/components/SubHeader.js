import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { fetchCategories } from "../api/events"

const SubHeader = () => {
  const {
    selectedCity,
    setSelectedCity,
    selectedCategory,
    setSelectedCategory
  } = useContext(AuthContext)
  const [categories, setCategories] = useState([{
    id: 0,
    name: "All Categories"
  }])
  
  useEffect(() => {
    fetchCategories()
      .then(({ data }) => setCategories([
        { id: 0, name: "All Categories" },
        ...data
      ]))
      .catch(() => console.log("Not able to fetch categories"))
  }, [])

  return (
    <div className="flex justify-between items-center bg-gray-650 text-white h-12 px-24">
      <select
        className="font-medium bg-gray-650"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map(category => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <select
        className="font-medium bg-gray-650"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option>Bangalore</option>
        <option>Mumbai</option>
        <option>City 2</option>
        <option>City 3</option>
        <option>City 4</option>
        <option>City 5</option>
      </select>
      <a
        className="bg-purple-550 font-medium rounded-xl px-4 py-1"
        href="/event/new"
      >
        Publish Event
      </a>
      <a href="/offers" className="font-medium">Offers</a>
    </div>
  )
}

export default SubHeader
