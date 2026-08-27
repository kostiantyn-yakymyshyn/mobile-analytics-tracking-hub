import { useEffect, useState } from "react";
import { load } from "js-yaml";
import type { TrackingEvent } from "./types/event";
import { eventFiles } from "./data/events-index";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import EventForm from "./components/EventForm";

function App() {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<TrackingEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        const loadedEvents = await Promise.all(
          eventFiles.map(async (file) => {
            const response = await fetch(file);

            if (!response.ok) {
              throw new Error(
                `Failed to load ${file}: ${response.status}`
              );
            }

            const text = await response.text();

            return load(text) as TrackingEvent;
          })
        );

        setEvents(loadedEvents);

        if (loadedEvents.length > 0) {
          setSelectedEvent(loadedEvents[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error"
        );
      }
    }

    loadEvents();
  }, []);

  if (error) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Mobile Analytics Tracking Hub</h1>

        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      </main>
    );
  }

  if (events.length === 0) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Mobile Analytics Tracking Hub</h1>

        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header style={{ marginBottom: "32px" }}>
        <h1>Mobile Analytics Tracking Hub</h1>

        <p style={{ color: "#666" }}>
          Event tracking specification
        </p>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {showForm ? "Back to Catalog" : "+ Create Event"}
        </button>
      </header>

      {showForm ? (
        <EventForm />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <EventList
            events={events}
            selectedEvent={selectedEvent}
            onSelect={setSelectedEvent}
          />

          {selectedEvent && (
            <EventDetails event={selectedEvent} />
          )}
        </div>
      )}
    </main>
  );
}

export default App;