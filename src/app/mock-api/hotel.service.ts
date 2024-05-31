import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CheckIn, Hospede} from './in-memory-data.service';

@Injectable({
    providedIn: 'root'
})
export class HotelService {
    private hospedesUrl = 'api/hospedes';
    private checkinsUrl = 'api/checkins';
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) { }

    getHospedes(): Observable<Hospede[]> {
        return this.http.get<Hospede[]>(this.hospedesUrl)
            .pipe(catchError(this.handleError<Hospede[]>('getHospedes', [])));
    }

    addHospede(hospede: Hospede): Observable<Hospede> {
        return this.http.post<Hospede>(this.hospedesUrl, hospede, this.httpOptions)
            .pipe(catchError(this.handleError<Hospede>('addHospede')));
    }

    getCheckIns(): Observable<CheckIn[]> {
        return this.http.get<CheckIn[]>(this.checkinsUrl)
            .pipe(catchError(this.handleError<CheckIn[]>('getCheckIns', [])));
    }

    addCheckIn(checkIn: CheckIn): Observable<CheckIn> {
        return this.http.post<CheckIn>(this.checkinsUrl, checkIn, this.httpOptions)
            .pipe(catchError(this.handleError<CheckIn>('addCheckIn')));
    }

    atualizaCheckIn(checkIn: CheckIn): Observable<any> {
        const url = `${this.checkinsUrl}/${checkIn.id}`;
        return this.http.put(url, checkIn);
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }
}
