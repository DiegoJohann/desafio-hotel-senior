import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatSuffix} from "@angular/material/form-field";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {HotelService} from "../../mock-api/hotel.service";
import {CheckIn, Hospede} from "../../mock-api/in-memory-data.service";
import {MatDialog} from "@angular/material/dialog";
import {HospedeComponent} from "./hospede/hospede.component";
import {MatOption, MatSelect} from "@angular/material/select";
import {CpfPipe} from "../../utils/cpf.pipe";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from "@angular/material/table";
import {CurrencyPipe, NgClass} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";

export interface CheckInExibicao {
    id: number;
    pessoa: Hospede;
    dataEntrada: Date;
    dataSaida?: Date;
    adicionalVeiculo: boolean;
    valorDevido: number;
    valorGasto: number;
}

@Component({
    selector: 'app-checkin',
    standalone: true,
    imports: [
        MatButton,
        MatFormField,
        MatCheckbox,
        ReactiveFormsModule,
        MatInput,
        MatInputModule,
        MatDatepickerInput,
        MatDatepicker,
        MatDatepickerToggle,
        MatSuffix,
        MatSelect,
        MatOption,
        CpfPipe,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderCellDef,
        MatCell,
        MatCellDef,
        MatHeaderRow,
        MatHeaderRowDef,
        MatRow,
        MatRowDef,
        CurrencyPipe,
        MatTooltip,
        MatIcon,
        NgClass
    ],
    templateUrl: './checkin.component.html',
    styleUrl: './checkin.component.scss'
})
export class CheckinComponent implements OnInit {

    checkinForm: FormGroup;
    filtroForm: FormGroup;

    possuiVeiculo: boolean = false;

    hospedes: Hospede[] = [];
    checkIns: CheckIn[] = [];
    checkInsDataSource = new MatTableDataSource<CheckInExibicao>();
    colunas: string[] = ['nome', 'documento', 'valordevido', 'valorgasto', 'opcoes'];

    checkInSelecionado: CheckIn | undefined;
    textoTitulo: string = 'Novo Check-in';

    constructor(private _hotelService: HotelService,
                private _hospedeDialog: MatDialog,
                private _formBuilder: FormBuilder,
                private _cdr: ChangeDetectorRef) {
        this.checkinForm = this._formBuilder.group({
            dataEntrada: ['', Validators.required],
            horaEntrada: ['', Validators.required],
            dataSaida: [''],
            horaSaida: [''],
            pessoa: ['', Validators.required]
        });
        this.filtroForm = this._formBuilder.group({
            filtro: ['']
        });
    }

    ngOnInit(): void {
        this.getCheckIns();
        this.getHospedes();
        this.filtroForm.get('filtro')?.valueChanges.subscribe(() => this.aplicarFiltro());

        this._hotelService.addHospede({
            id: 1,
            nome: 'Diego Roberto Johann',
            cpf: '03701826005',
            telefone: '51994805100'
        })
            .subscribe(hospede => this.hospedes.push(hospede));
    }

    getHospedes(): void {
        this._hotelService.getHospedes().subscribe(hospedes => this.hospedes = hospedes);
    }

    getCheckIns(): void {
        this._hotelService.getCheckIns().subscribe({
            next: (checkIns) => {
                this.checkIns = checkIns;
                this.checkInsDataSource.data = this.processaCheckInsExibicao(this.checkIns);
            }
        });
    }

    novoCheckIn(): void {
        if (this.checkInSelecionado) {
            if (this.checkInSelecionado.pessoa.id != this.f['pessoa'].value.id) {
                this.checkInSelecionado = undefined;
                this.textoTitulo = 'Novo Check-in';
            }
        }

        let dataEntrada = new Date(this.f['dataEntrada'].value);
        let horaEntrada = this.f['horaEntrada'].value.split(':');
        dataEntrada.setHours(horaEntrada[0], horaEntrada[1]);

        if (this.checkInSelecionado !== undefined) {
            if (this.f['horaSaida'].value !== '') {
                let dataSaida = new Date(this.f['dataSaida'].value);
                let horaSaida = this.f['horaSaida'].value.split(':');
                dataSaida.setHours(horaSaida[0], horaSaida[1]);

                const diferenca = dataSaida.getTime() - dataEntrada.getTime();
                const difDias = Math.ceil(diferenca / (1000 * 3600 * 24));
                if (difDias < 1) {
                    alert('A data de saída deve ser pelo menos um dia maior do que a data de entrada!');
                    return;
                }

                const checkInAtualizado = this.checkInSelecionado;
                checkInAtualizado.dataSaida = dataSaida;

                this._hotelService.atualizaCheckIn(checkInAtualizado).subscribe({
                    next: () => {
                        this.checkInsDataSource.data = this.processaCheckInsExibicao(this.checkIns);
                        this.checkInSelecionado = undefined;
                        this.textoTitulo = 'Novo Check-in';
                    }
                });
            } else {
                alert('Para realizar um check-out você deve informar a hora de saída!');
                return;
            }
        } else {
            const checkInPendente = this.checkIns.find(
                checkIn => checkIn.pessoa.id === this.f['pessoa'].value.id && !checkIn.dataSaida
            );

            if (checkInPendente) {
                alert(`O hóspede ${this.f['pessoa'].value.nome} possui check-in pendente.`);
                return;
            }

            const checkIn = {
                pessoa: this.f['pessoa'].value,
                dataEntrada: dataEntrada,
                adicionalVeiculo: this.possuiVeiculo
            };
            this._hotelService.addCheckIn(checkIn).subscribe({
                next: (checkIn) => {
                    this.checkIns.push(checkIn);
                    this.checkInsDataSource.data = this.processaCheckInsExibicao(this.checkIns);
                }
            });
        }
    }

    incluirPessoa(): void {
        const dialogRef = this._hospedeDialog.open(HospedeComponent, {
            maxWidth: '1000px',
            width: '1000px',
            autoFocus: false,
            disableClose: true
        });

        dialogRef.afterClosed().subscribe({
            next: (result) => {
                if (typeof result !== 'string') {
                    this._hotelService.addHospede(result)
                        .subscribe({
                            next: (hospede) => {
                                this.hospedes.push(hospede);
                                this._cdr.detectChanges();
                            }
                        });
                }
            }
        });
    }

    aplicarFiltro(): void {
        const valorFiltro = this.filtroForm.get('filtro')?.value;
        if (valorFiltro === 'comDataSaida') {
            this.checkInsDataSource.data = this.processaCheckInsExibicao(this.checkIns.filter(checkIn => checkIn.dataSaida != null));
        } else if (valorFiltro === 'semDataSaida') {
            this.checkInsDataSource.data = this.processaCheckInsExibicao(this.checkIns.filter(checkIn => checkIn.dataSaida == null));
        } else {
            this.checkInsDataSource.data = this.processaCheckInsExibicao(this.checkIns);
        }
    }

    trocaPossuiVeiculo(): void {
        this.possuiVeiculo = !this.possuiVeiculo;
    }

    processaCheckInsExibicao(checkIns: CheckIn[]): CheckInExibicao[] {
        const checkInMap = new Map<number, CheckInExibicao>();

        checkIns.forEach(checkIn => {
            const id = checkIn.pessoa.id;
            const fimDeSemana = (date: Date) => [0, 6].includes(date.getDay());

            const calculaValor = (entrada: Date, saida: Date, adicionalVeiculo: boolean) => {
                const msInDay = 24 * 60 * 60 * 1000;
                let dias = Math.floor((saida.getTime() - entrada.getTime()) / msInDay) + 1;
                if (dias === 0) {
                    dias = 1;
                }
                let valor = 0;
                for (let i = 0; i < dias; i++) {
                    const data = new Date(entrada.getTime() + i * msInDay);
                    if (fimDeSemana(data)) {
                        valor += 150 + (adicionalVeiculo ? 20 : 0);
                    } else {
                        valor += 120 + (adicionalVeiculo ? 15 : 0);
                    }
                }
                if (saida.getHours() >= 16 && saida.getMinutes() >= 30) {
                    valor += fimDeSemana(saida) ? 150 : 120;
                    valor += adicionalVeiculo ? (fimDeSemana(saida) ? 20 : 15) : 0;
                }
                return valor;
            };

            const valorDevido = !checkIn.dataSaida ? calculaValor(new Date(checkIn.dataEntrada), new Date(), checkIn.adicionalVeiculo) : 0;
            const valorGasto = checkIn.dataSaida ? calculaValor(new Date(checkIn.dataEntrada), new Date(checkIn.dataSaida), checkIn.adicionalVeiculo) : 0;

            if (!checkInMap.has(id)) {
                checkInMap.set(id, {
                    id: checkIn.id!,
                    pessoa: checkIn.pessoa,
                    dataEntrada: checkIn.dataEntrada,
                    dataSaida: checkIn.dataSaida,
                    adicionalVeiculo: checkIn.adicionalVeiculo,
                    valorDevido,
                    valorGasto
                });
            } else {
                const itemExistente = checkInMap.get(id)!;
                itemExistente.valorDevido += valorDevido;
                itemExistente.valorGasto += valorGasto;
            }
        });

        return Array.from(checkInMap.values());
    }

    selecionaCheckIn(checkInExibicao: CheckInExibicao) {
        const checkInPendente = this.checkIns.find(
            checkIn => checkIn.pessoa.id === checkInExibicao.pessoa.id && !checkIn.dataSaida
        );

        if (checkInPendente) {
            this.checkInSelecionado = checkInPendente;

            this.f['dataEntrada'].setValue(checkInPendente.dataEntrada);
            this.f['pessoa'].setValue(this.hospedes.find(pessoa => pessoa.id == checkInPendente.pessoa.id));
            this.f['dataSaida'].setValue(new Date());
            this.possuiVeiculo = checkInPendente.adicionalVeiculo;

            this.textoTitulo = 'Fazer checkout';
        }
    }

    resetaFormulario() {
        this.checkinForm.reset();
        this.checkInSelecionado = undefined;
    }

    get f() {
        return this.checkinForm.controls;
    }
}
