import type { TrackingEvent } from "../types/event";

interface EventDetailsProps {
  event: TrackingEvent;
}

function EventDetails({ event }: EventDetailsProps) {
  return (
    <section
      style={{
        flex: 1,
        paddingLeft: "24px",
      }}
    >
      <h1>{event.event_name}</h1>

      <div style={{ marginBottom: "24px" }}>
        <p>
          <strong>Description:</strong>
        </p>

        <p>{event.description}</p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <p>
          <strong>Trigger:</strong>
        </p>

        <p>{event.trigger}</p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <p>
          <strong>Criticality:</strong>{" "}
          {event.criticality}
        </p>

        <p>
          <strong>Status:</strong> {event.status}
        </p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h2>Platforms</h2>

        <p>
          iOS: {event.platforms.ios ? "✅" : "❌"}
        </p>

        <p>
          Android:{" "}
          {event.platforms.android ? "✅" : "❌"}
        </p>
      </div>

      <div>
        <h2>Parameters</h2>

        {event.parameters.length === 0 ? (
          <p>No parameters.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Name
                </th>

                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Type
                </th>

                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Required
                </th>

                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {event.parameters.map((parameter) => (
                <tr key={parameter.name}>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <code>{parameter.name}</code>
                  </td>

                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {parameter.type}
                  </td>

                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {parameter.required ? "Yes" : "No"}
                  </td>

                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {parameter.description || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {event.screenshot && (
        <div style={{ marginTop: "32px" }}>
          <h2>Screenshot</h2>

          <img
            src={`/${event.screenshot.path}`}
            alt={event.screenshot.alt}
            style={{
              maxWidth: "400px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
        </div>
      )}
    </section>
  );
}

export default EventDetails;