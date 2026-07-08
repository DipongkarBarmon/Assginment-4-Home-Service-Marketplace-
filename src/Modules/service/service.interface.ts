
export interface ICreateService {
    categoryId : string,
    title : string,
    description? : string,
    price : number,
    duration? : number,
    certificates? : string[],
    experienceYears? : number,
}

 

export interface IUpdateService {
    categoryId? : string,
    title? : string,
    description? : string,
    price? : number,
    duration? : number,
    certificates? : string[],
    experienceYears? : number,
}