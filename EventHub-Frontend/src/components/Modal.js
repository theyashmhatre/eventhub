import React, { useEffect } from "react"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { payOrder, payment } from "../api/payment"

export default function Modal({ event_id, event_price }) {
  const [showModal, setShowModal] = React.useState(false)
  const [ticket_count, setTicketCount] = React.useState(0)
  const { user } = useContext(AuthContext)

  const increment = () => {
    setTicketCount(ticket_count +1)
  }
  const decrement = () => {
    if (ticket_count <=0){
      setTicketCount(0)
      return
    }
    setTicketCount(ticket_count -1)
  }

  useEffect(() => {
    const script = document.createElement("script")

    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true

    document.body.appendChild(script)
  }, [])

  function openPayModal(amount){
    var options = {
      "key": process.env.REACT_APP_RAZORPAY_ID,
      "amount": 0, // 2000 paise = INR 20, amount in paisa
      "name": "EventHub",
      'order_id': "something",
      "handler": function (response) {
        console.log(response)
        var values = {
          razorpay_signature: response.razorpay_signature,
          razorpay_order_id: response.razorpay_order_id,
          transactionid: response.razorpay_payment_id,
          transactionamount: amount,
          ticket_count:ticket_count,
          event_id: event_id
        }
        payment(values)
          .then(res => {
            alert("Success")
            setShowModal(false)
          })
          .catch(e => console.log(e))
      },
      "theme": {
        "color": "#528ff0"
      }
    }

    payOrder(amount, user.id, event_id, ticket_count)
      .then(res => {
        options.order_id = res.data.id
        options.amount = res.data.amount
        console.log(options)
        var rzp1 = new window.Razorpay(options)
        rzp1.open()
      })
      .catch(e => console.log(e))
  }

  

  return (
    <>
      <button
        className="bg-purple-550 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Book Now
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Order Summary
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <table>
                    <tr><td>Ticket Amount:</td><td>${event_price}</td></tr>
                    <tr>
                      <td><button onClick={decrement}>-</button></td>
                      <td>{ticket_count}</td>
                      <td><button onClick={increment}>+</button></td>
                    </tr>
                  </table>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      let amount = ticket_count*event_price
                      openPayModal(amount)
                    }}
                  >
                    Pay Now ${event_price * ticket_count}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  )
}