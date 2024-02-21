import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'page-control-scheme-view-control-scheme-page-full-toolbar-controls',
    templateUrl: './control-scheme-page-full-toolbar-controls.component.html',
    styleUrls: [ './control-scheme-page-full-toolbar-controls.component.scss' ],
    imports: [
        MatButtonModule,
        NgIf,
        TranslocoPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemePageFullToolbarControlsComponent {
    @Input() public canRun = false;

    @Input() public canStop = false;

    @Input() public canExport = false;

    @Input() public canAddBinding = false;

    @Input() public canAddWidgets = false;

    @Input() public canReorderWidgets = false;

    @Input() public canDelete = false;

    @Output() public readonly run = new EventEmitter<void>();

    @Output() public readonly stop = new EventEmitter<void>();

    @Output() public readonly addBinding = new EventEmitter<void>();

    @Output() public readonly export = new EventEmitter<void>();

    @Output() public readonly delete = new EventEmitter<void>();

    @Output() public readonly addWidget = new EventEmitter<void>();

    @Output() public readonly reorderWidgets = new EventEmitter<void>();

    public onRun(): void {
        this.run.emit();
    }

    public onStop(): void {
        this.stop.emit();
    }

    public onAddBinding(): void {
        this.addBinding.emit();
    }

    public onDelete(): void {
        this.delete.emit();
    }

    public onExport(): void {
        this.export.emit();
    }

    public onAddWidget(): void {
        this.addWidget.emit();
    }

    public onReorderWidgets(): void {
        this.reorderWidgets.emit();
    }
}