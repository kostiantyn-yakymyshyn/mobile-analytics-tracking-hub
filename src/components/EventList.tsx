import { useState } from "react";
import type { TrackingEvent } from "../types/event";

interface EventListProps {
  events: TrackingEvent[];
  selectedEvent: TrackingEvent | null;
  onSelect: (event: TrackingEvent) => void;
}

function EventList({
  events,
  selectedEvent,
  onSelect,
}: EventListProps) {
  const [search, setSearch] = useState("");
  const [criticality, setCriticality] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.event_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCriticality =
      criticality === "all" ||
      event.criticality === criticality;

    const matchesPlatform =
      platform === "all" ||
      (platform === "ios" && event.platforms.ios) ||
      (platform === "android" && event.platforms.android);

    const matchesStatus =
      status === "all" || event.status === status;

    return (
      matchesSearch &&
      matchesCriticality &&
      matchesPlatform &&
      matchesStatus
    );
  });

  return (
    <aside className="event-list panel">
      <div className="event-list-header">
        <div>
          <h2>Tracking Events</h2>
          <p>
            {filteredEvents.length} of {events.length} events
          </p>
        </div>
      </div>

      <div className="event-filters">
        <input
          className="search-input"
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={criticality}
          onChange={(e) => setCriticality(e.target.value)}
        >
          <option value="all">All criticality</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="all">All platforms</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="legacy">Legacy</option>
          <option value="deprecated">Deprecated</option>
        </select>
      </div>

      <div className="events">
        {filteredEvents.map((event) => {
          const isSelected =
            selectedEvent?.event_name === event.event_name;

          return (
            <button
              className={`event-item ${
                isSelected ? "selected" : ""
              }`}
              key={event.event_name}
              onClick={() => onSelect(event)}
            >
              <strong>{event.event_name}</strong>

              <div className="event-meta">
                <span className={`badge criticality-${event.criticality}`}>
                  {event.criticality}
                </span>

                <span className={`badge status-${event.status}`}>
                  {event.status}
                </span>
              </div>
            </button>
          );
        })}

        {filteredEvents.length === 0 && (
          <p className="empty-state">No events found.</p>
        )}
      </div>
    </aside>
  );
}

export default EventList;