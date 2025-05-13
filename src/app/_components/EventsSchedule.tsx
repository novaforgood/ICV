import EventCard from "./EventCard";

filteredEvents.map((event) => (
  <EventCard key={String(event.id)} event={event} />
));
