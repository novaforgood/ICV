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

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Generate a pastel color from a number between 0 and 1
function generatePastelColor(value: number): string {
    // Use the value to determine hue (0-360 degrees)
    const hue = value * 360;

    // Fixed values for pastel colors
    const saturation = 0.4; // 40% saturation for pastel look
    const lightness = 0.85; // 85% lightness for pastel look

    const [r, g, b] = hslToRgb(hue / 360, saturation, lightness);
    return rgbToHex(r, g, b);
}

// Get deterministic color based on username
export function getUserColor(userName: string): string {
    const normalizedValue = stringToNormalizedChecksum(userName);
    return generatePastelColor(normalizedValue);
} 