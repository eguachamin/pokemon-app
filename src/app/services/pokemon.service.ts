import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private API = 'https://pokeapi.co/api/v2/pokemon/';
  constructor(private http: HttpClient) { }
  getPokemon(name: string) {
    return firstValueFrom(this.http.get<any>(`${this.API}${name.toLowerCase()}`));
  }
}
