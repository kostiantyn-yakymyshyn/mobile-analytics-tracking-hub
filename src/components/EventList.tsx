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
    <aside
      style={{
        width: "320px",
        borderRight: "1px solid #ddd",
        paddingRight: "24px",
      }}
    >
      <h2>Tracking Events</h2>

      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px",
          marginBottom: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <select
        value={criticality}
        onChange={(e) => setCriticality(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "8px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
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
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "8px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        <option value="all">All platforms</option>
        <option value="ios">iOS</option>
        <option value="android">Android</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "16px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="legacy">Legacy</option>
        <option value="deprecated">Deprecated</option>
      </select>

      <div
        style={{
          marginBottom: "16px",
          fontSize: "13px",
          color: "#666",
        }}
      >
        Showing {filteredEvents.length} of {events.length} events
      </div>

      {filteredEvents.map((event) => {
        const isSelected =
          selectedEvent?.event_name === event.event_name;

        return (
          <button
            key={event.event_name}
            onClick={() => onSelect(event)}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginBottom: "8px",
              textAlign: "left",
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "6px",
              background: isSelected
                ? "#f0f0f0"
                : "white",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            >
              {event.event_name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#666",
              }}
            >
              {event.criticality} · {event.status} ·{" "}
              {event.documentation_status === "complete"
                ? "✅ documented"
                : event.documentation_status === "needs_review"
                  ? "🔍 needs review"
                  : "⚠️ incomplete"}
            </div>
          </button>
        );
      })}

      {filteredEvents.length === 0 && (
        <p
          style={{
            color: "#666",
            fontSize: "14px",
          }}
        >
          No events found.
        </p>
      )}
    </aside>
  );
}

export default EventList;