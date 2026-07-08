
export interface ITechnicianProfile {
    bio? : string,
    address : string,
    skills? : string[],
    averageRating? : number,
    completedJobs? : number,
    isVerified? : boolean 
}

export interface IUpdateTechnicianProfile {
    bio? : string,
    address? : string,
    skills? : string[],
    averageRating? : number,
    completedJobs? : number,
    isVerified? : boolean 
} 
