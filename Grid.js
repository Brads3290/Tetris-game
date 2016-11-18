(function () {
    function StaticGrid(cellX, cellY, width, height) {
        var gridContainer = document.createElement("div");
        gridContainer.style.cssText = "height: 100%; width: 100%;";

        if (width) {
            gridContainer.style.width = width;
        }

        if (height) {
            gridContainer.style.height = height;
        }

        var grid_array = [];
        var rows_array = [];

        var cellWidth = 100 / cellX;
        var cellHeight = 100 / cellY;

        this.width = function () {
            return cellX;
        };

        this.height = function () {
            return cellY;
        };

        for (var i = 0; i < cellY; i++) {
            var row = [];
            var ul = document.createElement("ul");
            ul.style.cssText = "margin: 0; padding: 0; display: block; width: 100%; list-style: none; box-sizing: border-box; height: " + cellHeight + "%;";

            for (var ii = 0; ii < cellX; ii++) {
                var li = document.createElement("li");
                li.style.cssText = "background: inherit; box-sizing: border-box; display: inline-block; height: 100%; width: " + cellWidth + "%;";

                row.push(li);
                ul.appendChild(li);
            }

            grid_array.push(row);
            rows_array.push(ul);
            gridContainer.appendChild(ul);
        }

        this.create = function (parentElement) {
            parentElement.appendChild(gridContainer);
        };

        this.cellStyle = function (styleObject) {
            Object.keys(styleObject).forEach(function (key) {
                for (var i = 0; i < grid_array.length; i++) {
                    for (var ii = 0; ii < grid_array[i].length; ii++) {
                        var cell = grid_array[i][ii];
                        cell.style[key] = styleObject[key];
                    }
                }
            });
        };

        this.rowStyle = function (styleObject) {
            Object.keys(styleObject).forEach(function (key) {
                for (var i = 0; i < rows_array.length; i++) {
                    rows_array[i].style[key] = styleObject[key];
                }
            });
        };

        this.gridStyle = function (styleObject) {
            Object.keys(styleObject).forEach(function (key) {
                gridContainer.style[key] = styleObject[key];
            });
        };

        this.forEachCell = function (fn) {
            for (var i = 0; i < grid_array.length; i++) {
                for (var ii = 0; ii < grid_array[i].length; ii++) {
                    var cell = grid_array[i][ii];
                    fn(cell, {
                        y: i,
                        x: ii,
                        totalRows: grid_array.length,
                        totalCols: grid_array[i].length
                    });
                }
            }
        };

        this.getCell = function (x, y) {
            return grid_array[y][x];
        };

        this.forEachRow = function (fn) {
            for (var i = 0; i < rows_array.length; i++) {
                fn(rows_array[i], {
                    index: i,
                    totalRows: rows_array.length,
                    totalCols: grid_array[0].length
                });
            }
        };

        this.getRow = function (index) {
            return grid_array[index];
        };

        this.gridContainer = function () {
            return gridContainer;
        }
    }

    window.StaticGrid = StaticGrid;
}());