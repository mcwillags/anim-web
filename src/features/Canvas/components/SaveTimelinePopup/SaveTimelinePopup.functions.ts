import { SimplifiedTimeline } from "@context/TimelineContext";
import axios from "@utils/axios.ts";
import { wait } from "@utils";

export namespace SaveTimelinePopupFunctions {
  export const saveTimeline = async (
    timeline: SimplifiedTimeline,
    duration: number,
  ) => {
    await axios.post("/add-json-timeline", {
      timeline,
      duration,
      name: "test-timeline",
    });

    return wait(500);
  };
}
