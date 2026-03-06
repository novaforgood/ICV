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
