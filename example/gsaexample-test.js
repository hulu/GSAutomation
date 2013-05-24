//
//  gsaexample-test.js
//  GSAExample
//
//  Created by Bao Lei.
//  Copyright (c) 2013 Hulu. All rights reserved. See LICENSE.txt.
//

var taskView1 = [
    // [Investigate], // Investigate is use to determine what's on screen when you don't know how to start
    [Feature, "Test the main view"],
    [Check, "An example of", "Open New Window"],
    [Tap, "((TextField))"],
    [Feature, "Test typing"],
    [Input, "Apple Orange Banana Strawberry\n"],
    // [CheckButtonEnabled, "Open New Window", false], // Enabling this line will fail the test
    // [Tap, "Open Wrong Window"], // Enabling this line will fail the test
    [Tap, "Open New Window"],
];

var taskView2 = [
    [Feature, "Test the modal view"],
    [Note, "This is the view that pops up when you hit the button from the home page"],
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
    performTask(taskView1);
    performTask(taskView2);
}
