export type ParameterType =
  | "string"
  | "integer"
  | "float"
  | "boolean"
  | "enum";

export type EventCriticality =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EventStatus =
  | "draft"
  | "active"
  | "legacy"
  | "deprecated";

export type DocumentationStatus =
  | "complete"
  | "incomplete"
  | "needs_review";

export interface EventParameter {
  name: string;
  type: ParameterType;
  required: boolean;

  description?: string;

  allowed_values?: string[];
}

export interface TrackingEvent {
  event_name: string;

  description: string;

  trigger: string;

  criticality: EventCriticality;

  status: EventStatus;

  documentation_status: DocumentationStatus;

  platforms: {
    ios: boolean;
    android: boolean;
  };

  parameters: EventParameter[];

  screenshot?: {
    path: string;
    alt: string;
  };
}