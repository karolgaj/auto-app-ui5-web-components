import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TbrEffects } from './tbr/tbr.effects';
import { UserEffects } from './user/user.effects';
import { DictionariesEffects } from './dictionaries/dictionaries.effects';
import { NetworkFormEffects } from './network-form/network-form.effects';
import * as fromTbr from './tbr/tbr.reducer';
import * as fromUser from './user/user.reducer';
import * as fromDictionaries from './dictionaries/dictionaries.reducer';
import * as fromNetworkForm from './network-form/network-form.reducer';

@NgModule({
  declarations: [],
  imports: [
    EffectsModule.forFeature([TbrEffects, UserEffects, DictionariesEffects, NetworkFormEffects]),
    StoreModule.forFeature(fromTbr.tbrFeatureKey, fromTbr.reducer),
    StoreModule.forFeature(fromUser.userFeatureKey, fromUser.reducer),
    StoreModule.forFeature(fromDictionaries.dictionariesFeatureKey, fromDictionaries.reducer),
    StoreModule.forFeature(fromNetworkForm.networkFormFeatureKey, fromNetworkForm.reducer),
  ],
})
export class StateModule {}
