export type LogicSymbol =
    | ["Unary", string]
    | ["Binary", string]
    | ["NestOpen"]
    | ["NestClose"]
    | ["Atom", string];
