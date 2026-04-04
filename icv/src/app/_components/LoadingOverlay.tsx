'use client'

/** Inner pill + spinner; reuse inside custom overlays if needed */
export function LoadingOverlayPill({
    message = 'Loading...',
}: {
    message?: string
}) {
    return (
        <div className="flex items-center gap-3 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            {message}
        </div>
    )
}

/**
 * Full viewport height, main content column only (right of app sidebar).
 * Matches `(nav)` layout padding: pl-20 / lg:pl-64.
 */
export function NavMainContentLoadingOverlay({
    message = 'Loading...',
}: {
    message?: string
}) {
    return (
        <div className="fixed top-0 right-0 bottom-0 left-20 z-10 flex items-center justify-center bg-background/70 backdrop-blur-[1px] lg:left-64">
            <LoadingOverlayPill message={message} />
        </div>
    )
}

/** Parent must be `position: relative`. Covers that box only (e.g. calendar widget). */
export function ContainedLoadingOverlay({
    message = 'Loading...',
}: {
    message?: string
}) {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <LoadingOverlayPill message={message} />
        </div>
    )
}
