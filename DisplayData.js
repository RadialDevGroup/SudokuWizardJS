/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Canvas, Display, Constants */

// DisplayData methods
class DisplayData {
    constructor (Model){
        let displaydata;
        const constants = new Constants(Model);
        this.UpdateMatrixAndDisplay = function (Displaydata){
            displaydata = Displaydata;
            this.ClearDisplay(displaydata);
            TurnOnFinalValues();
        };
        this.UpdateDisplayOnly = function(Displaydata){
            displaydata = Displaydata;
            ColorNodes();
            ColorLockedSet();
            HighlightChains();
            HighlightALSs();
            HighlightRCCs();
            HighlightChainInteractionNodes();
            UpdateDocs();
            CheckIfDone();

            HighlightCandidates();
        };
        this.ClearDisplay = function (Displaydata){
            displaydata = Displaydata;
            const canvas = new Canvas(Model);
            canvas.ClearCanvas();
            UnhighlightCandidates();
            TurnOffCandidates();
            UncolorNodes();
            UncolorLockedSet();
            UnhighlightChains();
            UnhighlightALSs();
            UnhighlightRCCs();
            UnhighlightChainInteractionNodes();
        };
        this.PropagateFinalValue = function(row, column, useInitial) {
            let value;
            if (useInitial === true) {
                value = Model.initialValues[row][column];
            } else {
                value = Model.currentValues[row][column];
            }
            if (value === "") {
                return;
            }
            TurnOffCandidatesInThisRow(row, column, value);
            TurnOffCandidatesInThisColumn(row, column, value);
            TurnOffCandidatesInThisCell(row, column);
            TurnOffCandidatesInThisArea(row, column, value);
        };
        const HighlightCandidates = () => {
            const highlightCandidates = displaydata.getElementsByTagName("CandidatesToHighlight");
            if (highlightCandidates.length === 0) {return;}
            const candidates = highlightCandidates[0].getElementsByTagName("CandidateID");
            const candidateColor = highlightColor;
            ColorCandidates(candidates, candidateColor);
        };
        const UnhighlightCandidates = () => {
            const unhighlightCandidates = displaydata.getElementsByTagName("CandidatesToHighlight");
            if (unhighlightCandidates.length === 0) {return;}
            const candidates = unhighlightCandidates[0].getElementsByTagName("CandidateID");
            UncolorCandidates(candidates);
        };
        const HighlightALSs = () => {
            const ALSs = displaydata.getElementsByTagName("AlmostLockedSet");
            if (ALSs.length === 0) {return;}
            for (let i = 0; i < ALSs.length; i++) {
                const ALS = ALSs[i];
                const candidates = ALS.getElementsByTagName("CandidateID");
                const candidateColor = TFBackgroundColor[i];
                ColorCandidates(candidates, candidateColor);
            }
        };
        const UnhighlightALSs = () => {
            const ALSs = displaydata.getElementsByTagName("AlmostLockedSet");
            if (ALSs.length === 0) {return;}
            for (let i = 0; i < ALSs.length; i++) {
                const ALS = ALSs[i];
                const candidates = ALS.getElementsByTagName("CandidateID");
                UncolorCandidates(candidates);
            }
        };
        const HighlightRCCs = () => {
            const nodesToColor = displaydata.getElementsByTagName("RestrictedCommonCandidates");
            if (nodesToColor.length === 0) {return;}

            const nodePairs = nodesToColor[0].getElementsByTagName("NodePair");
            for (let i = 0; i < nodePairs.length; i++) {
                const nodePair = nodePairs[i];
                const nodes = nodePair.getElementsByTagName("Node");
                const color = Model.interchainColor;
                HighlightCandidateBorders(nodes,color);

                const canvas = new Canvas(Model);
                canvas.CreateInterchainSegments(nodes, Model.interchainColor);
            }
        };
        const UnhighlightRCCs = () => {
            const nodesToColor = displaydata.getElementsByTagName("RestrictedCommonCandidates");
            if (nodesToColor.length === 0) {return;}
            const nodePairs = nodesToColor[0].getElementsByTagName("NodePair");
            for (let i = 0; i < nodePairs.length; i++) {
                const nodes = nodesToColor[0].getElementsByTagName("Node");
                const color = Model.initialColor;
                HighlightCandidateBorders(nodes,color);
            }
        };
        const HighlightChains = () => {
            const chainsTag = displaydata.getElementsByTagName("Chains");
            if (chainsTag.length === 0) {return;}
            const chains = chainsTag[0].getElementsByTagName("Chain");
            for (let i = 0; i < chains.length; i++) {
                const chain = chains[i];
                const nodes = chain.getElementsByTagName("Node");
                for (let j = 0; j < nodes.length; j++) {
                    const node = nodes[j];
                    const nodeColor = parseInt(node.getElementsByTagName("Color")[0].childNodes[0].nodeValue, 10);
                    const candidateColor = TFBackgroundColor[nodeColor + (2 * i)];
                    const candidates = node.getElementsByTagName("CandidateID");
                    ColorCandidates(candidates, candidateColor);
                }
                const color = TFBackgroundColor[1 + (2 * i)];
                const canvas = new Canvas(Model);
                canvas.AddChainNodes (nodes, color);
            }
        };
        const UnhighlightChains = () => {
            const chainsTag = displaydata.getElementsByTagName("Chains");
            if (chainsTag.length === 0) {return;}
            const chains = chainsTag[0].getElementsByTagName("Chain");
            for (let i = 0; i < chains.length; i++) {
                const chain = chains[i];
                const nodes = chain.getElementsByTagName("Node");
                for (let j = 0; j < nodes.length; j++) {
                    const node = nodes[j];
                    const candidates = node.getElementsByTagName("CandidateID");
                    UncolorCandidates(candidates);
                }
            }

        };
        const HighlightChainInteractionNodes = () => {
            const nodesToColor = displaydata.getElementsByTagName("ChainInteractionNodes");
            if (nodesToColor.length === 0) {return;}

            const nodePairs = nodesToColor[0].getElementsByTagName("NodePair");
            for (let i = 0; i < nodePairs.length; i++) {
                const nodePair = nodePairs[i];
                const nodes = nodePair.getElementsByTagName("Node");
                const color = Model.interchainColor;
                HighlightCandidateBorders(nodes,color);

                const canvas = new Canvas(Model);
                canvas.CreateInterchainSegments(nodes, Model.interchainColor);
            }
        };
        const UnhighlightChainInteractionNodes = () => {
            const nodesToColor = displaydata.getElementsByTagName("ChainInteractionNodes");
            if (nodesToColor.length === 0) {return;}
            const nodePairs = nodesToColor[0].getElementsByTagName("NodePair");
            for (let i = 0; i < nodePairs.length; i++) {
                const nodes = nodesToColor[0].getElementsByTagName("Node");
                const color = Model.initialColor;
                HighlightCandidateBorders(nodes,color);
            }
        };

        const ColorNodes = () => {
            const nodesToColor = displaydata.getElementsByTagName("Nodes");
            if (nodesToColor.length === 0) {return;}
            const nodes = nodesToColor[0].getElementsByTagName("Node");
            const canvas = $("#canvas")[0];
            const context = canvas.getContext("2d");
            context.beginPath();
            const canvasJS = new Canvas(Model);
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const candidates = node.getElementsByTagName("CandidateID");
                const candidateColor = TFBackgroundColor[i];
                ColorCandidates(candidates, candidateColor);
                canvasJS.CreateNodeShape(node, TFBackgroundColor[(2 *i) + 1]);
            }
            context.closePath();
        };
        const UncolorNodes = () => {
            const nodes = displaydata.getElementsByTagName("Node");
            if (nodes.length === 0) {return;}

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const candidates = node.getElementsByTagName("CandidateID");
                UncolorCandidates(candidates);
            }
        };
        const ColorLockedSet = () => {
            const lockedSet = displaydata.getElementsByTagName("LockedSet");
            if (lockedSet.length === 0) {return;}
            const candidates = lockedSet[0].getElementsByTagName("CandidateID");
            const candidateColor = TFBackgroundColor[0];
            ColorCandidates(candidates, candidateColor);
        };
        const UncolorLockedSet = () => {
            const lockedSet = displaydata.getElementsByTagName("LockedSet");
            if (lockedSet.length === 0) {return;}
            const candidates = lockedSet[0].getElementsByTagName("CandidateID");
            UncolorCandidates(candidates);
        };
        const TurnOffCandidates = () => {
            const finalValues = displaydata.getElementsByTagName("CandidatesToTurnOnOrOff");
            if (finalValues.length === 0) {return;}
            const candidates = finalValues[0].getElementsByTagName("CandidateID");
            const display = new Display(Model);
            for (let i = 0; i < candidates.length; i++) {
                const turnOffCandidate = candidates[i];
                const hash = turnOffCandidate.childNodes[0].nodeValue;
                const row = constants.RowFromHash(hash);
                const column = constants.ColumnFromHash(hash);
                const value = constants.ValueFromHash(hash);

                const symbol = constants.SymbolAtPosition(value);
                const newPencilMark = display.RemovePencilMarkString(row, column, symbol);
                Model.currentPencilMarks[row][column] = newPencilMark;

                display.HideCandidate(hash);

                const candidateID = "#candidate" + hash;
                const candidateToHighlight = $(candidateID)[0];
                const candidateBackground = new CandidateBackground(Model);
                const background = candidateBackground.ResetCandidateBackgroundColor(hash);
                candidateToHighlight.style.background = background;
            }
        };

        const TurnOnFinalValues = () => {
            const finalValues = displaydata.getElementsByTagName("FinalValues");
            if (finalValues.length === 0) {return;}
            const candidates = finalValues[0].getElementsByTagName("CandidateID");
            const display = new Display(Model);
            for (let i = 0; i < candidates.length; i++) {
                const finalCandidate = candidates[i];
                const hash = finalCandidate.childNodes[0].nodeValue;
                const row = constants.RowFromHash(hash);
                const column = constants.ColumnFromHash(hash);
                const value = constants.ValueFromHash(hash);

                const symbol = constants.SymbolAtPosition(value);
                const newPencilMark = display.RemovePencilMarkString(row, column, symbol);
                Model.currentPencilMarks[row][column] = newPencilMark;

                Model.currentValues[row][column] = symbol;
                display.TurnOffCandidateTable(row, column);
                display.TurnOnFinalValue(row, column);

                const finalValueID = "#finalValuerow" + row + "column" + column;
                const finalValue = $(finalValueID)[0];
                finalValue.innerHTML = symbol;
                finalValue.style.color = Model.subsequentValueColor;
                this.PropagateFinalValue(row, column, false);
            }
        };
        const UpdateDocs = () => {
            const docElement = $("#docs")[0];
            Model.currentDocs = docElement.value;

            const docs = displaydata.getElementsByTagName("Docs");
            if (docs.length === 0) {return;}
            const docsToAdd = docs[0].getElementsByTagName("Document");
            let totalText = "";
            for (let i = 0; i < docsToAdd.length; i++) {
                const docToAdd = docsToAdd[i];
                const texts = docToAdd.getElementsByTagName("Text");
                const text = texts[0].childNodes[0].nodeValue;
                const styles = docToAdd.getElementsByTagName("Style");
                const style = styles[0].childNodes[0].nodeValue;
                totalText += text;
            }
            docElement.value = totalText + docElement.value;
        };
        const CheckIfDone = () => {
            const isPuzzleDone = displaydata.getElementsByTagName("IsPuzzleDone");
            if (isPuzzleDone.length === 0) {return;}
            const boolIsPuzzleDone = isPuzzleDone[0].childNodes[0].nodeValue;
            if (boolIsPuzzleDone === "true") {
                const buttonStateControl = new ButtonStateControl(Model);
                buttonStateControl.DisableStep();
            }
        };
        const HighlightCandidateBorders = function(nodes, color) {
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                const candidates = node.getElementsByTagName("CandidateID");
                for (let j = 0; j < candidates.length; j++) {
                    const candidate = candidates[j];
                    const candidateID = "#candidate" + candidate.childNodes[0].nodeValue;
                    const candidateToHighlight = $(candidateID)[0];
                    candidateToHighlight.style.borderColor = color;
                }
            }

        };
        const ColorCandidates = function(candidates, color) {
            for (let i = 0; i < candidates.length; i++) {
                const candidate = candidates[i];
                const hash = candidate.childNodes[0].nodeValue;
                const candidateID = "#candidate" + hash;
                const candidateToHighlight = $(candidateID)[0];

                const candidateBackground = new CandidateBackground(Model);
                const background = candidateBackground.AddCandidateBackgroundColor(hash, color);
                candidateToHighlight.style.background = background;
            }
        };
        const UncolorCandidates = function(candidates) {
            for (let i = 0; i < candidates.length; i++) {
                const candidate = candidates[i];
                const hash = candidate.childNodes[0].nodeValue;
                const candidateID = "#candidate" + hash;
                const candidateToHighlight = $(candidateID)[0];
                const candidateBackground = new CandidateBackground(Model);
                const background = candidateBackground.ResetCandidateBackgroundColor(hash);
                candidateToHighlight.style.background = background;
            }
        };
        const TurnOffCandidatesInThisRow = (row, column, value) => {
            const display = new Display(Model);
            for (let candidateColumn = 0; candidateColumn < Model.numberOfClues; candidateColumn++) {
                if (column === candidateColumn) {
                    continue;
                }
                const candidateValue = constants.PositionForSymbol(value);
                const hash = constants.Hash(row, candidateColumn, candidateValue);
                display.HideCandidate(hash);
                const newPencilMark = display.RemovePencilMarkString(row, candidateColumn, value);
                Model.initialPencilMarks[row][candidateColumn] = newPencilMark;
                Model.currentPencilMarks[row][candidateColumn] = newPencilMark;
            }
        };
        const TurnOffCandidatesInThisColumn = (row, column, value) => {
            const display = new Display(Model);
            for (let candidateRow = 0; candidateRow < Model.numberOfClues; candidateRow++) {
                let candidateValue = constants.PositionForSymbol(value);
                let hash = constants.Hash(candidateRow, column, candidateValue);
                const candidateTableID = "#candidateTablerow" + candidateRow + "column" + column;
                const candidateTable = $(candidateTableID)[0];
                if (candidateTable.style.visibility === "visible") {
                    display.ShowCandidate(hash);
                }
                if (row === candidateRow) {
                    continue;
                }
                candidateValue = constants.PositionForSymbol(value);
                hash = constants.Hash(candidateRow, column, candidateValue);
                display.HideCandidate(hash);
                const newPencilMark = display.RemovePencilMarkString(candidateRow, column, value);
                Model.initialPencilMarks[candidateRow][column] = newPencilMark;
                Model.currentPencilMarks[candidateRow][column] = newPencilMark;
            }
        };
        const TurnOffCandidatesInThisCell = (row, column) => {
            const display = new Display(Model);
            for (let candidateValue = 0; candidateValue < Model.numberOfClues; candidateValue++) {
                const hash = constants.Hash(row, column, candidateValue);
                display.HideCandidate(hash);
                const candidateSymbol = constants.SymbolAtPosition(candidateValue);
                const newPencilMark = display.RemovePencilMarkString(row, column, candidateSymbol);
                Model.initialPencilMarks[row][column] = newPencilMark;
                Model.currentPencilMarks[row][column] = newPencilMark;
            }
        };
        const TurnOffCandidatesInThisArea = (row, column, value) => {
            const area = constants.AreaForRowAndColumn(row, column);
            const index = constants.IndexForRowAndColumn(row, column);
            const candidateValue = constants.PositionForSymbol(value);
            const display = new Display(Model);
            for (let candidateIndex = 0; candidateIndex < Model.numberOfClues; candidateIndex++) {
                if (index === candidateIndex) {
                    continue;
                }
                const candidateRow = constants.RowForAreaAndIndex(area, candidateIndex);
                const candidateColumn = constants.ColumnForAreaAndIndex(area, candidateIndex);
                const hash = constants.Hash(candidateRow, candidateColumn, candidateValue);
                display.HideCandidate(hash);
                const newPencilMark = display.RemovePencilMarkString(candidateRow, candidateColumn, value);
                Model.initialPencilMarks[candidateRow][candidateColumn] = newPencilMark;
                Model.currentPencilMarks[candidateRow][candidateColumn] = newPencilMark;
            }
        };
        const highlightColor =  "green";
        const TFBackgroundColor = [ 
            "rgb(200,208,255)",//alice blue darker
            "rgb( 30,144,255)",//dodger blue
    //         "rgb( 32,178,170)",//light sea green
    //         "rgb(143,188,143)",//dark sea green
            "rgb(255,192,203)",//pink
            "rgb(255,  0,255)",//magenta
            "rgb(180,180,180)",//light gray
            "rgb(70,70,70)",//dark gray
            "rgb(128,  0,  0)",//maroon
            "rgb(255,  0,  0)",//red
            "rgb(128,  0,128)",//purple
            "rgb(255,  0,255)",//fuchsia
            "rgb( 50,205, 50)",//lime green
            "rgb(  0,255,  0)",//lime
            "rgb(178, 34, 34)",//firebrick
            "rgb(139,  0,  0)" //dark red
        ];
    }
}
