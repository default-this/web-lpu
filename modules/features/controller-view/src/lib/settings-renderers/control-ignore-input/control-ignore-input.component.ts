import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'feat-controller-view-control-ignore-input',
    templateUrl: './control-ignore-input.component.html',
    styleUrls: [ './control-ignore-input.component.scss' ],
    imports: [
        MatSlideToggleModule,
        ReactiveFormsModule,
        NgIf,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlIgnoreInputComponent {
    @Input() public control?: FormControl<boolean>;
}