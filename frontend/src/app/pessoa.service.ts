import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from './pessoa.interface';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = 'http://localhost:8000/api/pessoas/';

  constructor(private http: HttpClient) { }

  create(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  search(nome: string): Observable<Pessoa[]> {
    return this.http.get.<Pessoa[]>(`${this.apiUrl}?search=${encodeURIComponent(nome)}`);
  }

  update(id: number, pessoa: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}${id}/`, pessoa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  calculateIdealWeight(id: number): Observable<{ peso_ideal: number }> {
    return this.http.get<{ peso_ideal: number }>(`${this.apiUrl}${id}/peso_ideal/`);
  }
}
