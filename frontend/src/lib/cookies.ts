export function setCookie(name: string, value: string, days?: number): void {
  let expires = "";
  if (typeof days === "number") {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const parts = document.cookie.split(";");
  for (let part of parts) {
    part = part.trim();
    if (part.indexOf(nameEQ) === 0) {
      return decodeURIComponent(part.substring(nameEQ.length));
    }
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}