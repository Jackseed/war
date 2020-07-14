import {
  trigger,
  transition,
  style,
  query,
  group,
  animate,
} from "@angular/animations";

export const slider = trigger("routeAnimations", [
  transition("* => isLeft", slideTo("left")),
  transition("* => isRight", slideTo("right")),
  transition("isRight => *", slideTo("left")),
  transition("isLeft => *", slideTo("right")),
]);

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
