import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { HospedeComponent } from './hospede.component';
import {MatDialogRef} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {provideNgxMask} from "ngx-mask";
import {provideLuxonDateAdapter} from "@angular/material-luxon-adapter";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

describe('HospedeComponent', () => {
    let component: HospedeComponent;
    let fixture: ComponentFixture<HospedeComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<HospedeComponent>>;

    beforeEach(async () => {
        const dialogMock = {
            close: jasmine.createSpy('close')
        };

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, HospedeComponent, NoopAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogMock },
                provideNgxMask(),
                provideLuxonDateAdapter()
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HospedeComponent);
        component = fixture.componentInstance;
        dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<HospedeComponent>>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form correctly', () => {
        expect(component.hospedeForm).toBeTruthy();
        expect(component.hospedeForm.get('nome')).toBeTruthy();
        expect(component.hospedeForm.get('cpf')).toBeTruthy();
        expect(component.hospedeForm.get('telefone')).toBeTruthy();
    });

    it('should require name', () => {
        const nomeControl = component.hospedeForm.get('nome');
        nomeControl?.setValue('');
        expect(nomeControl?.hasError('required')).toBeTruthy();
    });

    it('should require valid CPF', () => {
        const cpfControl = component.hospedeForm.get('cpf');
        cpfControl?.setValue('03701826005');
        expect(cpfControl?.hasError('cpfInvalid')).toBeFalsy();

        cpfControl?.setValue('123456789');
        expect(cpfControl?.hasError('cpfInvalid')).toBeTruthy();
    });

    it('should require valid phone number', () => {
        const telefoneControl = component.hospedeForm.get('telefone');
        telefoneControl?.setValue('12345678901233');
        expect(telefoneControl?.hasError('maxlength')).toBeTruthy();
    });

    it('should close dialog with correct data on save', fakeAsync(() => {
        const id = null;
        const nome = 'Teste';
        const cpf = '123.456.789-01';
        const telefone = '(11) 12345-6789';

        component.hospedeForm.setValue({ nome, cpf, telefone });
        component.salvar();

        expect(dialogRefSpy.close).toHaveBeenCalledWith({ id, nome, cpf, telefone });
    }));
});
