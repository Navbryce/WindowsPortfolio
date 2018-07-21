export function generateId (startingString: string): string {
  var id = null;
  while (id == null || document.getElementById(id) != null) {
    id = startingString + Math.floor(Math.random() * 100000);
  }
  return id + "";
}
