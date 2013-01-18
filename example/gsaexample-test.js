
var task = [
    // [Investigate], // Investigate is use to determine what's on screen when you don't know how to start
    [Check, "An example of", "Open New Window"],
    [Tap, "((TextField))"],
    [Input, "Apple Orange Banana Strawberry\n"],
    [Tap, "Open New Window"],
    [Check, "A modal view"],
    [Check, "((TableView))::Apple", "((TableView))::((TableCell))A", "((TableView))::((TableCell))p[[1]]"],
    [Tap, "((TableView))::((TableGroup))Orange", [Scroll, Direction.Up, "((TableView))"], [Scroll, Direction.Up, "((TableView))"]],
    [Tap, "Close"],
];

function main() {
    performTask(task);
    displayResult();
}
