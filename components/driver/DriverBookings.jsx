// Send Customer Notification

if (booking.customer_id) {

  let message = "Booking status updated.";

  if (status === "Accepted") {
    message = "🚜 Driver accepted your booking.";
  }

  else if (status === "In Progress") {
    message = "🚜 Your tractor work has started.";
  }

  else if (status === "Completed") {
    message = "✅ Your tractor service is completed.";
  }

  else if (status === "Rejected") {
    message = "❌ Driver rejected your booking.";
  }

  else if (status === "Cancelled") {
    message = "❌ Your booking has been cancelled.";
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
