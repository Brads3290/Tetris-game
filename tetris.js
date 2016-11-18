function GhostPiece(grid, shape, center, startX, startY) {
    var destroyed = false;
    var onDestroyed = [];

    this.destroy = function (cb) {
        for (var i = 0; i < shape.length; i++) {
            for (var ii = 0; ii < shape[i].length; ii++) {
                if (shape[i][ii]) {
                    var cell = grid.getCell(startX + (ii - center.x), startY + (i - center.y));
                    cell.style.opacity = "1";
                    cell.isOccupied = cell.isOccupied || false;

                    if (!cell.isOccupied) {
                        cell.style.backgroundColor = "inherit";
                    }
                }
            }
        }

        cb();

        for (var j = 0; j < onDestroyed.length; j++) {
            onDestroyed[j]();
        }
    };

    this.onDestroy = function (cb) {
        if (destroyed) {
            cb();
        } else {
            onDestroyed.push(cb);
        }
    };
}

function TPiece() {
    var shape;
    var color;
    var center = {
        x: 0,
        y: 0
    };

    var width;
    var height;

    this.height = function () {
        return height;
    };

    this.width = function () {
        return width;
    };

    this.defineColor = function (newColor) {
        color = newColor;
    };

    this.defineShape = function (definition) {
        shape = definition;
        width = definition[0].length;
        height = definition.length;
    };

    this.defineCenter = function (x, y) {
        center.x = x;
        center.y = y;
    };

    function validatePosition (grid, startX, startY) {
        /** First check the validity of the starting point in terms of the grid bounds */
        //Check to the left
        if (center.x > startX) {
            return "GridBounds";
        }

        //Check above
        if (center.y > startY) { //Check if there is room above the center
            return "GridBounds";
        }

        //Check to the right
        if ((width - center.x - 1) > (grid.width() - startX - 1)) {
            return "GridBounds";
        }

        //Check below
        if ((height - center.y - 1) > (grid.height() - startY - 1)) {
            return "GridBounds";
        }

        /** Then check for occupation by other blocks */
        for (var i = 0; i < shape.length; i++) {
            for (var ii = 0; ii < shape[i].length; ii++) {
                if (shape[i][ii]) {
                    var cell = grid.getCell(startX + (ii - center.x), startY + (i - center.y));
                    cell.isOccupied = cell.isOccupied || false;

                    if (cell.isOccupied) {
                        return "CellOccupied";
                    }
                }
            }
        }

        return "success";
    }

    this.drawGhostOnGrid = function (grid, startX, startY) {
        //Start by validating the position
        var validationResponse = validatePosition(grid, startX, startY);

        if (validationResponse === "success") {
            //Draw the block
            for (var i = 0; i < shape.length; i++) {
                for (var ii = 0; ii < shape[i].length; ii++) {
                    if (shape[i][ii]) {
                        var cell = grid.getCell(startX + (ii - center.x), startY + (i - center.y));
                        cell.style.backgroundColor = color;
                        cell.style.opacity = "0.5";
                    }
                }
            }

            console.log("Ghost Drawn");
            return new GhostPiece(grid, shape, center, startX, startY);
        } else {
            console.log("Unable to draw Ghost");
        }
    };

    this.drawOnGrid = function(grid, startX, startY) {
        //Start by validating the position
        var validationResponse = validatePosition(grid, startX, startY);

        if (validationResponse === "success") {
            //Draw the block
            for (var i = 0; i < shape.length; i++) {
                for (var ii = 0; ii < shape[i].length; ii++) {
                    if (shape[i][ii]) {
                        var cell = grid.getCell(startX + (ii - center.x), startY + (i - center.y));
                        cell.isOccupied = true;
                        cell.style.backgroundColor = color;
                        cell.style.opacity = "1";
                    }
                }
            }

            console.log("Shape Drawn");
        } else {
            console.log("Unable to draw shape");
            throw {e: "ShapeDrawFailuer"}
        }
    };

    this.drawSampleOnGrid = function(grid, startX, startY) {
        //Start by validating the position
        var validationResponse = validatePosition(grid, startX, startY);

        if (validationResponse === "success") {
            //Draw the block
            for (var i = 0; i < shape.length; i++) {
                for (var ii = 0; ii < shape[i].length; ii++) {
                    if (shape[i][ii]) {
                        var cell = grid.getCell(startX + (ii - center.x), startY + (i - center.y));
                        var div = document.createElement("div");
                        div.style.cssText = "width: 100%; height: 100%";
                        div.style.backgroundColor = color;
                        div.style.border = "solid black 1px";

                        cell.appendChild(div);
                    }
                }
            }

            console.log("Shape Drawn");
        } else {
            console.log("Unable to draw shape");
            throw {e: "ShapeDrawFailuer"}
        }
    }
}

function getPiece(shapeDef, center, color) {
    var shape = new TPiece();
    shape.defineShape(shapeDef);
    shape.defineCenter(center.x, center.y);
    shape.defineColor(color);

    return shape;
}

function gridUpdate(grid) {
    var updateList = [];

    //Check the rows
    (function () {
        for (var i = 0; i < grid.height(); i++) {
            (function (i) {
                for (var j = 0; j < grid.width(); j++) {
                    if (!grid.getCell(j, i).isOccupied) {
                        return;
                    }
                }

                for (var k = 0; k < grid.width(); k++) {
                    updateList.push(grid.getCell(k, i));
                }
            }(i));
        }
    }());

    //Check the columns
    (function () {
        for (var i = 0; i < grid.width(); i++) {
            (function (i) {
                for (var j = 0; j < grid.height(); j++) {
                    if (!grid.getCell(i, j).isOccupied) {
                        return;
                    }
                }

                for (var k = 0; k < grid.height(); k++) {
                    updateList.push(grid.getCell(i, k));
                }
            }(i));
        }
    }());

    for (var i = 0; i < updateList.length; i++) {
        updateList[i].isOccupied = false;
        updateList[i].style.backgroundColor = "inherit";
    }
}

var possibleShapes = [
    {
        shape: [
            [1]
        ],
        center: [0, 0],
        color: "turquoise"
    },
    {
        shape: [
            [1,1],
            [1,1]
        ],
        center: [0,0],
        color: "orange"
    },
    {
        shape: [
            [1,1,1],
            [1,1,1],
            [1,1,1]
        ],
        center: [1,1],
        color: "springgreen"
    },
    {
        shape: [
            [1,1]
        ],
        center: [0,0],
        color: "pink"
    },
    {
        shape: [
            [1],
            [1]
        ],
        center: [0,0],
        color: "pink"
    },
    {
        shape: [
            [1,0],
            [1,1]
        ],
        center: [0,1],
        color: "purple"
    },
    {
        shape: [
            [1,1],
            [0,1]
        ],
        center: [1,0],
        color: "purple"
    },
    {
        shape: [
            [1,1,1]
        ],
        center: [1, 0],
        color: "blue"
    },
    {
        shape: [
            [1,1,1,1,1]
        ],
        center: [2, 0],
        color: "lawngreen"
    },
    {
        shape: [
            [1],
            [1],
            [1],
            [1]
        ],
        center: [0, 1],
        color: "red"
    },
    {
        shape: [
            [1,1,1],
            [0,0,1],
            [0,0,1]
        ],
        center: [2, 0],
        color: "yellow"
    },
    {
        shape: [
            [0,1,0],
            [1,1,1]
        ],
        center: [1,1],
        color: "green"
    },
    {
        shape: [
            [1,0,0],
            [1,1,1]
        ],
        center: [0, 1],
        color: "lightgreen"
    },
    {
        shape: [
            [0,1,1],
            [1,1,0]
        ],
        center: [1, 0],
        color: "lightgreen"
    }
];