Summary
=======

GSAutomation is an extension to UIAutomation and aims to make test automation easier to use and maintain, and also keep the test scripts more robust.

You can define test tasks in simple javascript arrays, and get them executed with some handy helper methods.


Work Flow
=========

1. Import GSAutomation/lib/gsautomation.js
2. Define some task arrays
3. In the main test method, call performTask

Example
=======

    #import "GSAutomation/library.js"
    var task1 = [
        [Tap, "Button1"],
        [Check, "Text1", "Text2"],
    ];

    function main() {        
        performTask(task1);
    }

    main();


Task Array Definition
=====================

A task array is an array of steps. Each step is an array, with action name as the first element and followed by action parameters.

For example

    [Tap, "Button1"]

means tap the button named "Button1".

    [Check, "Text1", "Text2"]

means check if "Text1" and "Text2" both exist. If not, throw an error and fail the test.

There will be a 1 second delay between each two actions, and for each action a maximum of 10 second delay is allow for the first element to appear. (e.g. after tapping "Button1", up to 10 second is allowed for "Text1" to appear.)

Some actions allow a rescue step, e.g. we can insert an action/step as the last parameter of Tap step:

    [Tap, "Button1", [Tap, "Button2"]]

This means that if we failed to tap "Button1", we can try tapping "Button2" first and then try tapping "Button1" again. The rescue step is always going to be an optional parameter at the end of the action/step array.

Sometimes you'll find it hard to determine how the views are organized, e.g. if the button is inside a popover, you should do [Tap, "((Popover))::Button1"]. So in order to investigate the current view hierarchy, use a step [Investigate].


Supported Actions
=================

<table>
    <tr>
        <td>Action</td><td>Meaning</td><td>Parameters</td><td>Allow rescue?</td>
    </tr>
    <tr>
        <td>Tap</td><td>Tapping an element</td><td>the element (2nd item)</td><td>Yes</td>
    </tr>
    <tr>
        <td>Check</td><td>Check existence of some elements</td><td>a list of elements (2nd, 3rd.. items)</td><td>No</td>
    </tr>
        <tr>
        <td>CheckButtonEnable</td><td>Check if the Button is Enable</td><td>The button element</td><td>No</td>
    </tr>
    <tr>
        <td>Investigate</td><td>Investigate the current layout (children elements of the window or an element)</td><td>optionally an element to start investigating. If there's no param then the investigation is done for the main window</td><td>No</td>
    </tr>
    <tr>
        <td>Input</td><td>Type some text. Use after a text field/area is selected.</td><td>Text to type</td><td>Yes</td>
    </tr>
    <tr>
        <td>Scroll</td><td>Swipe slowly from the screen center or within an element.</td><td>Direction.Up, Direction.Down, Direction.Left, or Direction.Right. Optionally add a next parameter to specify the element to scroll at.</td><td>No</td>
    </tr>
    <tr>
        <td>Swipe</td><td>Swipe quickly from the screen center or within an element.</td><td>Direction.Up, Direction.Down, Direction.Left, or Direction.Right. Optionally add a next parameter to specify the element to scroll at.</td><td>No</td>
    </tr>
    <tr>
        <td>TapPoint</td><td>Tap on a point.</td><td>A point. e.g. {x:100, y:100}</td><td>No</td>
    </tr>
    <tr>
        <td>Pick</td><td>Select a value in a picker wheel</td><td>the picker wheel element as the 2nd item, and the value to select as the 3rd item</td><td>Yes</td>
    </tr>
    <tr>
        <td>TryTap</td><td>Similar to Tap, but allows failure. (e.g. if the button is not tappable, it won't fail the test.)</td><td>the button as the 2nd item</td><td>No</td>
    </tr>
    <tr>
        <td>Wait</td><td>Wait for some additional time. This action is normally unnecessary since a 1-second wait is applied automatically before every step. Use this only to add addition waiting time.</td><td>Time to wait (seconds).</td><td>No</td>
    </tr>
    <tr>
        <td>WaitFor</td><td>Wait for some additional time until an element appears. This action is normally unnecessary since a maximum of 10-second wait is applied automatically in order to access an element. Use this only to add addition waiting time.</td><td>2nd item is the element to wait for, and the 3rd item is the maximum time to wait (seconds).</td><td>No</td>
    </tr>
</table>


Referencing to UI elements
==========================

Top level elements can be defined directly through their names, e.g. title for a button, label, or file name for an image. If it belongs to the top level view, (The hierarchy is different and simpler than the hierarchy in the code, only standard containers like table view, tab bar, navigation bar, etc create levels; if a simple view A owns view B, B is still accessible from top level.) it can be accessed through the format "parent::child", e.g. "table::cell".

To specify the type of the element, we can use the format "((type))name". Type names should be based on UIAutomation API (e.g. UIAButton, UIATableView), but for simplicity we can skip "UIA", and just call it Button. So we can define elements like "((Button))Log In".

When there are multiple items matching the same type and name, we can do something like "((TableCell))[[1]]" to specify an index. The index is 0 based.

To investigate the current hierarchy and available elements, insert a step [Investigate].

For example, if you see this from [Investigate]:

    [null] [object UIAWindow] @ (0, 0) w=768, h=1024
    [null] [object UIAPopover] @ (492, 471) w=266, h=434
    - [The Title] [object UIAStaticText] @ (500, 497) w=250, h=44
    - [Empty list] [object UIATableView] @ (500, 541) w=250, h=297
    - - [null] [object UIATableCell] @ (500, 551) w=250, h=51
    - - - [Cell One] [object UIAStaticText] @ (500, 551) w=250, h=51
    - - [null] [object UIATableCell] @ (500, 602) w=250, h=50
    - - - [Cell Two] [object UIAStaticText] @ (500, 602) w=250, h=50

You can access "Cell Two" by:

    "((Popover))::((TableView))::((TableCell))[[2]]::Cell Two"


Additional Helper Methods
=========================

There are a number of helper methods provided by GSAutomation to make UIAutomation tests a lot easier. E.g. to check whether an element is on screen, you can do

    if (findChild(win(), "Something")) {
        // ...
    }

To use some device-dependent logic, simply do something like:

    var item = isPad() ? "iPad text" : "iPhone text";


To print some debug log, simply do

    log("some text");

Please refer to GSAutomation/lib/gsautomation.js to see all the supported helper methods.

