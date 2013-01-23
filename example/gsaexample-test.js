
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
    GlobalEnv.EnableTableGroup = true;
    // note: table groups are disabled and invisible by default since searching them is very slow
    // for many apps this is unnecessary if the table groups are not going to be checked

    // start the test steps
    performTask(task);

    // display the result so that instruments can mark the test in green or red
    // note: this is also optional, since performTask will log the result of each step
    displayResult();
}
