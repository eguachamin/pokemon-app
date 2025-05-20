// src/app/pages/pokemon/pokemon.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule ],
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
})
export class PokemonPage {
  pokemonName = '';
  pokemonData: any;
  pokemonTypes: string = '';
  review = '';
  cardClass = '';
  

  constructor(
    private pokeService: PokemonService,
    private firebaseService: FirebaseService
  ) {}

  async searchPokemon() {
    try {
    this.pokemonData = await this.pokeService.getPokemon(this.pokemonName);
    // Obtener tipos
    const types = this.pokemonData.types.map((t: any) => t.type.name);
    this.pokemonTypes = types.join(', ');

    // Tomar primer tipo para la clase de color
    this.cardClass = 'card-' + types[0];
    } catch (err) {
      console.error('No encontrado', err);
    }
  }
  isLightType(type: string): boolean {
  return ['electric', 'fairy', 'normal', 'ground', 'ice'].includes(type);
  }
  async saveReview() {
    if (!this.pokemonData) return;

  const payload = {
    name: this.pokemonData.name,
    imageUrl: this.pokemonData.sprites.front_default,
    review: this.review,
    height: this.pokemonData.height,
    weight: this.pokemonData.weight,
    types: this.pokemonData.types.map((t:any) => t.type.name),
    base_experience: this.pokemonData.base_experience,
    timestamp: new Date()
  };

  await this.firebaseService.savePokemon(payload);
  alert('Reseña guardada en Firebase');
  this.review = '';
  }
}
