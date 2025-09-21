let logList = [];

// console.logの出力をログリストに保存
function logToTxt(message){
    const timeStamp = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }); // タイムスタンプを取得
    logList.push([timeStamp, message]);  // ログにメッセージとタイムスタンプを保存
};


// Excelとして保存する関数
function saveLogsToExcel(){
    logToTxt("Workspace information:" + plantUmlText); // ログファイル取得時のワークスペースの情報をplantUML形式で取得
    const workSheet = XLSX.utils.aoa_to_sheet([["timeStamp", "Message"], ...logList]);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Logs");

    // Excelファイルを保存
    XLSX.writeFile(workBook, "test.xlsx");
};


function resolveBlockName(block,blockType){
    let result = "";
    const blockTypeMap  = new Map([
        ["firstDefinitionType",'Start at "InitialState"'],
        ["switchIfType","If event ~ occurs"],
        ["switchElseIfType","Else, when current state is"],
        ["stateActionType","Behavior when state is ~"],
        ["changeStateType",""],
        ["customControlsIfType","If event occurs"],
        ["customControlsElseIfType","Else, if event ~ occurs"],
        ["guardIfType","If condition ~ holds"],
        ["guardElseIfType","Else, if condition ~ holds"],
        ["effectType","~ takes effect"],
        ["initialStateType","InitialState"],
        ["finalStateType","FinalState"],
        // ["stateDefinitionType",{key:""}],
        ["entryType","At start ~"],
        ["doContinuousType","Continuously ~"],
        ["doOnetimeType","Only once ~"],
        ["exitType","At End ~"],
        ["completeEvent","State action completion"],
        // ["checkComputationType",{key:""}],
        // ["logicalOperationsType",{key:""}],
        // ["NegationType",{key:""}],
        // ["valueChangeType",{key:""}]
    ]);

    readBlockList = ["stateDefinitionType","checkComputationType","logicalOperationsType","NegationType","valueChangeType"];
    properNounList = ["event","guard","effect","behavior","variable"];

    if(blockTypeMap.has(blockType)){
        result = blockTypeMap.get(blockType);
    }
    else if(readBlockList.some(keyWord => keyWord.includes(blockType))){
        result = "readBlock";
    }
    else if(properNounList.some(keyWord => blockType.includes(keyWord))){
        result = "properNoun";
    }
    console.log(result);
}

// export { logToExcel, saveLogsToExcel };

