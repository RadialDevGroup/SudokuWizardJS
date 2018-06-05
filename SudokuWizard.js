/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global SudokuWizard */

class sudokuWizard {
    constructor(Model) {
        this.HandleFileSelectEvent = (handleFileSelectEvent) => {
            const selectedFile = handleFileSelectEvent.target.files[0];
            if (!selectedFile) {
                return;
            }
            const handleFileSelect = new HandleFileSelect(Model);
            handleFileSelect.LoadFile(selectedFile);
        };
        this.AddPencilMarks = () => {
            const addPencilMarks = new AddPencilMarks(Model);
            addPencilMarks.AddPencilMarks();
        };
        this.NumberPadClicked = (id) => {
            const setValuesOnDisplay = new SetValuesOnDisplay(Model);
            setValuesOnDisplay.NumberPadClicked(id);
        };
        this.CanvasClicked = (canvasClickEvent) => {
            const setValuesOnDisplay = new SetValuesOnDisplay(Model);
            setValuesOnDisplay.CanvasClicked(canvasClickEvent);
        };
        this.Clear = () => {
            const clearReset = new ClearReset(Model);
            clearReset.Clear();
        };
        this.Reset = () => {
            const clearReset = new ClearReset(Model);
            clearReset.Reset();
        };
        this.ReadMe = () => {
            const readMe = new ReadMe();
            readMe.ReadMe();
        };
        this.Step = () => {
            const step = new Step();
            step.Step(Model);
        };
        this.Solver = (puzzleName) => {
            const solver = new Solver(Model);
            solver.Solve().then(
                solver.LoadPuzzle(puzzleName)
            );
        };
        this.Strategy = (action) => {
            const strategy = new Strategy();
            strategy.Strategy(action);
        };

        this.SdkFormat = () => {
            const sdkFormat = new SdkFormat();
            sdkFormat.SdkFormat();
        };
        this.NewDisplaySize = (selection) => {
            const createDisplay = new CreateDisplay(Model);
            createDisplay.NewDisplaySize(selection);
        };
        this.GetOffsetTop = (element) => {
            const utilities = new Utilities();
            const offsetTop = utilities.GetOffsetTop(element);
            return offsetTop;
        };
        this.GetOffsetLeft = (element) => {
            const utilities = new Utilities();
            const offsetLeft = utilities.GetOffsetLeft(element);
            return offsetLeft;
        };
    }
};

