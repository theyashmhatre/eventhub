const EventCard = ({ event }) => {
  return (
    <a
      href={`/event/${event.id}`}
      className="bg-white rounded-xl m-5 h-[380px] w-[280px]"
    >
      <div className="flex justify-center w-full h-1/2 overflow-hidden rounded-t-xl">
        <img
          src="/Image2.png"
          className="rounded-t-xl h-full w-auto max-w-none"
        />
      </div>
      <div className="text-center my-2">
        <h2 className="text-xl font-bold">{event.eventname}</h2>
        <div className="mb-2">
          <p>{event.tagline}</p>
          <p className="text-xs">From {event.start}</p>
          <p className="text-xs">To {event.end}</p>
        </div>
        <button className="bg-purple-550 rounded-xl text-white font-medium px-4 py-1">Book Now</button>
        <div className="my-2">
          <p className="text-xs">{event.location}</p>
          <p>{event.city}</p>
        </div>
      </div>
    </a>
  )
}

export default EventCard
