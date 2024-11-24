export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // Generate a random integer between 0 and 15
    const v = c === "x" ? r : (r & 0x3) | 0x8; // For 'y', ensure bits 8, 9, A, or B
    return v.toString(16); // Convert to hexadecimal
  });
};
