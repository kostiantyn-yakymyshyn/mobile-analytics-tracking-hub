import { useState } from "react";
import type {
  EventCriticality,
  EventParameter,
  TrackingEvent,
} from "../types/event";
import { eventToYaml } from "../services/yaml";

function EventForm() {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [trigger, setTrigger] = useState("");

  const [criticality, setCriticality] =
    useState<EventCriticality>("medium");

  const [platforms, setPlatforms] = useState({
    ios: true,
    android: true,
  });

  const [parameters, setParameters] = useState<
    EventParameter[]
  >([]);

  const [yamlPreview, setYamlPreview] =
    useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [screenshot, setScreenshot] =
    useState<File | null>(null);

  const [screenshotPreview, setScreenshotPreview] =
    useState<string | null>(null);
  function addParameter() {
    setParameters([
      ...parameters,
      {
        name: "",
        type: "string",
        required: true,
        description: "",
      },
    ]);
  }

  function updateParameter(
    index: number,
    field: keyof EventParameter,
    value: unknown
  ) {
    const updated = [...parameters];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setParameters(updated);
  }

  function removeParameter(index: number) {
    setParameters(
      parameters.filter((_, i) => i !== index)
    );
  }
  function handleScreenshotChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setScreenshot(null);
      setScreenshotPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setScreenshot(null);
      setScreenshotPreview(null);

      setErrors([
        "Screenshot must be an image file.",
      ]);

      return;
    }

    setScreenshot(file);

    const previewUrl = URL.createObjectURL(file);

    setScreenshotPreview(previewUrl);

    setErrors((currentErrors) =>
      currentErrors.filter(
        (error) =>
          error !==
          "Screenshot must be an image file."
      )
    );
  }

  function generateYaml() {
    const validationErrors: string[] = [];

    if (!eventName.trim()) {
      validationErrors.push("Event name is required.");
    }

    if (!description.trim()) {
      validationErrors.push("Description is required.");
    }

    if (!trigger.trim()) {
      validationErrors.push("Trigger is required.");
    }

    if (!platforms.ios && !platforms.android) {
      validationErrors.push(
        "At least one platform must be selected."
      );
    }
    if (!screenshot) {
      validationErrors.push(
        "Screenshot is required."
      );
    }
    parameters.forEach((parameter, index) => {
      if (!parameter.name.trim()) {
        validationErrors.push(
          `Parameter ${index + 1}: name is required.`
        );
      }

      if (
        parameter.type === "enum" &&
        (!parameter.allowed_values ||
          parameter.allowed_values.length === 0)
      ) {
        validationErrors.push(
          `Parameter "${parameter.name || index + 1}": enum values are required.`
        );
      }
    });

    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      setYamlPreview("");
      return;
    }

    const event: TrackingEvent = {
      event_name: eventName.trim(),

      description: description.trim(),

      trigger: trigger.trim(),

      criticality,

      status: "draft",

      documentation_status: "complete",

      platforms,

      parameters,

      screenshot: {
        path: `assets/events/${eventName.trim()}/screenshot.png`,
        alt: `${eventName.trim()} screen`,
      },
    };

    setYamlPreview(eventToYaml(event));
  }

  return (
    <section
      style={{
        maxWidth: "800px",
      }}
    >
      <h1>Create Event</h1>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Event name</strong>
        </label>

        <input
          type="text"
          value={eventName}
          onChange={(e) =>
            setEventName(e.target.value)
          }
          placeholder="card_apply_submit"
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Description</strong>
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Describe what this event means."
          rows={4}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Trigger</strong>
        </label>

        <textarea
          value={trigger}
          onChange={(e) =>
            setTrigger(e.target.value)
          }
          placeholder="When should this event fire?"
          rows={3}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "6px",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Criticality</strong>
        </label>

        <select
          value={criticality}
          onChange={(e) =>
            setCriticality(
              e.target.value as EventCriticality
            )
          }
          style={{
            display: "block",
            padding: "10px",
            marginTop: "6px",
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <strong>Platforms</strong>

        <div style={{ marginTop: "8px" }}>
          <label>
            <input
              type="checkbox"
              checked={platforms.ios}
              onChange={(e) =>
                setPlatforms({
                  ...platforms,
                  ios: e.target.checked,
                })
              }
            />{" "}
            iOS
          </label>
        </div>

        <div style={{ marginTop: "8px" }}>
          <label>
            <input
              type="checkbox"
              checked={platforms.android}
              onChange={(e) =>
                setPlatforms({
                  ...platforms,
                  android: e.target.checked,
                })
              }
            />{" "}
            Android
          </label>
        </div>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Parameters</h2>

          <button onClick={addParameter}>
            + Add parameter
          </button>
        </div>

        {parameters.map((parameter, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              padding: "16px",
              marginBottom: "12px",
              borderRadius: "6px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label>Name</label>

              <input
                type="text"
                value={parameter.name}
                onChange={(e) =>
                  updateParameter(
                    index,
                    "name",
                    e.target.value
                  )
                }
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Type</label>

              <select
                value={parameter.type}
                onChange={(e) =>
                  updateParameter(
                    index,
                    "type",
                    e.target.value
                  )
                }
                style={{
                  display: "block",
                  padding: "8px",
                  marginTop: "4px",
                }}
              >
                <option value="string">string</option>
                <option value="integer">integer</option>
                <option value="float">float</option>
                <option value="boolean">boolean</option>
                <option value="enum">enum</option>
              </select>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Description</label>
              {parameter.type === "enum" && (
                <div style={{ marginBottom: "10px" }}>
                  <label>Allowed values</label>

                  <input
                    type="text"
                    placeholder="success, failure"
                    value={
                      parameter.allowed_values?.join(", ") || ""
                    }
                    onChange={(e) =>
                      updateParameter(
                        index,
                        "allowed_values",
                        e.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter(Boolean)
                      )
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px",
                      marginTop: "4px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}
              <input
                type="text"
                value={
                  parameter.description || ""
                }
                onChange={(e) =>
                  updateParameter(
                    index,
                    "description",
                    e.target.value
                  )
                }
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  marginTop: "4px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <label>
              <input
                type="checkbox"
                checked={parameter.required}
                onChange={(e) =>
                  updateParameter(
                    index,
                    "required",
                    e.target.checked
                  )
                }
              />{" "}
              Required
            </label>

            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                onClick={() =>
                  removeParameter(index)
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: "30px" }}>
        <h2>Screenshot</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleScreenshotChange}
        />

        {screenshot && (
          <div style={{ marginTop: "12px" }}>
            <p>
              <strong>Selected:</strong>{" "}
              {screenshot.name}
            </p>
          </div>
        )}

        {screenshotPreview && (
          <div style={{ marginTop: "12px" }}>
            <img
              src={screenshotPreview}
              alt="Screenshot preview"
              style={{
                maxWidth: "400px",
                maxHeight: "400px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                display: "block",
              }}
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={generateYaml}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        Preview YAML
      </button>
      
      {errors.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #d33",
            borderRadius: "6px",
          }}
        >
          <strong>Please fix the following:</strong>

          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {yamlPreview && (
        <div style={{ marginTop: "30px" }}>
          <h2>Generated YAML</h2>

          <pre
            style={{
              background: "#f5f5f5",
              padding: "20px",
              overflow: "auto",
            }}
          >
            {yamlPreview}
          </pre>
        </div>
      )}
    </section>
  );
}

export default EventForm;