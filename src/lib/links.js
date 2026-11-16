/* Public links used by the marketing CTAs.
   Trials download straight from the Python product repo's latest release. */

export const GITHUB_REPO = "https://github.com/1wu-davy-2/PyShield";
export const GITHUB_RELEASES = `${GITHUB_REPO}/releases`;
export const GITHUB_LATEST = `${GITHUB_REPO}/releases/latest`;

const asset = (name) => `${GITHUB_LATEST}/download/${name}`;

/** Direct asset link: always resolves to the newest published release. */
export const TRIAL_DOWNLOAD = asset("PyShieldBuilder.exe");
export const SHA256SUMS = asset("SHA256SUMS.txt");

/** Platform cards shown on #/download. macOS is advertised as coming soon. */
export const PLATFORM_DOWNLOADS = [
  { id: "windows", file: "PyShieldBuilder.exe", size: "20.6 MB", url: asset("PyShieldBuilder.exe") },
  { id: "linux", file: "PyShieldBuilder", size: "47.1 MB", url: asset("PyShieldBuilder") }
];
