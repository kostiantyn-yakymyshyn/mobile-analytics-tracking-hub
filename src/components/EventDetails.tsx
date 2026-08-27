import type { TrackingEvent } from "../types/event";

interface EventDetailsProps {
  event: TrackingEvent;
  onEdit: (event: TrackingEvent) => void;
}

function EventDetails({ event, onEdit }: EventDetailsProps) {
  return (
    <section className="event-details panel">
      <div className="details-header">
        <div>
          <div className="details-eyebrow">TRACKING EVENT</div>

          <h1>{event.event_name}</h1>

          <div className="details-badges">
            <span className={`badge criticality-${event.criticality}`}>
              {event.criticality}
            </span>

            <span className={`badge status-${event.status}`}>
              {event.status}
            </span>
          </div>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={() => onEdit(event)}
        >
          Edit
        </button>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <span className="detail-label">DESCRIPTION</span>
          <p>{event.description}</p>
        </div>

        <div className="detail-card">
          <span className="detail-label">TRIGGER</span>
          <p>{event.trigger}</p>
        </div>
      </div>

      <div className="detail-section">
        <h2>Platforms</h2>

        <div className="platform-list">
          <span className={`platform ${event.platforms.ios ? "enabled" : ""}`}>
            {event.platforms.ios ? "✓" : "×"} iOS
          </span>

          <span
            className={`platform ${
              event.platforms.android ? "enabled" : ""
            }`}
          >
            {event.platforms.android ? "✓" : "×"} Android
          </span>
        </div>
      </div>

      <div className="detail-section">
        <div className="section-heading">
          <h2>Parameters</h2>
          <span>{event.parameters.length}</span>
        </div>

        {event.parameters.length === 0 ? (
          <div className="empty-box">No parameters.</div>
        ) : (
          <div className="table-wrapper">
            <table className="parameters-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>

              <tbody>
                {event.parameters.map((parameter) => (
                  <tr key={parameter.name}>
                    <td>
                      <code>{parameter.name}</code>
                    </td>
                    <td>{parameter.type}</td>
                    <td>
                      {parameter.required ? (
                        <span className="required">Required</span>
                      ) : (
                        "Optional"
                      )}
                    </td>
                    <td>{parameter.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {event.screenshot && (
        <div className="detail-section">
          <h2>Screenshot</h2>

          <div className="screenshot-card">
            <img
              src={`https://raw.githubusercontent.com/kostiantyn-yakymyshyn/mobile-analytics-tracking-hub/main/${event.screenshot.path}`}
              alt={event.screenshot.alt}
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default EventDetails;