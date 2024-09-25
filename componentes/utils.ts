// components/utils.ts

export const parseElogios = (elogios) => {
    if (!elogios) return []; // Return an empty array if elogios is falsy
    try {
      const parsed = JSON.parse(elogios);
      // Check if parsed is an object and convert it to an array
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return [parsed]; // Wrap single object in an array
      } else if (Array.isArray(parsed)) {
        return parsed; // Return the parsed array if it's valid
      } else {
        console.warn("Parsed elogios is not an array or object:", parsed);
        return []; // Return an empty array if the parsed value is not an object or array
      }
    } catch (e) {
      console.error("Error parsing elogios:", e);
      return []; // Return an empty array in case of an error
    }
  };
  