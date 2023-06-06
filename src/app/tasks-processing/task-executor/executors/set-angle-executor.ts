import { TaskExecutor } from '../task-executor';
import { Observable } from 'rxjs';
import { IHub, PortCommandExecutionStatus } from '@nvsukhanov/rxpoweredup';
import { PortCommandSetAngle } from '../../../common';

export class SetAngleExecutor extends TaskExecutor {
    protected handle(
        task: PortCommandSetAngle,
        hub: IHub
    ): Observable<PortCommandExecutionStatus> | null {
        return hub.motors.goToPosition(
            task.portId,
            task.angle,
            {
                speed: task.speed,
                power: task.power,
                endState: task.endState,
            }
        );
    }
}