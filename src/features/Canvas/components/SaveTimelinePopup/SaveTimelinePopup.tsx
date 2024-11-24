import * as React from "react";
import {
  Actions,
  CancelButton,
  Description,
  Popup,
  PopupForm,
  SaveButton,
  TimelineName,
  Title,
} from "./SaveTimelinePopup.styles.ts";
import { useOnClickOutside } from "@features/TimeLine/hooks";
import { useTimeline } from "@context/TimelineContext";
import { SaveTimelinePopupFunctions } from "./SaveTimelinePopup.functions.ts";

interface Props {
  onClose: () => void;
}

export const SaveTimelinePopup: React.FC<Props> = ({ onClose }) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [loading, setLoading] = React.useState(false);
  const { createTimeline, timelineDuration } = useTimeline();

  const onTimelineSave = async () => {
    const timeline = createTimeline();
    if (timeline.length === 0) return;

    setLoading(true);

    try {
      await SaveTimelinePopupFunctions.saveTimeline(timeline, timelineDuration);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    } finally {
      setLoading(false);
      onClose();
    }
  };

  useOnClickOutside(formRef, onClose);

  return (
    <Popup>
      <PopupForm ref={formRef}>
        <div>
          <Title>Are you sure you want to save timeline?</Title>

          <Description>
            Current Timeline will be saved under name{" "}
            <TimelineName>test-timeline</TimelineName>
          </Description>
        </div>

        <Actions>
          <SaveButton type="button" onClick={onTimelineSave} disabled={loading}>
            {loading ? "◌" : "Save"}
          </SaveButton>
          <CancelButton type="button" onClick={onClose} disabled={loading}>
            Cancel
          </CancelButton>
        </Actions>
      </PopupForm>
    </Popup>
  );
};
