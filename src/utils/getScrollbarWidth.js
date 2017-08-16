let scrollbarWidth = false;

export function invalidateScrollbarWidth() {
    scrollbarWidth = false;
}

function getScrollbarWidth(values) {
    if (scrollbarWidth !== false) return scrollbarWidth;
    /* istanbul ignore else */
    if (values && typeof document !== 'undefined') {
        scrollbarWidth = values.offsetWidth - values.realClientWidth;
    } else {
        scrollbarWidth = 0;
    }
    return scrollbarWidth || 0;
}

export default getScrollbarWidth;
export { getScrollbarWidth };
