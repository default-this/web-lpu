import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JsonPipe, NgIf } from '@angular/common';
import { PushPipe } from '@ngrx/component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HintComponent } from '@app/shared';
import { CONTROL_SCHEME_ACTIONS, DEFAULT_ACC_DEC_PROFILE_TIME_MS } from '@app/store';

import { PORT_CONFIG_EDIT_PAGE_SELECTORS } from './port-config-edit-page.selectors';
import { RoutesBuilderService } from '../../routing';

@Component({
    standalone: true,
    selector: 'app-port-config-edit-page',
    templateUrl: './port-config-edit-page.component.html',
    styleUrls: [ './port-config-edit-page.component.scss' ],
    imports: [
        NgIf,
        PushPipe,
        JsonPipe,
        HintComponent,
        MatCardModule,
        MatInputModule,
        TranslocoModule,
        ReactiveFormsModule,
        MatButtonModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortConfigEditPageComponent implements OnInit, OnDestroy {
    public readonly portConfig$ = this.store.select(PORT_CONFIG_EDIT_PAGE_SELECTORS.selectPortConfig);

    public readonly minAccDecProfileTimeMs = 0;

    public readonly maxAccDecProfileTimeMs = 10000;

    public readonly formGroup = this.formBuilder.group({
        accelerationTimeMs: this.formBuilder.control<number>(
            DEFAULT_ACC_DEC_PROFILE_TIME_MS,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(this.maxAccDecProfileTimeMs)
                ]
            }
        ),
        decelerationTimeMs: this.formBuilder.control<number>(
            DEFAULT_ACC_DEC_PROFILE_TIME_MS,
            {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(this.maxAccDecProfileTimeMs)
                ]
            }
        )
    });

    private readonly sub = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly formBuilder: FormBuilder,
        private readonly routesBuilder: RoutesBuilderService,
        private readonly router: Router
    ) {
    }

    public get isSubmitDisabled(): boolean {
        return this.formGroup.invalid || this.formGroup.pristine;
    }

    public ngOnInit(): void {
        this.sub.add(
            this.portConfig$.subscribe((portConfig) => {
                if (portConfig) {
                    this.formGroup.controls.accelerationTimeMs.setValue(portConfig.accelerationTimeMs);
                    this.formGroup.controls.decelerationTimeMs.setValue(portConfig.decelerationTimeMs);
                }
            })
        );
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public onSubmit(
        event: Event
    ): void {
        event.preventDefault();
        if (!this.isSubmitDisabled) {
            this.portConfig$.pipe(
                take(1)
            ).subscribe((portConfig) => {
                if (portConfig) {
                    this.store.dispatch(CONTROL_SCHEME_ACTIONS.savePortConfig({
                        schemeName: portConfig.schemeName,
                        portConfig: {
                            hubId: portConfig.hubId,
                            portId: portConfig.portId,
                            accelerationTimeMs: this.formGroup.controls.accelerationTimeMs.value,
                            decelerationTimeMs: this.formGroup.controls.decelerationTimeMs.value
                        }
                    }));
                    this.router.navigate(
                        this.routesBuilder.controlSchemeView(portConfig.schemeName)
                    );
                }
            });
        }
    }

    public onCancel(): void {
        this.portConfig$.pipe(
            take(1)
        ).subscribe((portConfig) => {
            if (portConfig) {
                this.router.navigate(
                    this.routesBuilder.controlSchemeView(portConfig.schemeName)
                );
            }
        });
    }
}
