// Send Customer Notification

if (booking.customer_id) {

  let message = "";

  switch (status) {

    case "Accepted":
      message = "🚜 Driver accepted your booking.";
      break;

    case "In Progress":
      message = "🚜 Your tractor work has started.";
      break;

    case "Completed":
      message = "✅ Your tractor service is completed.";
      break;

    case "Rejected":
      message = "❌ Driver rejected your booking.";
      break;

    default:
      message = `Booking status updated to ${status}.`;
      break;
  }

  await supabase
    .from("notifications")
    .insert([
      {
        user_id: booking.customer_id,
        title: `Booking ${status}`,
        message,
        created_at: new Date().toISOString(),
      },
    ]);
}
