import "./App.css";
import { useEffect, useState } from "react";
import { load } from "js-yaml";
import type { TrackingEvent } from "./types/event";
import EventList from "./components/EventList";
import EventDetails from "./components/EventDetails";
import EventForm from "./components/EventForm";
import { API_URL } from "./config";

function App() {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [selectedEvent, setSelectedEvent] =
    useState<TrackingEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] =
    useState<TrackingEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const url = `${API_URL}/events`;

        console.log("Loading events from:", url);

        const response = await fetch(url);

        const contentType =
          response.headers.get("content-type");

        console.log(
          "Response:",
          response.status,
          contentType
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load events: ${response.status}`
          );
        }

        if (!contentType?.includes("application/json")) {
          const text = await response.text();

          throw new Error(
            `API returned non-JSON response: ${text.slice(
              0,
              100
            )}`
          );
        }

        const files = (await response.json()) as {
          path: string;
          content: string;
        }[];

        const loadedEvents = files.map(
          (file) => load(file.content) as TrackingEvent
        );

        setEvents(loadedEvents);

        if (loadedEvents.length > 0) {
          setSelectedEvent(loadedEvents[0]);
        }
      } catch (err) {
        console.error("Failed to load events:", err);

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
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <div className="brand-icon">A</div>

            <div>
              <h1 className="brand-title">
                Mobile Analytics Tracking Hub
              </h1>

              <p className="brand-subtitle">
                Event tracking specification
              </p>
            </div>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setEditingEvent(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? "← Back to Catalog" : "+ Create Event"}
          </button>
        </div>
      </header>

      {showForm ? (
        <main className="page">
          <EventForm
            initialEvent={editingEvent ?? undefined}
            onCancel={() => {
              setEditingEvent(null);
              setShowForm(false);
            }}
          />
        </main>
      ) : (
        <main className="page">
          <div className="catalog-layout">
            <EventList
              events={events}
              selectedEvent={selectedEvent}
              onSelect={setSelectedEvent}
            />

            {selectedEvent && (
              <EventDetails
                event={selectedEvent}
                onEdit={(event) => {
                  setEditingEvent(event);
                  setShowForm(true);
                }}
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;