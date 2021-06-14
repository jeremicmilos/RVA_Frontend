import { Obrazovanje } from "./obrazovanje";
import { Sektor } from "./sektor";

export class Radnik {
    id: number;
    ime: string;
    prezime: string;
    brojLk: number;
    obrazovanje: Obrazovanje;
    sektor: Sektor;
}