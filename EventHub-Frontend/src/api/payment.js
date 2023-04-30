import api from "."

export const payOrder = (
  amount,
  user_id,
  event_id,
  ticket_count,
) => {
  return api.post("/pay/order", {
    amount,
    user_id,
    event_id,
    ticket_count,
  })
}

export const payment = (
  razorpay_signature,
  razorpay_order_id,
  transactionid,
  transactionamount,
  ticket_count,
  event_id,
) => {
  return api.post('/pay/payment', {
    razorpay_signature,
    razorpay_order_id,
    transactionid,
    transactionamount,
    ticket_count,
    event_id,
  })
}
