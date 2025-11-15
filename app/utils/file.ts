export function changeFileExtension(name: string, type: string) {
  if (!name || !type) return "";
  if(!type.startsWith("image")) return name
  const lastDotIndex = name.lastIndexOf(".");
  const filename = name.slice(0, lastDotIndex);
  if (!type.includes("svg")) {
    return filename + ".webp";
  } else {
    return filename + ".svg";
  }
}
