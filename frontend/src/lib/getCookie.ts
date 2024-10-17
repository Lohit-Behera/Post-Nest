export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length > 1) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}
