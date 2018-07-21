import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: '[program-icon]',
  templateUrl: './program-icon.component.html',
  styleUrls: ['./program-icon.component.scss']
})
export class ProgramIconComponent implements OnInit {

  @Input() imageSource: string;
  @Input() status: number; // 0 - closed, 1 - minimized, 2 - maximized
  @Output() iconClick = new EventEmitter<number>(); // outputs what was clicked (main button - 0; little close button - -1)

  constructor (private hostElement: ElementRef) {

  }

  ngOnInit() {
  }

  // BEGIN Private Functions

  private clickListener (action: number) { // outputs what was clicked (main button - 0; little close button - -1)
    this.iconClick.emit(action);
  }

  // End Private Functions


}
