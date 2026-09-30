/** "01", "02"… from a zero-based position. Index labels are never content: a
    reordered list must never be able to mis-number itself. */
export const indexLabel = (i: number) => String(i + 1).padStart(2, "0");
