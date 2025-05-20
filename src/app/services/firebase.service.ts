import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { docData } from '@angular/fire/firestore';
import { CollectionReference, DocumentData } from '@firebase/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  async savePokemon(pokemonData: any) {
    const collectionRef = collection(this.firestore, 'Taller_EGuachamin_JRamirez_AAshqui');
    return await addDoc(collectionRef, pokemonData);
  }
}