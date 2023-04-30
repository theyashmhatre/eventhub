import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createEvent, fetchCategories } from "../api/events"
import { getUserDetailsByEmail } from "../api/user"
import Footer from "../components/Footer"
import Header from "../components/Header"

const CreateEvent = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [capacity, setCapacity] = useState()
  const [category, setCategory] = useState(0)
  const [price, setPrice] = useState()
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [newOwnerEmail, setNewOwnerEmail] = useState("")
  const [owners, setOwners] = useState([])
  const [agreeTC, setAgreeTC] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([{
    id: 0,
    name: "Select Category"
  }])
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchCategories()
      .then(({ data }) => setCategories([
        { id: 0, name: "Select Category" },
        ...data
      ]))
      .catch(() => console.log("Not able to fetch categories"))
  }, [])

  const publish = () => {
    setError("")
    if (
      name &&
      description &&
      start &&
      end &&
      capacity &&
      category &&
      price &&
      address &&
      city &&
      agreeTC
    ) {
      const ownerIds = owners.map(owner => owner.id)
      createEvent(
        name,
        description,
        start,
        end,
        capacity,
        category,
        price,
        address,
        city,
        ownerIds
      )
        .then(() => navigate("/"))
        .catch(() => setError("Error while creating new event"))
    } else setError("All fields are required except Co-owners")
  }

  const findOwnerDetails = () => {
    setError("")
    if (!newOwnerEmail) {
      setError("Owner Email Required to find owner account")
      return
    }
    let ownerAdded = false
    owners.map(owner => {
      if (newOwnerEmail === owner.email) ownerAdded = true
    })
    if (ownerAdded) {
      setError("Owner already added!")
      return
    }
    getUserDetailsByEmail(newOwnerEmail)
      .then(({ data }) => {
        if (!data.id) {
          setError("No user exist with this email")
          return
        }
        setOwners(prev => [
          ...prev, data
        ])
        setNewOwnerEmail("")
      })
      .catch(err => setError("Error while fetching user details"))
  }

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center bg-purple-550 p-10">
        <div className="bg-white rounded-3xl w-full p-10">
          <h1 className="text-4xl text-center mb-2">Showcase Your Event on EventHUB</h1>
          <hr className="my-8 border-y-2 border-solid border-gray-650" />
          <div className="m-10">
            <div className="flex justify-around items-center">
              <div className="w-5/12">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Event Name"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Event Description"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
                <input
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  placeholder="Event Start Date Time"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
                <input
                  type="datetime-local"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  placeholder="Event End Date Time"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Maximum Participants"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
              </div>
              <div className="w-5/12">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ticket Price"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
                <select
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full py-3 px-4 m-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Event Address"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3 mt-4"
                />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter City"
                  className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full p-4 m-3"
                />
                <div className="border-2 border-solid border-gray-650 rounded-xl w-full m-3 p-2">
                  {!owners.length ? null : (
                    <div className="bg-gray-650 text-xl text-white rounded-xl w-full my-2 p-4">
                      <ul className="list-disc ml-5">
                        {owners.map(owner => (
                          <li>
                            <div>
                              <p>{owner.name}</p>
                              <p>{owner.email}</p>
                              <p>{owner.contact}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <input
                    type="text"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="Enter Co-owner Email"
                    className="bg-gray-650 text-xl text-white placeholder-white rounded-xl w-full my-2 p-4"
                  />
                  <div className="flex justify-center my-2">
                    <button
                      className="bg-purple-550 text-white text-lg font-medium rounded-xl px-8 py-2"
                      onClick={findOwnerDetails}
                    >
                      Add Co-owner
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center my-4">
              <input
                type="checkbox"
                value={agreeTC}
                onClick={() => setAgreeTC(!agreeTC)}
                className="bg-gray-650 mr-3 hover:cursor-pointer"
              />
              <p className="text-lg">I've read all the Terms &amp; Conditions of EventHUB, and agreed to the same!</p>
            </div>
            {!error ? null : (
              <p className="text-red-500 text-center font-medium m-3">
                {error}
              </p>
            )}
            <div className="flex justify-center">
              <button
                className="bg-purple-550 text-white text-lg font-medium rounded-xl px-8 py-2"
                onClick={publish}
              >
                Publish!
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CreateEvent
