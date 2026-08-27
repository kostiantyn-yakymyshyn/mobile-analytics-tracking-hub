import { dump } from "js-yaml";
import type { TrackingEvent } from "../types/event";

export function eventToYaml(event: TrackingEvent): string {
  return dump(event, {
    noRefs: true,
    lineWidth: -1,
  });
}
