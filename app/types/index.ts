export enum Role{
    ADMIN = "ADMIN",
    BUYER = "BUYER",
    SUPPLIER = "SUPPLIER",
    GUEST = "GUEST",
}

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
    createAt: Date;
    updatedAt: Date;
}