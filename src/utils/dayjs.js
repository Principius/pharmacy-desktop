import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

// Extend plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

// Set default timezone
dayjs.tz.setDefault("Africa/Nairobi")

// Utility to format date to Nairobi time
export function formatToNairobi(date) {
    return dayjs(date).tz().format("YYYY-MM-DD HH:mm:ss")
}

export default dayjs
