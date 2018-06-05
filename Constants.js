/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, SudokuWizard */

//Constants class functions
class Constants {
    constructor (Model) {
        this.Hash = (row, column, value) => {
            const hash = (((row * Model.numberOfClues) + column) * Model.numberOfClues) + value;
            return hash;
        };

        this.RowFromHash = (hash) => {
            return Math.floor(Math.floor(hash / Model.numberOfClues) / Model.numberOfClues);
        };
        this.ColumnFromHash = (hash) => {
            return Math.floor(hash / Model.numberOfClues) % Model.numberOfClues;
        };
        this.ValueFromHash = (hash) => {
            return hash % Model.numberOfClues;
        };
        this.SymbolAtPosition = (position) => {
            return Model.symbols.charAt(position);
        };
        this.PositionForSymbolNumberOfSymbols = (symbol, numberOfSymbols) => {
            const localSymbols = Model.symbolarray[numberOfSymbols];
            for (let i = 0; i < localSymbols.length; i++) {
                if (localSymbols.charAt(i) === symbol) {
                    return i;
                }
            }
            return -1;
        };
        this.PositionForSymbol = (symbol) => {
            for (let i = 0; i < Model.symbols.length; i++) {
                if (Model.symbols.charAt(i) === symbol) {
                    return i;
                }
            }
            return -1;
        };
        this.AreaForRowAndColumn = (row, column) => {
            const part1 = Math.floor(row / Model.numberOfRowsPerArea) * Model.numberOfRowsPerArea;
            const part2 = Math.floor(column / Model.numberOfColumnsPerArea);
            const area = part1 + part2;
            return area;
        };
        this.IndexForRowAndColumn = (row, column) => {
            const index = (row % Model.numberOfRowsPerArea) * Model.numberOfColumnsPerArea +
                        (column % Model.numberOfColumnsPerArea);
            return index;
        };
        this.RowForAreaAndIndex = (area, index) => {
            const baseRow = Math.floor(area / Model.numberOfRowsPerArea) * Model.numberOfRowsPerArea;
            const row = baseRow + Math.floor(index / Model.numberOfColumnsPerArea);
            return row;
        };
        this.ColumnForAreaAndIndex = (area, index) => {
            const baseColumn = (area % Model.numberOfRowsPerArea) * Model.numberOfColumnsPerArea;
            const column = baseColumn + index % Model.numberOfColumnsPerArea;
            return column;
        };
        this.RowForAreaAndIndexNumberOfSymbols = (area, index, numberOfRowsPerArea, numberOfColumnsPerArea) => {
            const baseRow = Math.floor(area / numberOfRowsPerArea) * numberOfRowsPerArea;
            const row = baseRow + Math.floor(index / numberOfColumnsPerArea);
            return row;
        };
        this.ColumnForAreaAndIndexNumberOfSymbols = (area, index, numberOfRowsPerArea, numberOfColumnsPerArea) => {
            const baseColumn = (area % numberOfRowsPerArea) * numberOfColumnsPerArea;
            const column = baseColumn + index % numberOfColumnsPerArea;
            return column;
        };
    }
};
