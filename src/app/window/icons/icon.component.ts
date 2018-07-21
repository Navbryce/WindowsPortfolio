import { Component, Input } from '@angular/core';

@Component({
  selector: '[icon]',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent {
  height = "12px";
  width = "12px";

  @Input() icon: String;

}
