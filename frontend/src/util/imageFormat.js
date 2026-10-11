// A 1×1 AVIF image (273 bytes). If the browser can decode it, it can show AVIF
const AVIF_TEST =
  "data:image/avif;base64,AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAAAAAFwAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAfbWRhdBIACgc4AAYQENBpMgoYAAAAQAX172To";

let support;

// "avif" where the browser can show it, otherwise "webp" (older Safari and iOS).
// Checked once, without a network request; generated images are requested in this format
export const preferredImageFormat = () => {
  if (!support) {
    support = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image.width > 0);
      image.onerror = () => resolve(false);
      image.src = AVIF_TEST;
    }).then((avif) => (avif ? "avif" : "webp"));
  }
  return support;
};
