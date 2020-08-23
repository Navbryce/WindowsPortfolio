import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: "shortcut",
  templateUrl: "./shortcut.component.html",
  styleUrls: ["./shortcut.component.scss"]
})
export class ShortcutComponent implements OnInit {

  public column: number;
  public initialPosition: any // initialPosition - object with x (number) and y (number) keys
  public row: number;

  @Input() programDefinition: any;
  @Input() selected: boolean = false;

  @Output('event') event: EventEmitter<any> = new EventEmitter();

  @ViewChild('contentWrapper', {static: true}) contentWrapper: ElementRef;
  @ViewChild('wrapper', {static: true}) wrapper: ElementRef;

  constructor () {
  }

  ngOnInit () {
    this.addEventListeners();
    if (this.initialPosition) {
      let nativeElement = this.wrapper.nativeElement;
      nativeElement.style.left = this.initialPosition.x + 'px';
      nativeElement.style.top = this.initialPosition.y + 'px';
    }
  }

  // BEGIN Private Functions
  private addEventListeners () {
    /* Adds the event listeners */
    this.contentWrapper.nativeElement.addEventListener('dblclick', (event) => {
      this.event.emit({
        event: 'dblclick',
        program: this.programDefinition
      });
    });

  }
  // END Private Functions
}
