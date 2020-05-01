import { Component, OnInit } from "@angular/core";
import { Message, MessageQuery } from "../+state";
import { Observable } from "rxjs";

@Component({
  selector: "app-message-board",
  templateUrl: "./message-board.component.html",
  styleUrls: ["./message-board.component.scss"],
})
export class MessageBoardComponent implements OnInit {
  public messages$: Observable<Message[]>;
  constructor(private query: MessageQuery) {}

  ngOnInit(): void {
    this.messages$ = this.query.selectAll();
  }
}
