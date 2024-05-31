import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatDivider} from "@angular/material/divider";
import {NgxMaskDirective} from "ngx-mask";
import {MatButton} from "@angular/material/button";

export function cpfValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const cpf = control.value;
        if (!cpf) return null;

        const cleanedCpf = cpf.replace(/\D/g, '');

        if (cleanedCpf.length !== 11) return {cpfInvalid: true};

        const invalidCpfs = [
            '00000000000', '11111111111', '22222222222', '33333333333',
            '44444444444', '55555555555', '66666666666', '77777777777',
            '88888888888', '99999999999'
        ];
        if (invalidCpfs.includes(cleanedCpf)) return {cpfInvalid: true};

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleanedCpf.charAt(i)) * (10 - i);
        }
        let firstCheckDigit = 11 - (sum % 11);
        if (firstCheckDigit === 10 || firstCheckDigit === 11) firstCheckDigit = 0;
        if (firstCheckDigit !== parseInt(cleanedCpf.charAt(9))) return {cpfInvalid: true};

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleanedCpf.charAt(i)) * (11 - i);
        }
        let secondCheckDigit = 11 - (sum % 11);
        if (secondCheckDigit === 10 || secondCheckDigit === 11) secondCheckDigit = 0;
        if (secondCheckDigit !== parseInt(cleanedCpf.charAt(10))) return {cpfInvalid: true};

        return null;
    };
}

@Component({
    selector: 'app-hospede',
    standalone: true,
    imports: [
        MatDialogContent,
        ReactiveFormsModule,
        MatInputModule,
        MatInput,
        MatFormField,
        MatDivider,
        NgxMaskDirective,
        MatDialogActions,
        MatButton,
        MatDialogClose
    ],
    templateUrl: './hospede.component.html',
    styleUrl: './hospede.component.scss'
})
export class HospedeComponent {

    hospedeForm: FormGroup;

    constructor(private _formBuilder: FormBuilder,
                private _dialogRef: MatDialogRef<HospedeComponent>) {
        this.hospedeForm = this._formBuilder.group({
            nome: ['', [Validators.required, Validators.maxLength(50)]],
            cpf: ['', [Validators.required, cpfValidator()]],
            telefone: ['', [Validators.required, Validators.maxLength(13)]]
        });
    }

    mascaraTelefone() {
        const phoneNumber = this.f['telefone'].value;
        if (phoneNumber.length === 11 && phoneNumber.startsWith('0')) {
            return '(000) 0000-0000';
        } else if (phoneNumber.length === 11) {
            return '(00) 00000-0000';
        } else if (phoneNumber.length === 12) {
            return '(000) 00000-0000';
        } else {
            return '(00) 0000-00009';
        }
    }

    private extractNumber(str: string): string {
        if (str === null || str === undefined || str.trim() === '') {
            return '';
        }
        return str.replace(/\D+/g, '');
    }

    salvar(): void {
        this._dialogRef.close({
            id: null,
            nome: this.f['nome'].value,
            cpf: this.f['cpf'].value,
            telefone: this.f['telefone'].value
        });
    }

    get f() {
        return this.hospedeForm.controls;
    }

}
