import { useEffect, useRef, useState } from "react"
import ReactElasticCarousel from "react-elastic-carousel"
import { useParams } from "react-router-dom"
import { fetchEventById, fetchEvents } from "../api/events"
import EventCard from "../components/EventCard"
import Footer from '../components/Footer'
import Header from '../components/Header'
import Modal from "../components/Modal"
import SubHeader from "../components/SubHeader"

const Event = () => {
  const [event, setEvent] = useState({})
  const [owners, setOwners] = useState([])
  const [similarEvents, setSimilarEvents] = useState([])
  const { eventId } = useParams()
  const carouselRef = useRef(null)
  let resetTimeout
  
  useEffect(() => {
    fetchEventById(eventId)
      .then(({ data }) => {
        setEvent(data.event_detail[0])
        setOwners(data.owner_detail)

        fetchEvents(data.city, data.category)
          .then(({ data }) => setSimilarEvents(data))
          .catch(() => alert("Not able to fetch events, please Try Again!"))
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div>
      <Header />
      <SubHeader />
      <div className="mx-20 my-10">
        <div className="text-center">
          <h1 className="text-4xl mb-2">{event.eventname}</h1>
          <p className="text-xl">{event.tagline}</p>
        </div>
        <hr className="my-8 border-y-2 border-solid border-gray-650" />
        <div className="mx-10">
          <ReactElasticCarousel
            ref={carouselRef}
            itemsToShow={1}
            enableAutoPlay={true}
            autoPlaySpeed={5000}
            showArrows={false}
            onNextEnd={({ index }) => {
              clearTimeout(resetTimeout)
              if (index === 1) {
                resetTimeout = setTimeout(() => {
                  carouselRef.current.goTo(0)
                }, 5000)
              }
            }}
          >
            <div className="flex justify-center w-full">
              <img src="/Image1.png" />
            </div>
            <div className="flex justify-center w-full">
              <img src="/Image1.png" />
            </div>
          </ReactElasticCarousel>
          <div className="flex justify-between items-stretch mx-2 my-10">
            <div className="bg-white rounded-2xl w-3/4 mr-10 py-5 px-10">
              <div className="mb-20">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-2xl font-bold">Description</h3>
                  <div className="flex items-center">
                    <p className="mr-5">Tickets Left: <span className="text-red-500">{event.maxparticipants-event.ticket_sold}</span></p>
                    <Modal event_id={event.id} event_price={event.price} />
                  </div>
                </div>
                <p>{event.description}</p>
              </div>
              <div className="flex justify-between my-5 mr-10">
                <h4 className="text-xl font-bold">Price For Each Ticket</h4>
                <p>Rs. {event.price}</p>
              </div>
              <div className="flex justify-between my-5 mr-10">
                <h4 className="text-xl font-bold">Total Tickets</h4>
                <p>{event.maxparticipants}</p>
              </div>
            </div>
            <div className="w-1/4">
              <div className="bg-white rounded-2xl px-5 py-2 mb-5">
                <h4 className="text-xl font-medium text-center">Event Time</h4>
                <h5 className="font-medium">From</h5>
                <p className="ml-4">
                  {!event.start ? null : (
                    <p>{new Date(event.start).toDateString()} {new Date(event.start).toTimeString().slice(0,5)}</p>
                  )}
                </p>
                <h5 className="font-medium">To</h5>
                <p className="ml-4">
                  {!event.start ? null : (
                    <p>{new Date(event.end).toDateString()} {new Date(event.end).toTimeString().slice(0,5)}</p>
                  )}
                </p>
              </div>
              <div className="bg-white rounded-2xl text-center px-5 py-2 mb-5">
                <h4 className="text-xl font-medium">Location</h4>
                <p>{event.location}</p>
                <p className="text-lg">{event.city}</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-2">
                <h4 className="text-xl font-medium text-center">Contact Organisers</h4>
                <ul className="list-disc ml-5">
                  {owners.map(owner => (
                    <li className="my-2">
                      <div>
                        <p>{owner.name}</p>
                        <p>{owner.email}</p>
                        <p>{owner.contact}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {!similarEvents.length ? null : (
            <div className="mx-2 my-10">
              <h3 className="text-2xl font-bold">Similar Events</h3>
              <div className="flex flex-row overflow-x-auto m-5">
                {similarEvents.map(event => (
                  <EventCard event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Event
