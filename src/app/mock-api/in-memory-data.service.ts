import {Injectable} from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';

export interface Hospede {
    id: number;
    nome: string;
    cpf: string;
    telefone: string;
}

export interface CheckIn {
    id?: number;
    pessoa: Hospede;
    dataEntrada: Date;
    dataSaida?: Date;
    adicionalVeiculo: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const hospedes: Hospede[] = [];
        const checkins: CheckIn[] = [];
        return {hospedes, checkins};
    }

    genId<T extends { id?: number }>(collection: T[]): number {
        return collection.length > 0 ? Math.max(...collection.map(item => item.id || 0)) + 1 : 1;
    }
}
