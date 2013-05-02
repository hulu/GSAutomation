//
//  gsaexample-test.js
//  GSAExample
//
//  Created by Bao Lei.
//  Copyright (c) 2013 Hulu. All rights reserved. See LICENSE.txt.
//

var task_view_1 = [
    // [Investigate], // Investigate is use to determine what's on screen when you don't know how to start
    [Feature, 
    "Feature: 1"],

    [Scenario, 
    "Insert some information"],

    [Check, "An example of", "Open New Window", 
    "When Check if elements exists"],

    [Tap, "((TextField))", 
    "Then Select the TextField"],

    [Input, "Apple Orange Banana Strawberry\n", 
    "Then insert data information"],

    [Tap, "Open New Window", 
    "Then open a new window"],
];

var task_view_2 = [
    [Feature, 
    "Feature: 2"],

    [Scenario, 
    "See some information"],

    [Check, "A modal view", 
    "When this is the corrected view"],

    [Check, "((TableView))::Apple", "((TableView))::((TableCell))A", "((TableView))::((TableCell))p[[1]]", 
    "Then check if the information is correct"],

    [Scroll, Direction.Up, "((TableView))",
    "Then scroll the TableView"],

    [Tap, "Close", 
    "Then close the current view"],
];

function main() {
    GlobalEnv.EnableTableGroup = true;
    // note: table groups are disabled and invisible by default since searching them is very slow
    // for many apps this is unnecessary if the table groups are not going to be checked

    // start the test steps
    performTask(task_view_1);
    // display the result so that instruments can mark the test in green or red
    // note: this is also optional, since performTask will log the result of each step
    displayResult();

    // start the test steps
    performTask(task_view_2);
    // display the result so that instruments can mark the test in green or red
    // note: this is also optional, since performTask will log the result of each step
    displayResult();
}
