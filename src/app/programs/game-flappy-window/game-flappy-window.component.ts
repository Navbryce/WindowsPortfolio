import {Component, OnInit, ViewChild} from '@angular/core';
import { ProgramComponent } from '../program-component.class';
import { TaskbarService } from '../../services/index';
import {GameFlappyComponent} from './game-flappy';

@Component({
    selector: 'game-flappy-window',
    templateUrl: './game-flappy-window.component.html',
    styleUrls: ['./game-flappy-window.component.scss']
})
export class GameFlappyWindow extends ProgramComponent implements OnInit {
    @ViewChild(GameFlappyComponent) flappyGame: GameFlappyComponent;

    constructor (private taskbarService: TaskbarService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public windowResize (event: any): void {
        this.flappyGame.windowResize(event);
    }

    public windowClose() {
    }
}
