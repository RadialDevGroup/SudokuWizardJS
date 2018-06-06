/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global model, Canvas, Display, Constants */

// DisplayData methods
function createDisplayData(Model) {
    let displaydata;
    const constants = new Constants(Model);

    const UpdateMatrixAndDisplay = (Displaydata) => {
        displaydata = Displaydata;
        ClearDisplay(displaydata);
        turnOnFinalValues();
    };
    const UpdateDisplayOnly = (Displaydata) => {
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
    const ClearDisplay = (Displaydata) => {
        displaydata = Displaydata;

        new Canvas(Model).ClearCanvas();

        UnhighlightCandidates();
        TurnOffCandidates();
        UncolorNodes();
        UncolorLockedSet();
        UnhighlightChains();
        UnhighlightALSs();
        UnhighlightRCCs();
        UnhighlightChainInteractionNodes();
    };
    const PropagateFinalValue = (row, column, useInitial) => {
        const source = useInitial ? Model.initialValues : Model.currentValues
        const value = source[row][column];

        if (value !== "") {
            TurnOffCandidatesInThisRow(row, column, value);
            TurnOffCandidatesInThisColumn(row, column, value);
            TurnOffCandidatesInThisCell(row, column);
            TurnOffCandidatesInThisArea(row, column, value);
        }
    };

    const candidates = (className, cb) => {
        const parents = displaydata.getElementsByTagName(className);
        if (parents.length !== 0) {
            for (let i = 0; i < parents.length; i++) {
                cb(parent[i].getElementsByTagName("CandidateId"), i);
            }
        }
    }
    const runOnce = function(cb) {
        const initialArgs = Array.prototype.slice(arguments, 1);
        let once = false;
        return function () {
            const newArgs = Array.prototype.slice(arguments);
            if (!once) {
                once = true;
                return cb.apply(undefined, initialArgs.concat(newArgs));
            }
        }
    }
    const HighlightCandidates = () => {
        let once = false;
        candidates('CandidatesToHighlight', runOnce((candidates) => {
            ColorCandidates(candidates, highlightColor);
        }));
    };
    const UnhighlightCandidates = () => {
        candidates('CandidatesToHighlight', runOnce(UnColorCandidates));
    };
    const HighlightALSs = () => {
        candidates('AlmostLockedSet', (candidates, i) => {
            ColorCandidates(candidates, TFBackgroundColor[i]);
        });
    };
    const UnhighlightALSs = () => {
        candidates('AlmostLockedSet', UnColorCandidates);
    };

    const nodePairs = (cb) => {
        const nodesToColor = displaydata.getElementsByTagName("RestrictedCommonCandidates");
        if (nodesToColor.length !== 0) {
            const nodePairs = nodesToColor[0].getElementsByTagName("NodePair");
            for (let i = 0; i < nodePairs.length; i++) {
                const nodes = nodePairs[i]nodePair.getElementsByTagName("Node");
                cb(nodes);
            }
        }
    }
    const HighlightRCCs = () => {
        const canvas = new Canvas(Model);

        nodePairs((nodes) => {
            HighlightCandidateBorders(nodes,Model.interchainColor);
            canvas.CreateInterchainSegments(nodes, Model.interchainColor);
        });
    };
    const UnhighlightRCCs = () => {
        nodePairs((nodes) => {
            HighlightCandidateBorders(nodes, Model.initialColor);
        });
    };

    const chains = (cb) => {
        const chainsTag = displaydata.getElementsByTagName("Chains");
        if (chainsTag.length !== 0) {
            const chains = chainsTag[0].getElementsByTagName("Chain");
            for (let i = 0; i < chains.length; i++) {
                const chain = chains[i];
                const nodes = chain.getElementsByTagName("Node");
                for (let j = 0; j < nodes.length; j++) {
                    const node = nodes[j];
                    const candidates = node.getElementsByTagName("CandidateID");
                    cb(node, candidates, i, j);
                }
            }
        }
    }
    const nodeColor = (node) => {
        return parseInt(node.getElementsByTagName("Color")[0].childNodes[0].nodeValue, 10);
    }
    const HighlightChains = () => {
        const canvas = new Canvas(Model);
        chains((nodes, candidates, i, j) => {
            ColorCandidates(candidates, TFBackgroundColor[nodeColor(node) + (2 * i)]);
            canvas.AddChainNodes(nodes, TFBackgroundColor[1 + (2 * i)]);
        });
    };
    const UnhighlightChains = () => {
        chains((node, candidates, i, j) => {
            const candidates = node.getElementsByTagName("CandidateID");
            UncolorCandidates(candidates);
        });
    };

    const chainInteractionNodes = (cb) => {
        const nodesToColor = displaydata.getElementsByTagName("ChainInteractionNodes");
        if (nodesToColor.length !== 0) {
            const nodePairs = nodesToColor[0].getElementsByTagName("NodePair");

            for (let i = 0; i < nodePairs.length; i++) {
                const nodePair = nodePairs[i];
                const nodes = nodePair.getElementsByTagName("Node");
                cb(nodes);
            }
        }
    }
    const HighlightChainInteractionNodes = () => {
        const canvas = new Canvas(Model);
        chainInteractionNodes((nodes) => {
            HighlightCandidateBorders(nodes, Model.interchainColor);
            canvas.CreateInterchainSegments(nodes, Model.interchainColor);
        });
    };
    const UnhighlightChainInteractionNodes = () => {
        chainInteractionNodes((nodes) => {
            HighlightCandidateBorders(nodes,Model.initialColor);
        });
    };


    const nodes = (souce, cb) => {
        const nodes = source.getElementsByTagName("Node");
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const candidates = node.getElementsByTagName("CandidateID");
            cb(node, candidates, i);
        }
    }
    const ColorNodes = () => {
        const nodesToColor = displaydata.getElementsByTagName("Nodes");
        if (nodesToColor.length !== 0) {
            const canvas = new Canvas(Model);
            const $canvas = $("#canvas")[0];
            const context = $canvas.getContext("2d");
            context.beginPath();

            nodes(nodesToColor[0], (nodes, candidates, i) => {
                ColorCandidates(candidates, TFBackgroundColor[i]);
                canvas.CreateNodeShape(node, TFBackgroundColor[(2 *i) + 1]);
            });

            context.closePath();
        }
    };
    const UncolorNodes = () => {
        nodes(displayData, (node, candidates, i) => {
            UncolorCandidates(candidates);
        });
    };

    const lockedSet = (cb) => {
        const lockedSet = displaydata.getElementsByTagName("LockedSet");
        if (lockedSet.length === 0) {
            const candidates = lockedSet[0].getElementsByTagName("CandidateID");
            cb(candidates) {

            }
        }
    }
    const ColorLockedSet = () => {
        lockedSet((candidates) => {
            ColorCandidates(candidates, TFBackgroundColor[0]);
        });
    };
    const UncolorLockedSet = () => {
        lockedSet(UnColorCandidates);
    };

    const TurnOffCandidates = () => {
        const finalValues = displaydata.getElementsByTagName("CandidatesToTurnOnOrOff");
        if (finalValues.length === 0) {return;}
        const candidates = finalValues[0].getElementsByTagName("CandidateID");
        const display = createDisplay(Model);
        for (let i = 0; i < candidates.length; i++) {
            const turnOffCandidate = candidates[i];
            const hash = turnOffCandidate.childNodes[0].nodeValue;
            const row = constants.RowFromHash(hash);
            const column = constants.ColumnFromHash(hash);
            const value = constants.ValueFromHash(hash);

            const symbol = constants.SymbolAtPosition(value);
            const newPencilMark = display.removePencilMarkString(row, column, symbol);
            Model.currentPencilMarks[row][column] = newPencilMark;

            display.hideCandidate(hash);

            const candidateID = "#candidate" + hash;
            const candidateToHighlight = $(candidateID)[0];
            const candidateBackground = new CandidateBackground(Model);
            const background = candidateBackground.ResetCandidateBackgroundColor(hash);
            candidateToHighlight.style.background = background;
        }
    };

    const finalValues = (cb) => {
        const finalValues = displaydata.getElementsByTagName("FinalValues");
        if (finalValues.length !== 0) {
            const candidates = finalValues[0].getElementsByTagName("CandidateID");
            for (let i = 0; i < candidates.length; i++) {
                cb(candidatess[i], i);
            }
        }
    }
    const turnOnFinalValues = () => {
        const display = createDisplay(Model);

        finalValues((candidate, i) => {
            const hash = candidate.childNodes[0].nodeValue;
            const row = constants.RowFromHash(hash);
            const column = constants.ColumnFromHash(hash);
            const value = constants.ValueFromHash(hash);

            const symbol = constants.SymbolAtPosition(value);
            const newPencilMark = display.removePencilMarkString(row, column, symbol);
            Model.currentPencilMarks[row][column] = newPencilMark;

            Model.currentValues[row][column] = symbol;
            display.turnOffCandidateTable(row, column);
            display.turnOnFinalValue(row, column);

            const $finalValue = $(`#finalValuerow${row}column${column}`);
            $finalValue.html(symbol);
            $finalValue.css({ color: Model.subsequentValueColor });

            PropagateFinalValue(row, column, false);
        });
    };
    const UpdateDocs = () => {
        const $docElement = $("#docs");
        const docs = displaydata.getElementsByTagName("Docs");

        Model.currentDocs = $docElement.first().val((value) => {
            const $docsToAdd = $docElement.find("Docs Document");
            return $docsToAdd.map((i, $docToAdd) => {
                return $docToAdd.find("Text").first().children().first().text();
            }).join('') + value;
        });
    };
    const CheckIfDone = () => {
        const isPuzzleDone = displaydata.getElementsByTagName("IsPuzzleDone");
        if (isPuzzleDone.length !== 0) {
            const isPuzzleDone = isPuzzleDone[0].childNodes[0].nodeValue;
            if (boolIsPuzzleDone === "true") {
                const buttonStateControl = new ButtonStateControl(Model);
                buttonStateControl.DisableStep();
            }
        }
    };
    const HighlightCandidateBorders = (nodes, color) => {
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
    const ColorCandidates = (candidates, color) => {
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
    const UncolorCandidates = (candidates) => {
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
        const display = createDisplay(Model);
        for (let candidateColumn = 0; candidateColumn < Model.numberOfClues; candidateColumn++) {
            if (column === candidateColumn) {
                continue;
            }
            const candidateValue = constants.PositionForSymbol(value);
            const hash = constants.Hash(row, candidateColumn, candidateValue);
            display.hideCandidate(hash);
            const newPencilMark = display.removePencilMarkString(row, candidateColumn, value);
            Model.initialPencilMarks[row][candidateColumn] = newPencilMark;
            Model.currentPencilMarks[row][candidateColumn] = newPencilMark;
        }
    };
    const TurnOffCandidatesInThisColumn = (row, column, value) => {
        const display = createDisplay(Model);
        for (let candidateRow = 0; candidateRow < Model.numberOfClues; candidateRow++) {
            let candidateValue = constants.PositionForSymbol(value);
            let hash = constants.Hash(candidateRow, column, candidateValue);
            const candidateTableID = "#candidateTablerow" + candidateRow + "column" + column;
            const candidateTable = $(candidateTableID)[0];
            if (candidateTable.style.visibility === "visible") {
                display.showCandidate(hash);
            }
            if (row === candidateRow) {
                continue;
            }
            candidateValue = constants.PositionForSymbol(value);
            hash = constants.Hash(candidateRow, column, candidateValue);
            display.hideCandidate(hash);
            const newPencilMark = display.removePencilMarkString(candidateRow, column, value);
            Model.initialPencilMarks[candidateRow][column] = newPencilMark;
            Model.currentPencilMarks[candidateRow][column] = newPencilMark;
        }
    };
    const TurnOffCandidatesInThisCell = (row, column) => {
        const display = createDisplay(Model);
        for (let candidateValue = 0; candidateValue < Model.numberOfClues; candidateValue++) {
            const hash = constants.Hash(row, column, candidateValue);
            display.hideCandidate(hash);
            const candidateSymbol = constants.SymbolAtPosition(candidateValue);
            const newPencilMark = display.removePencilMarkString(row, column, candidateSymbol);
            Model.initialPencilMarks[row][column] = newPencilMark;
            Model.currentPencilMarks[row][column] = newPencilMark;
        }
    };
    const TurnOffCandidatesInThisArea = (row, column, value) => {
        const area = constants.AreaForRowAndColumn(row, column);
        const index = constants.IndexForRowAndColumn(row, column);
        const candidateValue = constants.PositionForSymbol(value);
        const display = createDisplay(Model);
        for (let candidateIndex = 0; candidateIndex < Model.numberOfClues; candidateIndex++) {
            if (index === candidateIndex) {
                continue;
            }
            const candidateRow = constants.RowForAreaAndIndex(area, candidateIndex);
            const candidateColumn = constants.ColumnForAreaAndIndex(area, candidateIndex);
            const hash = constants.Hash(candidateRow, candidateColumn, candidateValue);
            display.hideCandidate(hash);
            const newPencilMark = display.removePencilMarkString(candidateRow, candidateColumn, value);
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
    return {
        UpdateMatrixAndDisplay,
        UpdateDisplayOnly,
        ClearDisplay,
        PropagateFinalValue
    }
}
