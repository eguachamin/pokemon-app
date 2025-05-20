import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { PokemonService } from 'src/app/services/pokemon.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './pokemon.page.html',
  styleUrls: ['./pokemon.page.scss'],
})
export class PokemonPage {
  pokemonName = '';
  pokemonData: any;
  pokemonTypes: string = '';
  review = '';
  cardClass = '';
  abilitiesString = '';
  defenseBase: number | null = null;
  errorMessage = '';

  constructor(
    private pokeService: PokemonService,
    private firebaseService: FirebaseService,
    private toastCtrl: ToastController
  ) {}

  async searchPokemon() {
    if (!this.pokemonName.trim()) {
      this.errorMessage = 'Por favor ingresa un nombre o ID de Pokémon';
      this.pokemonData = null;
      return;
    }
    this.errorMessage = '';
    try {
      this.pokemonData = await this.pokeService.getPokemon(this.pokemonName);

      // Obtener tipos
      const types = this.pokemonData.types.map((t: any) => t.type.name);
      this.pokemonTypes = types.join(', ');
      this.cardClass = 'card-' + types[0];

      // NUEVO: Procesar habilidades
      this.abilitiesString = this.pokemonData.abilities
        .map((a: any) => a.ability.name)
        .join(', ');

      // NUEVO: Obtener defensa base
      const defenseStat = this.pokemonData.stats.find(
        (s: any) => s.stat.name === 'defense'
      );
      this.defenseBase = defenseStat ? defenseStat.base_stat : null;

    } catch (err) {
      this.pokemonData = null;
      this.errorMessage = 'Pokémon no encontrado. Intenta otro nombre o ID.';
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
      types: this.pokemonData.types.map((t: any) => t.type.name),
      base_experience: this.pokemonData.base_experience,
      timestamp: new Date()
    };

    await this.firebaseService.savePokemon(payload);
    const toast = await this.toastCtrl.create({
      message: 'Reseña guardada en Firebase',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    this.review = '';
  }
}
