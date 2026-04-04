/**
 * Calendar dates from `<input type="date">` or stored as `YYYY-MM-DD` must not be
 * passed to `new Date("YYYY-MM-DD")` alone — that parses as UTC midnight, which
 * shows as the previous calendar day in Pacific (California) and other western
 * timezones. Prefer string-based display, or local `new Date(y, m, d)`.
 */
export function parseLocalDateOnly(value: unknown): Date | null {
    if (value == null) return null
    if (
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof (value as { toDate?: () => Date }).toDate === 'function'
    ) {
        return (value as { toDate: () => Date }).toDate()
    }
    const s = String(value).trim()
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
    if (m) {
        const y = Number(m[1])
        const month = Number(m[2]) - 1
        const day = Number(m[3])
        if (
            !Number.isFinite(y) ||
            !Number.isFinite(month) ||
            !Number.isFinite(day)
        ) {
            return null
        }
        return new Date(y, month, day)
    }
    const t = Date.parse(s)
    return Number.isNaN(t) ? null : new Date(t)
}

/**
 * Formats a housing / intake-style calendar date for US display (MM/DD/YYYY).
 * When the value is a plain YYYY-MM-DD (or starts with it), formats from the
 * string only — no `Date` conversion — so it stays correct in California and
 * does not depend on the viewer's time zone for that civil date.
 */
export function formatLocalDateUS(value: unknown): string {
    if (value == null) return 'N/A'
    const s = String(value).trim()
    const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(s)
    if (ymd) {
        const [, year, month, day] = ymd
        return `${month}/${day}/${year}`
    }
    const d = parseLocalDateOnly(value)
    if (!d) return 'N/A'
    return d.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    })
}

export function roundToNearest10Minutes(date: Date): Date {
    const d = new Date(date)
    const minutes = d.getMinutes()
    const rounded = Math.round(minutes / 10) * 10
    if (rounded === 60) {
        d.setHours(d.getHours() + 1)
        d.setMinutes(0, 0, 0)
    } else {
        d.setMinutes(rounded, 0, 0)
    }
    return d
}
