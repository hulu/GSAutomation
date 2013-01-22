



/** @return true if the device is iPad or iPad simulator
 */
function isPad() {
    return UIATarget.localTarget().model().indexOf("iPad")>=0;
}

var Direction = {
    Up    : {value:0, name:"Up"},
    Down  : {value:1, name:"Down"},
    Left  : {value:3, name:"Left"},
    Right : {value:4, name:"Right"}
};


var Check = "check";
var Tap = "tap";
var TryTap = "tryTap";
var Investigate = "investigate";
var Input = "input";
var Wait = "wait";
var Scroll = "scroll";
var Swipe = "swipe";
var TapPoint = "tapPoint";
var WaitFor = "waitFor";
var Pick = "pick";

var GlobalEnv = {
    Pass : true,
};

var DefaultMaxWaitingTime = 10;

/// Shortcut for debug log
function log(str) {
	UIALogger.logDebug(str);
}

/// short cut for getting main window
function win() {
	return UIATarget.localTarget().frontMostApp().mainWindow();
}

/// short cut for delay
function wait(i) {
	UIATarget.localTarget().delay(i);
}

/** Checks if 2 elements overlap
 */
function overlap(element1, element2) {
    var rect1 = element1.rect();
    var rect2 = element2.rect();
    return (rect1.origin.x + rect1.size.width > rect2.origin.x && rect2.origin.x + rect2.size.width > rect1.origin.x 
            && rect1.origin.y + rect1.size.height > rect2.origin.y && rect2.origin.y + rect2.size.height > rect1.origin.y);
}

/** return the center point of a rect, a dict with x and y
 */
function centerPoint(r) {
    return {x: (r.origin.x+r.size.width/2), y: (r.origin.y+r.size.height/2)};
}


/** return the screen center point, a dict with x and y
 */
function screenCenter() {
    var size = win().rect().size;
    return {x: size.width/2, y: size.height/2};
}

/** check if an element is inside screen
 */
function inScreen(element) {
    if (!element || !(element instanceof UIAElement)) return false;
    var size = element.rect().size;
	return overlap(element, win()) && size.width>0 && size.height>0;
}

/** converts a rect object to a string
 */
function rect2str(r) {
    return "(" + r.origin.x + ", " + r.origin.y + ") w=" + r.size.width + ", h="+ r.size.height;
}

/** Get an array of children for an element
 */
function childrenArray(element) {
    var children = (element instanceof UIATableView)? element.visibleCells() : element.elements();
    var array = children.toArray();
    if (element instanceof UIATableView) {
        if (element.groups()) {
            array = array.concat(element.groups().toArray());
        }
    }
    return array;
}

/** Get the debug text of an element
 */
function debugText(element) {
    var text = "[" + element.name() + "] " + element + " @ " + rect2str(element.rect());
    return text;
}

/** Mark the result as passed or failed in instruments
 */
function displayResult() {
    if (GlobalEnv.Pass) {
        UIALogger.logPass("Passed all tests");
    }
    else {
        UIALogger.logFail("Failed");
    }
}

/// Safer than built-in logElementTree since this doesn't do recursion
function logChildren(element) {
    var array = childrenArray(element);
    for (var i in array) {
        var element = array[i];
        var prefix = inScreen(element)? "√ " : "X "
        log( prefix + debugText(element) );
    }
}

/// Safer than built-in logElementTree since this does recursion more conservatively
function logTree(element) {
    var stack = [element];
    var levelStack = [0];
    while (stack.length) {
        var current = stack.pop();
        var currentLevel = levelStack.pop();
        log("* " + Array(currentLevel).join("- ") + debugText(current));
        var children = childrenArray(current);
        for (var i in children.reverse()) {
            var child = children[i];
            if (inScreen(child) && !(child instanceof UIAApplication) ) {
                var childLevel = currentLevel + 1;
                levelStack.push(childLevel)
                stack.push(child);
            }
        }
    }
}

/** Swipe at a point to a direction
 * point is a dictionary with keys: x and y
 * direction is an instance of Direction enum
 */
function swipe(point, direction, distance, duration) {
    
    if (!distance) {
        distance = isPad() ? 300 : 100;
    }
    
    var humanFingerChubbiness = 5;
    var to = {};
    to.x = point.x;
    to.y = point.y;
    if (direction == Direction.Up) {
        to.y = to.y - distance;
        to.x = to.x + humanFingerChubbiness;
    }
    else if (direction == Direction.Down) {
        to.y = to.y + distance;
        to.x = to.x + humanFingerChubbiness;
    }
    else if (direction == Direction.Left) {
        to.x = to.x - distance;
        to.y = to.y + humanFingerChubbiness;
    }
    else if (direction == Direction.Right) {
        to.x = to.x + distance;
        to.y = to.y + humanFingerChubbiness;
    }

   
    
    if (!duration) {
        UIATarget.localTarget().flickFromTo(point, to);
    }
    else {
        UIATarget.localTarget().dragFromToForDuration(point, to, duration);
    }
    wait(2);
}



/// Find an element whose name contains str within element
function findChild(element, str, type) {
    var splitIdx = str.indexOf("::");
    if (splitIdx>=0) {
        var items = str.split("::");
        var first = findChild(element, items[0]);
        if (!first) return null;
        return findChild(first, str.substring(splitIdx+2));
    }

    var realtype = type;
    var realstr = str;

    var reg = /^\(\((.*)\)\)(.*)/;
    var rmatch = reg.exec(str);
    if (rmatch) {
        realtype = rmatch[1];
        realstr = rmatch[2];
    }

    var skipCount = 0;
    var reg2 = /(.*)\[\[(\d+)\]\]$/;
    var rmatch2 = reg2.exec(realstr);
    if (rmatch2) {
        realstr = rmatch2[1];
        skipCount = parseInt(rmatch2[2]);
    }

    var array = childrenArray(element);
    for (var i in array) {
        var element = array[i];
        if (!inScreen(element)) {
            continue;
        }
        var match = true;
        if (realstr.length) {
            if (!element.name()) {
                match = false;
            }
            else if (element.name().indexOf(realstr)<0) {
                match = false;
            }
        }
        if (realtype) {
            var info = " "+element;
            if (info.indexOf(realtype)<0) {
                match = false;
            }
        }
        if (match) {
            if (skipCount>0) {
                skipCount --;
            }
            else {
                return element;
            }
        }
    }
    return null;
}

/// Current time in seconds
function currentTimeInSec() {
    return (new Date().getTime() / 1000);
}

/// Allowing a maximum waiting time, and check whether the target element appears
/// Returns the element if it exists.
function waitForElement(target, maxTime) {
    var window = win();
    var child = findChild(window, target);
    var timeStarted = currentTimeInSec();
    var timeSpent = 0;
    while(!child && timeSpent<maxTime) {
        wait(1);
        child = findChild(window, target);
        timeSpent = currentTimeInSec() - timeStarted;
    }
    return child;
}

/// Perform task based on task array
function performTask(tasks) {
    if (!GlobalEnv.Pass) {
        return;
    }

    for (var i in tasks) {
        wait(1); // be tolerant at the beginning

        var step  = tasks[i];
        log("performing "+step);
        
        var missing = performStep(step);

        if (missing) {
            break;
        }
    }
    if (missing) {
        log("[error] cannot find "+ missing + " during step " + step);
        UIALogger.logFail("fail to find "+ missing + " during step " + step);
        // throw "fail";
        GlobalEnv.Pass = false;
    }
}

function performStep(step) {
    var window = win();
    var action = step[0];
    var missing = null;
    var rescueIdx = -1;

    if (Check == action) {
        waitForElement(step[1], DefaultMaxWaitingTime);
        for (var j in step) {
            if (j>0) {
                if (!findChild(window, step[j])) {
                    missing = step[j];
                    break;
                }
            }
        }
        
    }
    else if (Tap == action || TryTap == action) {
        waitForElement(step[1], DefaultMaxWaitingTime);
        var b = findChild(window, step[1]);
        if (!b) {
            missing = step[1];
        }
        else {
            try {
                // log("going to tap " + b + b.name() + rect2str(b.rect()) );
                if (TryTap ==action) {
                    UIATarget.localTarget().tap(centerPoint(b.rect()));
                }
                else if (b instanceof UIAButton) {
                    b.tap();
                }
                else {
                    UIATarget.localTarget().tap(centerPoint(b.rect()));
                }
            }
            catch(ex) {
                missing = step[1];
            }
        }
        if (action== Tap) {
            rescueIdx = 2;
        }
        else { // TryTap
            if (missing) {
                log("Failed to tap "+missing+" but it is fine");
            }
            missing = null; // it's fine
        }
    }
    else if (Investigate == action) {
        if (step.length>1) {
            var e = findChild(window, step[1]);
            if (!e) {
                missing = step[1];
            }
            else {
                logTree(e);
            }
        }
        else {
            logTree(window);
            // UIATarget.localTarget().logElementTree();
        }
    }
    else if (Input == action) {
        var kb = UIATarget.localTarget().frontMostApp().keyboard();
        if (kb) {
            kb.typeString(step[1]);
        }
        else {
            missing = "Keyboard";
            rescueIdx = 2;
        }
    }
    else if (Wait == action) {
        wait(step[1]);
    }
    else if (Scroll == action) {
        var point = screenCenter();
        if (step[2]) {
            var element = findChild(window, step[2]);
            if (element) {
                point = centerPoint(element.rect());
            }
        }
        swipe(point, step[1], null, 1);
    }
    else if (Swipe == action) {
        var point = screenCenter();
        if (step[2]) {
            var element = findChild(window, step[2]);
            if (element) {
                point = centerPoint(element.rect());
            }
        }
        swipe(point, step[1]);
    }
    else if (TapPoint == action) {
        UIATarget.localTarget().tap(step[1]);
    }
    else if (WaitFor == action) {
        var target = step[1];
        var maxTime = step[2];
        var child = waitForElement(target, maxTime);
        if (!child) {
            missing = target;
            rescueIdx = 3;
        }
    }
    else if (Pick == action) {
        waitForElement(step[1], DefaultMaxWaitingTime);
        var picker = findChild(window, step[1]);
        if (!picker || !(picker instanceof UIAPickerWheel) ) {
            missing = step[1];
        }
        else {
            try {
                picker.selectValue(step[2]);
            }
            catch(ex) {
                missing = step[2];
            }
        }
        rescueIdx = 3;
    }

    // see if we can rescue
    if (missing && rescueIdx && step[rescueIdx]) {
        rescueTask = step[rescueIdx];
        step.splice(rescueIdx,1);
        wait(1);
        log("rescuing with "+rescueTask);
        var rescueMissing = performStep(rescueTask);
        if (!rescueMissing) {
            wait(1);
            log("retrying "+step);
            missing = performStep(step);
        }
    }

    return missing;
}

