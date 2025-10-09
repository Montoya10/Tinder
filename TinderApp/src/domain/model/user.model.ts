import { Passions } from "./passions.model";

export interface User{
    uid: string;
    name: string;
    birthDate: string;
    country: string;
    city: string;
    gender: string;
    showGenderProfile: boolean;
    passions: Passions[];
    photos: string[];
}