import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TbrEffects } from './tbr/tbr.effects';
import { UserEffects } from './user/user.effects';
import * as fromTbr from './tbr/tbr.reducer';
import * as fromUser from './user/user.reducer';

@NgModule({
  declarations: [],
  imports: [
    EffectsModule.forFeature([TbrEffects, UserEffects]),
    StoreModule.forFeature(fromTbr.tbrFeatureKey, fromTbr.reducer),
    StoreModule.forFeature(fromUser.userFeatureKey, fromUser.reducer),
  ],
})
export class StateModule {}
