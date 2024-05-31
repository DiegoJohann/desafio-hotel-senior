import {TestBed} from '@angular/core/testing';

import {HotelService} from './hotel.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {CheckIn, Hospede} from "./in-memory-data.service";
import {provideNgxMask} from "ngx-mask";
import {provideLuxonDateAdapter} from "@angular/material-luxon-adapter";

describe('HospedeService', () => {
    let service: HotelService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [HotelService, provideNgxMask(), provideLuxonDateAdapter()]
        });
        service = TestBed.inject(HotelService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return hospedes', () => {
        const mockHospedes: Hospede[] = [
            {id: 1, nome: 'Fulano', cpf: '12345678900', telefone: '123456789'}
        ];

        service.getHospedes().subscribe(hospedes => {
            expect(hospedes).toEqual(mockHospedes);
        });

        const req = httpMock.expectOne('api/hospedes');
        expect(req.request.method).toBe('GET');
        req.flush(mockHospedes);
    });

    it('should add hospede', () => {
        const newHospede: Hospede = {id: 2, nome: 'Ciclano', cpf: '98765432100', telefone: '987654321'};

        service.addHospede(newHospede).subscribe(hospede => {
            expect(hospede).toEqual(newHospede);
        });

        const req = httpMock.expectOne('api/hospedes');
        expect(req.request.method).toBe('POST');
        req.flush(newHospede);
    });

    it('should return checkIns', () => {
        const mockCheckIns: CheckIn[] = [
            {
                id: 1,
                pessoa: {id: 1, nome: 'Hospede 1', cpf: '12345678901', telefone: '123456789'},
                dataEntrada: new Date(),
                adicionalVeiculo: false
            }
        ];

        service.getCheckIns().subscribe(checkIns => {
            expect(checkIns).toEqual(mockCheckIns);
        });

        const req = httpMock.expectOne('api/checkins');
        expect(req.request.method).toBe('GET');
        req.flush(mockCheckIns);
    });

    it('should add checkIn', () => {
        const newCheckIn: CheckIn = {
            id: 2,
            pessoa: {id: 1, nome: 'Hospede 1', cpf: '12345678901', telefone: '123456789'},
            dataEntrada: new Date(),
            adicionalVeiculo: true
        };

        service.addCheckIn(newCheckIn).subscribe(checkIn => {
            expect(checkIn).toEqual(newCheckIn);
        });

        const req = httpMock.expectOne('api/checkins');
        expect(req.request.method).toBe('POST');
        req.flush(newCheckIn);
    });

    it('should update checkIn', () => {
        const updatedCheckIn: CheckIn = {
            id: 1,
            pessoa: {id: 1, nome: 'Hospede 1', cpf: '12345678901', telefone: '123456789'},
            dataEntrada: new Date(),
            adicionalVeiculo: true
        };

        service.atualizaCheckIn(updatedCheckIn).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = httpMock.expectOne(`api/checkins/${updatedCheckIn.id}`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });
});
