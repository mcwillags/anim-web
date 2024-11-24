export const disableDragGhostImage = () => {
  document.addEventListener(
    "dragstart",
    (event: any) => {
      const img = new Image();
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
      event.dataTransfer.setDragImage(img, 0, 0);
    },
    false,
  );
};