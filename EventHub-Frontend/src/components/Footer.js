import { faHeadset } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Footer = () => {
  return (
    <div className="w-full bg-gray-650 py-10 px-20">
      <div className="relative h-5 w-full flex justify-center border-b-2 border-dotted border-black leading-1 mb-5">
        <img src="/logo.png" className="absolute top-0 bg-gray-650 px-5" />
      </div>
      <p className="text-center text-xl font-medium">Experience Unforgettable Events</p>
      <div className="flex justify-around items-center text-lg text-white my-5">
        <div className="flex flex-col justify-center">
          <FontAwesomeIcon
            icon={faHeadset}
            size="5x"
            color="white"
          />
          <p className="font-bold mt-2">24x7 Customer Care</p>
        </div>
        <div className="text-center my-5">
          <p>About</p>
          <p>Offers</p>
          <p>Terms &amp; Conditions</p>
          <p>Policies &amp; Procedures</p>
        </div>
        <div className="flex flex-col justify-center">
          <FontAwesomeIcon
            icon={faHeadset}
            size="5x"
            color="white"
          />
          <p className="font-bold mt-2">Subscribe EventHUB Now!</p>
        </div>
      </div>
      <div className="flex justify-center items-center text-lg font-medium">
        <p>Looking for a partnership with us? Today is the great day! Let&apos;s connect!</p>
        <button className="bg-purple-550 text-white rounded-xl px-4 py-1 ml-5">Contact Us</button>
      </div>
    </div>
  )
}

export default Footer
