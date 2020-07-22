import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from "@angular/animations";
import { Easing } from "./animation-easing";

export const slider = trigger("routeAnimations", [
  transition("scaleIn => *", scale(1.1)),
  transition("* => isLeft", slideTo("left")),
  transition("* => isRight", slideTo("right")),
  transition("* => scaleIn", scale(0.95)),
  transition("isRight => *", slideTo("left")),
  transition("isLeft => *", slideTo("right")),
  transition("* => homePage", scale(0.95)),
]);

///////////
// SLIDER //
///////////
function slideTo(direction) {
  const optional = { optional: true };
  return [
    style({ position: "relative" }),
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: 0,
          [direction]: 0,
          width: "80%",
          height: "100%",
        }),
      ],
      optional
    ),
    query(":enter", [style({ [direction]: "-100%" })]),
    group([
      query(
        ":leave",
        [animate("500ms ease-in-out", style({ [direction]: "100%" }))],
        optional
      ),
      query(":enter", [
        animate("500ms ease-in-out", style({ [direction]: "0%" })),
      ]),
    ]),
  ];
}

///////////
// SCALE //
///////////

function scale(size: number) {
  const optional = { optional: true };
  return [
    style({ position: "relative" }),
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
        }),
      ],
      optional
    ),
    group([
      query(
        ":enter",
        [
          style({ opacity: "0", transform: `scale(${size})` }),
          animate(
            `0.2s ${Easing.easeOutcubic}`,
            style({ opacity: "1", transform: "scale(1)" })
          ),
        ],
        optional
      ),
      query(
        ":leave",
        [
          style({ opacity: "1", transform: "scale(1)" }),
          animate(
            `0.2s ${Easing.easeIncubic}`,
            style({ opacity: "0", transform: `scale(${size})` })
          ),
        ],
        optional
      ),
    ]),
  ];
}
