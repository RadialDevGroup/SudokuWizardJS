/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Display, Constants, Initialize, Utilities, SudokuWizard */

class HandleFileSelect {
    constructor(Model) {
        let numberOfRowsPerAreaChanged;
        let numberOfCluesChanged;
        let numberOfClues;
        let numberOfRowsPerArea;
        let numberOfColumnsPerArea;
        let initialValues;
        let pencilMarksRead;
        let initialPencilMarks;
        let lineCounter;
        
        let badPuzzleSizeData;
        let badPuzzleData;
        let badPencilMarkData;
        
        const constants = new Constants(Model);
        
        this.LoadFile = (selectedFile) =>{
            const reader = new FileReader();
            reader.onload = (event) => {
                let contents = event.target.result;
                contents = contents.replace(/[\r]+/g, '');
                const lines = contents.split('\n');

                ReadPuzzleSizeParameters(lines);
                if (badPuzzleSizeData) {
                    return;
                }

                pencilMarksRead = false;
                for(lineCounter = 0; lineCounter < lines.length; lineCounter++){
                    const line = lines[lineCounter];
                    let p = line.indexOf('[Puzzle]');
                    if (p !== -1) {
                        ReadPuzzleValues(lines);
                        if (badPuzzleData) {
                            return;
                        }
                        if (!ValidPuzzle()) {
                            return;
                        }
                        continue;
                    }

                    p = line.indexOf('[PencilMarks]');
                    if (p !== -1) {
                        ReadPencilMarks(lines);
                        if (badPencilMarkData) {
                            return;
                        }
                        if (!ValidPencilMarks()) {
                            return;
                        }
                        pencilMarksRead = true;
                        continue;
                    }
                }
                SetValues();
            };
            reader.readAsText(selectedFile);
        };
        const ReadPuzzleSizeParameters = (lines) => {
            numberOfClues = 9;
            numberOfRowsPerArea = 3;
            let numberOfCluesSet = false;
            let numberOfRowsPerAreaSet = false;
            badPuzzleSizeData = false;
            for(lineCounter = 0; lineCounter < lines.length; lineCounter++){
                const line = lines[lineCounter];
                let p = line.indexOf('#H');
                if (p === 0) {
                    numberOfClues = parseInt(line.substring(3, line.length));

                    if (!ValidNumberOfClues()) {
                        badPuzzleSizeData = true;
                        return;
                    }
                    numberOfCluesSet = true;
                    if (numberOfRowsPerAreaSet) { break; }
                    continue;
                }
                p = line.indexOf('#R');
                if (p === 0) {
                    numberOfRowsPerArea = parseInt(line.substring(3, line.length));
                    if (!ValidNumberOfOfRowsPerArea(numberOfRowsPerArea)) {
                        badPuzzleSizeData = true;
                        return;
                    }
                    numberOfRowsPerAreaSet = true;
                    if (numberOfCluesSet) { break; }
                    continue;
                }
            }

            let numberOfCluesChanged = false;
            if (numberOfClues !== Model.numberOfClues) {
                numberOfCluesChanged = true;
            }

            let numberOfRowsPerAreaChanged = false;
            if (numberOfRowsPerArea !== Model.numberOfRowsPerArea) {
                numberOfRowsPerAreaChanged = true;
            }
            if (numberOfRowsPerAreaChanged || numberOfCluesChanged) {
                if (numberOfClues % numberOfRowsPerArea !== 0) {
                    const message = "The number of clues must be a multiple of the number of rows per area";
                    FileReadMessage(message);
                    badPuzzleSizeData = true;
                    return;
                }
            }
            numberOfColumnsPerArea = numberOfClues / numberOfRowsPerArea;
        };
        const ReadPuzzleValues = (lines) =>{
            badPuzzleData = false;
            initialValues = new Array(numberOfClues);
            for (let row = 0; row < numberOfClues; row++) {
                lineCounter++;
                const line = lines[lineCounter].trim();
                if (!ValidPuzzleLine(line, numberOfClues, row)) {
                    badPuzzleData = true;
                    return;
                }
                const initialValueRow = new Array(numberOfClues);
                for (let column = 0; column < numberOfClues; column++) {
                    const value = line.charAt(column);
                    if (!ValidPuzzleData(row, column, value)) {
                        badPuzzleData = true;
                        return;
                    }
                    initialValueRow[column] = value;
                }
                initialValues[row] = initialValueRow;
            }
        };
        const ValidPuzzle = () => {
            let results = ValidRows();
            if (!results) {
                return results;
            }

            results = ValidColumns();
            if (!results) {
                return results;
            }
            results = ValidAreas();
            
            return results;
        };
        const ReadPencilMarks = (lines) => {
            badPencilMarkData = false;;
            initialPencilMarks = new Array(numberOfClues);
            for (let row = 0; row < numberOfClues; row++) {
                lineCounter++;
                const line = lines[lineCounter].trim();
                const rowValues = line.split(',');
                if (!ValidPencilMarksLine(line, rowValues, row)) {
                    badPencilMarkData = true;
                    return;
                }
                const initialPencilMarksRow = new Array(numberOfClues);
                for (let column = 0; column < numberOfClues; column++) {
                    const values = rowValues[column];
                    if (!ValidPencilMarkData(row, column, values)) {
                        badPencilMarkData = true;
                        return;
                    }
                    initialPencilMarksRow[column] = values;
                }
                initialPencilMarks[row] = initialPencilMarksRow;
            }
        };    
        const ValidPencilMarks = () => {
            let results;
            if (initialPencilMarks.length === 0) {return true;}
            results = ValidPencilMarkRows();
            if (!results) { return results;}

            results = ValidPencilMarkColumns();
            if (!results) { return results;}
            
            results = ValidPencilMarkAreas();
            return results;
        };
        const SetValues = () => {
            const candidateBackground = new CandidateBackground(Model);
            if (numberOfRowsPerAreaChanged || numberOfCluesChanged) {
                UpdateModelParameters();

                const createNumberButtons = new CreateNumberButtons(Model);
                createNumberButtons.CreateNumberButtons();
                const createDisplay = new CreateDisplay(Model);
                createDisplay.CreateDisplay();
                const dataArrays = new DataArrays(Model);
                dataArrays.CreateDataArrays();
                candidateBackground.CreateCandidateBackgroundColors();
            } else {
                if  (Model.stepResultsUpdateMatrixAndDisplay.length > 0) {
                    const displayData = new DisplayData(Model);
                    displayData.ClearDisplay(Model.stepResultsUpdateMatrixAndDisplay.shift(0));
                }
                const dataArrays = new DataArrays(Model);
                dataArrays.ResetDataArrays();
                candidateBackground.ResetCandidateBackgroundArrays();
                const canvas = new Canvas(Model);
                canvas.ClearCanvas();
            }
            const display = new Display(Model);
            display.ClearDocs();
            const buttonStateControl = new ButtonStateControl(Model);
            buttonStateControl.DisableKeyPad();
            buttonStateControl.DisableAddPencilMarks();
            buttonStateControl.EnableStep();
            buttonStateControl.EnableClear();
            buttonStateControl.DisableReset();
            Model.displayIsCleared = false;

            UpdateModelAndDisplay();

            if (pencilMarksRead) {
                UpdateModelAndDisplayPencilMarks();
            } else {
                SudokuWizard.AddPencilMarks(Model);
            }
            const message = "File read successfully.";
            FileReadMessage(message);
        };
        const FileReadMessage = (message) => {
            const docElement = $("#docs")[0];
            docElement.value = message;
            Model.currentDocs = docElement.value;
        };
        const  ValidNumberOfClues = () => {
            if ((isNaN(numberOfClues)) || 
                (numberOfClues < 1)) {
                const message = "The number of clues (#H) must be a positive integer.";
                FileReadMessage(message);
                return false;
            }
            return true;
        };
        const  ValidNumberOfOfRowsPerArea = () => {
            if ((isNaN(numberOfRowsPerArea)) || 
                (numberOfRowsPerArea < 1)) {
                const message = "The number of rows per area (#R) must be a positive integer.";
                FileReadMessage(message);
                return false;
            }
            return true;
        };
        const  ValidPuzzleLine = (line, numberOfClues, row) => {
            if ((line === undefined) || 
                (line.charAt(0) === "[") ||
                (line.charAt(0) === "#")) {
                const message = "Insufficient number of puzzle rows";
                FileReadMessage(message);
                return false;
            }
            if (line.length < numberOfClues) {
                const rowValue = parseInt(row) + 1;
                const message = "Insufficient number of columns in row " + rowValue;
                FileReadMessage(message);
                return false;
            }
            if (line.length > numberOfClues) {
                const rowValue = parseInt(row) + 1;
                const message = "Too many columns in row " + rowValue;
                FileReadMessage(message);
                return false;
            }
            return true;
        };
        const  ValidPuzzleData = (row, column, value) => {
            if ((value !== ".") && 
                (constants.PositionForSymbolNumberOfSymbols(value, numberOfClues)=== -1)) {
                const rowValue = parseInt(row) + 1;
                const columnValue = parseInt(column) + 1;
                const message = "Invalid value \"" + value + "\" in row " + rowValue + ", column " + columnValue;
                FileReadMessage(message);
                return false;
            }
            return true;
        };
        
        const  ValidRows = () => {
            for (let row = 0; row < initialValues.length; row++) {
                let rowValues = new Set();
                for (let column = 0; column < initialValues.length; column++) {
                    const value = initialValues[row][column];
                    if (value === ".") {
                        continue;
                    }
                    if (rowValues.has(value)) {
                        const rowValue = parseInt(row) + 1;
                        const errorMessage = "Duplicate value " + value + " in row " + rowValue;
                        FileReadMessage(errorMessage);
                        return false;
                    } else {
                        rowValues[rowValues.length] = value;
                    }
                }
            }
            return true;
        };
        const  ValidColumns = () => {
            for (let column = 0; column < initialValues.length; column++) {
                let columnValues = new Set();
                for (let row = 0; row < initialValues.length; row++) {
                    const value = initialValues[row][column];
                    if (value === ".") {
                        continue;
                    }
                    if (columnValues.has(value)) {
                        const columnValue = parseInt(column) + 1;
                        const errorMessage = "Duplicate value " + value + " in column " + columnValue;
                        FileReadMessage(errorMessage);
                        return false;
                    } else {
                        columnValues[columnValues.length] = value;
                    }
                }
            }
            return true;
        };
        const  ValidAreas = () => {
            for (let area = 0; area < initialValues.length; area++) {
                let areaValues = new Set();
                for (let index = 0; index < initialValues.length; index++) {
                    const row = constants.RowForAreaAndIndexNumberOfSymbols(area, index, numberOfRowsPerArea, numberOfColumnsPerArea);
                    const column = constants.ColumnForAreaAndIndexNumberOfSymbols(area, index, numberOfRowsPerArea, numberOfColumnsPerArea);
                    const value = initialValues[row][column];
                    if (value === ".") {
                        continue;
                    }
                    if (areaValues.has(value)) {
                        const areaValue = parseInt(area) + 1;
                        const errorMessage = "Duplicate value " + value + " in area " + areaValue;
                        FileReadMessage(errorMessage);
                        return false;
                    } else {
                        areaValues[areaValues.length] = value;
                    }
                }
            }
            return true;
        };
        const  ValidPencilMarksLine = (line, rowValues, row) => {
            if ((line === undefined) || 
                (line.charAt(0) === "[") ||
                (line.charAt(0) === "#")) {
                const message = "Insufficient number of rows of pencil marks";
                FileReadMessage(message);
                return;
            }

            if (rowValues.length < numberOfClues) {
                const rowValue = parseInt(row) + 1;
                message = "Insufficient number of pencil marks in row " + rowValue;
                FileReadMessage(message);
                return;
            }
            if (rowValues.length > numberOfClues) {
                rowValue = parseInt(row) + 1;
                message = "Too many pencil marks in row " + rowValue;
                FileReadMessage(message);
                return;
            }
            return true;
        };
        const  ValidPencilMarkData = (row, column, values) => {
            if (values.length > 0 && initialValues[row][column] !== ".") {
                const rowValue = parseInt(row) + 1;
                const columnValue = parseInt(column) + 1;
                const message = "Puzzle and Pencil Marks values at the same row and column (" + 
                        rowValue + ", " + columnValue + ") are not allowed.";
                FileReadMessage(message);
                return false;
            }
            for (let index = 0; index < values.length; index++) {
                const value = values.charAt(index);
                if (constants.PositionForSymbolNumberOfSymbols(value, numberOfClues) === -1) {
                    const rowValue = parseInt(row) + 1;
                    const columnValue = parseInt(column) + 1;
                    const message = "Invalid pencil mark " + value + " in row " + rowValue + ", column " + columnValue; 
                    FileReadMessage(message);
                    return false;
                }
            }
            return true;
        };
        const  ValidPencilMarkRows = () => {
            for (let row = 0; row < initialPencilMarks.length; row++) {
                let columnWithMarksCount = 0;
                let pencilMarkValues = new Set();
                for (let column = 0; column < initialPencilMarks.length; column++) {
                    const pencilMark = initialPencilMarks[row][column];
                    if (pencilMark.length !== 0){
                        columnWithMarksCount++;
                        for (let index = 0; index < pencilMark.length; index++) {
                            const mark = pencilMark.substring(index, index + 1);
                            if (!pencilMarkValues.has(mark)) {
                                pencilMarkValues.add(mark);
                            }
                        }
                    }
                }
                if (columnWithMarksCount !== pencilMarkValues.size) {
                    const rowValue = parseInt(row) + 1;

                    const errorMessage = "Invalid pencil marks in row " + rowValue;
                    FileReadMessage(errorMessage);
                    return false;
                }
            }
            return true;
        };

        const  ValidPencilMarkColumns = () => {
            for (let column = 0; column < initialPencilMarks.length; column++) {
                let pencilMarkValues = new Set();
                let rowWithMarksCount = 0;
                for (let row = 0; row < initialPencilMarks.length; row++) {
                    const pencilMark = initialPencilMarks[row][column];
                    if (pencilMark.length !== 0){
                        rowWithMarksCount++;
                        for (let index = 0; index < pencilMark.length; index++) {
                            const mark = pencilMark.substring(index, index + 1);
                            if (!pencilMarkValues.hasOwnProperty(mark)) {
                                pencilMarkValues.add(mark);
                            }
                        }
                    }
                }
                if (rowWithMarksCount !== pencilMarkValues.size) {
                    const columnValue = parseInt(column) + 1;
                    const errorMessage = "Invalid pencil marks in column " + columnValue;
                    FileReadMessage(errorMessage);
                    return false;
                }
            }
            return true;
        };

        const  ValidPencilMarkAreas = () => {
            for (let area = 0; area < initialPencilMarks.length; area++) {
                let indexWithMarksCount = 0;
                let pencilMarkValues = new Set();
                for (let index = 0; index < initialPencilMarks.length; index++) {
                    const row = constants.RowForAreaAndIndexNumberOfSymbols(area, index, numberOfRowsPerArea, numberOfColumnsPerArea);
                    const column = constants.ColumnForAreaAndIndexNumberOfSymbols(area, index, numberOfRowsPerArea, numberOfColumnsPerArea);
                    const pencilMark = initialPencilMarks[row][column];
                    if (pencilMark.length !== 0){
                        indexWithMarksCount++;
                        for (let pointer = 0; pointer < pencilMark.length; pointer++) {
                             const mark = pencilMark.substring(pointer, pointer + 1);
                             if (!pencilMarkValues.has(mark)) {
                                pencilMarkValues.add(mark);
                            }
                        }
                    }
                }
                if (indexWithMarksCount !== pencilMarkValues.size) {
                    const areaValue = parseInt(area) + 1;
                    const errorMessage = "Invalid pencil marks in area " +  areaValue;
                    FileReadMessage(errorMessage);
                    return false;
                }
            }
            return true;
        };

        const  UpdateModelParameters = () => {
            Model.numberOfClues = numberOfClues;
            Model.numberOfRowsPerArea = numberOfRowsPerArea;
            Model.numberOfColumnsPerArea = numberOfColumnsPerArea;
            if (numberOfClues === 9) {
                const val = "9x9";
                Model.symbols = Model.symbolarray[numberOfClues];
            } else if (numberOfClues === 12) {
                const val = "12x12";
                Model.symbols = Model.symbolarray[numberOfClues];
            } else if (numberOfClues === 16) {
                const val = "16x16";
                Model.symbols = Model.symbolarray[numberOfClues];
            } else { return;}

            $('#displaySizeSelect option:contains(' + val + ')').prop({selected: true});
        };
        const  UpdateModelAndDisplay = () =>{
            const display = new Display(Model);
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    const value = initialValues[row][column];
                    const finalValueID = "#finalValuerow" + row + "column" + column;
                    const finalValue = $(finalValueID)[0];
                    if (value !== ".") {
                        finalValue.innerHTML = value;
                        finalValue.style.color = Model.initialValueColor;
                        Model.initialValues[row][column] = value;
                        Model.currentValues[row][column] = value;
                        display.TurnOffCandidateTable(row, column);
                        display.TurnOnFinalValue(row, column);
                    } else {
                        finalValue.innerHTML = "";
                        Model.initialValues[row][column] = "";
                        Model.currentValues[row][column] = "";
                        display.TurnOnCandidateTable(row, column);
                        display.TurnOffFinalValue(row, column);
                    }
                }
            }
        };
        const UpdateModelAndDisplayPencilMarks = () => {
            const display = new Display(Model);
            for (let row = 0; row < Model.numberOfClues; row++) {
                for (let column = 0; column < Model.numberOfClues; column++) {
                    const values = initialPencilMarks[row][column];
                    Model.initialPencilMarks[row][column] = values;
                    Model.currentPencilMarks[row][column] = values;
                    if (values.length === 0) {
                        for (let value = 0; value < Model.numberOfClues; value++) {
                            const hash = constants.Hash(row, column, value);
                            display.HideCandidate(hash);
                        }
                        continue;
                    }
                    display.TurnOffFinalValue(row, column);
                    display.TurnOnCandidateTable(row, column);

                    for (let value = 0; value < Model.numberOfClues; value++) {
                        const hash = constants.Hash(row, column, value);
                        if (values.indexOf(constants.SymbolAtPosition(value)) !== -1) {
                            display.ShowCandidate(hash);
                        } else {
                            display.HideCandidate(hash);
                        }
                    }
                }
            }
        };
    }
}