import { Component, OnInit } from '@angular/core';

interface Tile  {
  coordonate: number;
  trace: number;
  noise: number;
}


@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
}
