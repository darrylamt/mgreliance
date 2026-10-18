/** Open Graph image entry for one of the /og/* card endpoints. */
export function ogImages(path: string, alt = "MG Reliance Property Developers") {
  return [{ url: path, width: 1200, height: 630, alt }];
}

export function pageOg(key: string, alt?: string) {
  return ogImages(`/og/page?key=${key}`, alt);
}
