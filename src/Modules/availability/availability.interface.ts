import { Availability } from "../../../generated/prisma/browser.js"
import { AvailabilityWhereInput } from "../../../generated/prisma/models.js"

export interface IAvailability {
    date : Date, // e.g. 2026-07-15
    startTime : Date, // e.g. 2026-07-15 09:00
    endTime   : Date, // e.g. 2026-07-15 12:00
    isBooked? : boolean 
  
}

export interface IAvailabilityQuery extends AvailabilityWhereInput {
    searchTerm? : string,
    page ? : string,
    limit? : string,
    sortOrder? : string,
    sortBy? : string
}
