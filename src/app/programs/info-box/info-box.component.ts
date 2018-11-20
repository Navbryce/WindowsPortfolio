import { Component, OnInit } from '@angular/core';
import { ProgramComponent } from '../program-component.class';
import { TaskbarService } from '../../services/index';

@Component({
  selector: 'info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent extends ProgramComponent implements OnInit {

    public eventHandler: Function;
    public level: String;
    public message: String;

    constructor (private taskbarService: TaskbarService) {
        super();
    }

    ngOnInit() {
        this.parseArguments(this.programArgs);
    }

    public buttonClicked (event: number): void {
        this.eventHandler(event);
        this.taskbarService.closeProgram(this.id); // close the program
    }

    public windowResize (event: any): void {
    }

    // BEGIN: Private functions
    private parseArguments (args: any): void {
        /* Parses arguments and configures variables accordingly
            args:
            {
                message: the message displayed by the info box,
                level: determines the icon being used,
                eventHandler: called when the user presses a button (1 means 
                ok or yes)
            }
        */
        const defaultArguments = {
            message: 'No message specified',
            level: 'info',
            eventHandler: () => {
                // by default, does nothing
            }
        };
        let resultArguments;
        if (args != null) {
            resultArguments = super.compareToDefaultArguments(args, defaultArguments);
        } else {
            resultArguments = defaultArguments;
        }
        this.message = resultArguments.message;
        this.level = resultArguments.level;
        this.eventHandler = resultArguments.eventHandler;
    }

}
