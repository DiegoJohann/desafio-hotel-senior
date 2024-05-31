import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

import {CheckinComponent} from './checkin.component';
import {MatDialog} from "@angular/material/dialog";
import {HotelService} from "../../mock-api/hotel.service";
import {ReactiveFormsModule} from "@angular/forms";
import {of} from "rxjs";
import {provideNgxMask} from "ngx-mask";
import {provideLuxonDateAdapter} from "@angular/material-luxon-adapter";

describe('CheckinComponent', () => {
    let component: CheckinComponent;
    let fixture: ComponentFixture<CheckinComponent>;
    let hotelServiceSpy: jasmine.SpyObj<HotelService>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        const hotelServiceMock = jasmine.createSpyObj('HotelService', ['getHospedes', 'getCheckIns', 'addCheckIn']);
        const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, CheckinComponent],
            providers: [
                {provide: HotelService, useValue: hotelServiceMock},
                {provide: MatDialog, useValue: dialogMock},
                provideNgxMask(),
                provideLuxonDateAdapter()
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CheckinComponent);
        component = fixture.componentInstance;
        hotelServiceSpy = TestBed.inject(HotelService) as jasmine.SpyObj<HotelService>;
        dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
        fixture.detectChanges();
    });

    it('should create form correctly', () => {
        expect(component.checkinForm).toBeDefined();
        expect(component.f['dataEntrada']).toBeDefined();
        expect(component.f['horaEntrada']).toBeDefined();
        expect(component.f['dataSaida']).toBeDefined();
        expect(component.f['horaSaida']).toBeDefined();
        expect(component.f['pessoa']).toBeDefined();
    });

    it('should require dataEntrada, horaEntrada and pessoa', () => {
        fixture.detectChanges();
        const form = component.checkinForm;

        form.setValue({
            dataEntrada: null,
            horaEntrada: '',
            dataSaida: '',
            horaSaida: '',
            pessoa: ''
        });

        expect(form.valid).toBeFalsy();
        expect(form.get('dataEntrada')?.hasError('required')).toBeTruthy();
        expect(form.get('horaEntrada')?.hasError('required')).toBeTruthy();
        expect(form.get('pessoa')?.hasError('required')).toBeTruthy();
    });

    it('should add check-in correctly', fakeAsync(() => {
        const checkIn = {
            id: 3,
            pessoa: {id: 1, nome: 'Hospede 1', cpf: '12345678901', telefone: '123456789'},
            dataEntrada: new Date(),
            adicionalVeiculo: false
        };
        const addCheckInSpy = hotelServiceSpy.addCheckIn.and.returnValue(of(checkIn));

        component.checkinForm.setValue({
            dataEntrada: new Date(),
            horaEntrada: '10:00',
            dataSaida: '',
            horaSaida: '',
            pessoa: {id: 1}
        });

        component.novoCheckIn();
        tick();

        expect(addCheckInSpy).toHaveBeenCalled();
        expect(component.checkIns).toContain(checkIn);
    }));
});
