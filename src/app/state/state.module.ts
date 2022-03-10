import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer, tbrFeatureKey } from './tbr.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TbrEffects } from './tbr.effects';

@NgModule({
  declarations: [],
  imports: [EffectsModule.forFeature([TbrEffects]), StoreModule.forFeature(tbrFeatureKey, reducer)],
})
export class StateModule {}
