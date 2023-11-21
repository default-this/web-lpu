import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NEVER, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { BindingTypeToL10nKeyPipe, ScreenSizeObserverService } from '@app/shared';

import { BindingTreeNodeViewModel } from './binding-tree-node-view-model';
import { INPUT_TREE_NODE_VIEW_MODEL_SELECTOR } from './input-tree-node-view-model.selector';
import { ControlSchemeInputActionToL10nKeyPipe, FullControllerInputNamePipe } from '../../common';
import { BindingViewUrlPipe } from './binding-view-url.pipe';
import { ControlSchemeViewBindingTreeNodeData } from '../types';

@Component({
    standalone: true,
    selector: 'app-binding-tree-node',
    templateUrl: './binding-tree-node.component.html',
    styleUrls: [ './binding-tree-node.component.scss' ],
    imports: [
        NgIf,
        BindingTypeToL10nKeyPipe,
        TranslocoPipe,
        PushPipe,
        MatFormFieldModule,
        NgForOf,
        RouterLink,
        BindingViewUrlPipe,
        ControlSchemeInputActionToL10nKeyPipe,
        FullControllerInputNamePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingTreeNodeComponent {
    public readonly isSmallScreen$ = this.screenSizeObserverService.isSmallScreen$;

    private _treeNodeData?: ControlSchemeViewBindingTreeNodeData;

    private _viewModel$: Observable<BindingTreeNodeViewModel> = NEVER;

    constructor(
        private readonly store: Store,
        private readonly screenSizeObserverService: ScreenSizeObserverService
    ) {
    }

    public get viewModel$(): Observable<BindingTreeNodeViewModel> {
        return this._viewModel$;
    }

    @Input()
    public set treeNodeData(
        treeNodeData: ControlSchemeViewBindingTreeNodeData | undefined
    ) {
        if (this._treeNodeData !== treeNodeData) {
            this._treeNodeData = treeNodeData;
            if (!treeNodeData) {
                this._viewModel$ = NEVER;
            } else {
                this._viewModel$ = this.store.select(INPUT_TREE_NODE_VIEW_MODEL_SELECTOR(
                    treeNodeData.schemeName,
                    treeNodeData.binding.inputs,
                    treeNodeData.binding.bindingType,
                    treeNodeData.binding.id,
                    treeNodeData.ioHasNoRequiredCapabilities
                ));
            }
        }
    }
}