
var task = [
    // [ActionInvestigate], // Investigate is use to determine what's on screen when you don't know how to start
    [ActionCheck, "An example of", "Open New Window"],
    [ActionTap, "((TextField))"],
    [ActionInput, "Apple Orange Banana Strawberry\n"],
    [ActionTap, "Open New Window"],
    [ActionCheck, "A modal view"],
    [ActionCheck, "((TableView))::Apple", "((TableView))::((TableCell))A", "((TableView))::((TableCell))p[[1]]"],
    [ActionTap, "((TableView))::((TableGroup))Orange", [ActionScroll, Direction.Up, "((TableView))"], [ActionScroll, Direction.Up, "((TableView))"]],
    [ActionTap, "Close"],
];

function main() {
    performTask(task);
    displayResult();
}
