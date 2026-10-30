import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "./privacy-policy";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | MaidForLiving" },
      { name: "description", content: "Terms and conditions for using MaidForLiving cleaning services and website." },
      { property: "og:title", content: "Terms & Conditions | MaidForLiving" },
      { property: "og:description", content: "The terms that apply to MaidForLiving bookings and services." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      sections={[
        ["Bookings", "Online bookings are requests until confirmed by MaidForLiving. We will contact you to confirm your appointment."],
        ["Pricing", "Prices shown online are estimates. Final pricing is confirmed based on your home's size, condition and requested services."],
        ["Rescheduling & cancellations", "Please contact us as early as possible to reschedule or cancel an appointment."],
        ["Access", "Customers are responsible for providing safe access to the property at the scheduled time."],
        ["Satisfaction", "If something was missed, let us know promptly so we can make it right."],
        ["Changes", "We may update these terms from time to time. Continued use of our services means you accept the updated terms."],
      ]}
    />
  ),
});
