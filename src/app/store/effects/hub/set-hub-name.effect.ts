import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, mergeMap, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { HUBS_ACTIONS, HubStorageService } from '@app/store';

export const SET_HUB_NAME_EFFECT = createEffect((
    actions$: Actions = inject(Actions),
    hubStorage: HubStorageService = inject(HubStorageService),
) => {
    return actions$.pipe(
        ofType(HUBS_ACTIONS.requestSetHubName),
        mergeMap((a) => from(hubStorage.get(a.hubId).properties.setHubAdvertisingName(a.name)).pipe(
            switchMap(() => hubStorage.get(a.hubId).properties.getAdvertisingName()),
            map((name) => HUBS_ACTIONS.hubNameSet({ hubId: a.hubId, name }))
        ))
    );
}, { functional: true });
