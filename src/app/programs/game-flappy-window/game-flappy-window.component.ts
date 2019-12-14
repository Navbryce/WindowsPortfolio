import { Component, OnInit } from '@angular/core';
import { ProgramComponent } from '../program-component.class';
import { TaskbarService } from '../../services/index';

@Component({
    selector: 'game-flappy-window',
    templateUrl: './game-flappy-window.component.html',
    styleUrls: ['./game-flappy-window.component.scss']
})
export class GameFlappyWindow extends ProgramComponent implements OnInit {


    constructor (private taskbarService: TaskbarService) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    public windowResize (event: any): void {
    }
    public windowClose() {
    }
}
