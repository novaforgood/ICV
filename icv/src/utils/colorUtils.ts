// CRC32 table generation
const table = (() => {
    let c, table = [];
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c;
    }
    return table;
})();

// CRC32 implementation
function crc32(str: string): number {
    let crc = 0 ^ (-1);
    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xff];
    }
    return (crc ^ (-1)) >>> 0; // Unsigned 32-bit
}

// Normalize checksum to [0, 1]
function stringToNormalizedChecksum(str: string): number {
    const checksum = crc32(str);
    return checksum / 0xFFFFFFFF; // Normalize to [0, 1]
}

// Predefined set of colors
export const USER_COLORS = [
    '#FFC7DC',  // Pink
    '#FFE9A7',  // Orange
    '#DAFEBE',  // Green
    '#C8F8FF',  // Blue
    '#CAC7FF',  // Indigo
    '#8B5CF6',  // Lilac
] as const;

// Get deterministic color based on username
export function getUserColor(userName: string): string {
    const normalizedValue = stringToNormalizedChecksum(userName);
    const colorIndex = Math.floor(normalizedValue * USER_COLORS.length);
    return USER_COLORS[colorIndex];
} 