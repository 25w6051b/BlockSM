
// 画面上のボタンを作成
if (eventNames.length > 0){
    const container = document.querySelector('.button-group');
    for (let i = 0; i < eventNames.length; i++){
        const button = document.createElement('button');
        button.classList.add('mode-blockly','button','event-button');  // 必要なクラスを追加
        button.id = `event${i}`;  // IDを設定
        button.textContent = eventNames[i];  // ボタンのテキストを設定
        container.appendChild(button);
    }
}


// 各イベントが起きた時かどうかを判定する変数 起きたらtrue，起きてなかったらfalse
for (let i = 0; i < eventNames.length; i++) {
  eventNames[`eventKey${i}`] = false;
}

let completeEventKey = false;

// イベントボタンにイベントリスナーを設定
for (let i = 0; i < eventNames.length; i++) {
    document.querySelector(`#event${i}`).addEventListener('click', () => {handleEventAction(i);});
}


// イベントボタンが押されたときの処理を設定する関数
function handleEventAction(eventnumber){
    if(testKey == true){
        if(currentState == "FinalState"){
            handleExitState();
        }
        else{
            eventNames[`eventKey${eventnumber}`] = true;
            logToTxt('"' + eventNames[eventnumber] + '" was triggered and executed');
            logMessage("------------------------------------------------------",logDiv);
            logMessage('"' + eventNames[eventnumber] + '" was triggered and executed',logDiv);

            let temporaryState = currentState;
            let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
            codea = classCode + code;
            try {
                console.log(codea);
                eval(codea);
            currentCondition();
            } catch (error) {
                console.log(error);
            }
            classCode = "";
            eventNames[`eventKey${eventnumber}`] = false;  
            hasInvalidBlocks = false; // ボタンが押されるたびにブロックが正しく接続されているか確認するため

            // 「動き」ブロックに関するの画像とログを変更する
            // let previousStateBhavior = containsBehavior(temporaryState);
            // let currentStateBhaivior = containsBehavior(currentState);
            // // if(currentStateBhaivior.every(value => value == false)){
            // //      showMotion("exit",temporaryState);
            // //      setTimeout(() => {
            // //         // 「動き」に関する画像やログもリセット
            // //         logContainer.innerHTML = "ここに現在の「動き」が表示されます" // behaiviorLogをリセット
            // //         let imgElement = imgContainer.querySelector("img");
            // //         imgElement.src = "img/白画像.png"; // 画像も白画像に差し替える
            // //      },3000)
            // // }
            // // else{
            // runMotionSequence(temporaryState,previousStateBhavior[2],currentStateBhaivior[0],3000)//「動き」の画像とログを出力するための関数
            // }
        }
    }
    else {
        logToTxt('Press the "Simulation" button first');
        logMessage("------------------------------------------------------",logDiv);
        logMessage('Press the "Simulation" button first',logDiv);
    }
}



// 「イベントなし」ボタンが押されたときの処理を設定する関数
function handleNonEventAction(eventnumber){
    if(testKey == true){
        if(currentState == "FinalState"){
            handleExitState();
        }
        else{
            completeEventKey = true;
            logToTxt('"completionEvent" was triggered and executed');
            logMessage("------------------------------------------------------",logDiv);
            logMessage('"completionEvent" was triggered and executed',logDiv);

            let temporaryState = currentState;
            let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
            codea = classCode + code;
            try {
            console.log(codea);
                eval(codea);
            currentCondition();
            } catch (error) {
                console.log(error);
                console.log(error.stack);
            }
            classCode = "";
            completeEventKey = false;
            hasInvalidBlocks = false; // ボタンが押されるたびにブロックが正しく接続されているか確認するため
            
            // 「動き」ブロックに関するの画像とログを変更する
            // let previousStateBhavior = containsBehavior(temporaryState);
            // let currentStateBhaivior = containsBehavior(currentState);
            // // if(currentStateBhaivior.every(value => value == false)){
            // //      showMotion("exit",temporaryState);
            // //      setTimeout(() => {
            // //         // 「動き」に関する画像やログもリセット
            // //         logContainer.innerHTML = "ここに現在の「動き」が表示されます" // behaiviorLogをリセット
            // //         let imgElement = imgContainer.querySelector("img");
            // //         imgElement.src = "img/白画像.png"; // 画像も白画像に差し替える
            // //      },3000)
            // // }
            // // else{
            // runMotionSequence(temporaryState,previousStateBhavior[2],currentStateBhaivior[0],3000)//「動き」の画像とログを出力するための関数
            // }
        }
    }
    else {
        logToTxt('Press the "Simulation" button first');
        logMessage("------------------------------------------------------",logDiv);
        logMessage('Press the "Simulation" button first',logDiv);
    }
}

let testPressedKey = 0;

// 「動作テスト」ボタンが押されたときに実行される
function functionalTest() {
    logToTxt('"Simulation" button was pressed');
    logMessage("------------------------------------------------------",logDiv);
    logMessage('"Simulation" button was pressed',logDiv);
    testKey = true;
    currentCondition();
    // var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    // var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    // var blockTags = xmlText.match(/<block[\s\S]*?<\/block>/g);
    // console.log(blockTags);  // 配列として出てくる
    // localStorage.setItem("testPressedDataKey",blockTags);
}

// 「リセット」ボタンが押されたときに実行される
function resetLogData(){
    logToTxt('"Reset" button was pressed');
    logMessage("---------------------------------------------------",logDiv);
    logMessage('"Reset" button was pressed',logDiv);
    // 初期化関数
    currentState = ""; 
    currentStatebutton = false; 
    finalStateKey = false; 
    switchKey = false;
    initialStateKey = false;
    testKey = false;
    hasInvalidBlocks = false;

    // ワークスペースを取得
    var workSpace = Blockly.getMainWorkspace();

    // ワークスペース内のすべてのブロックを取得
    var allBlocks = workSpace.getAllBlocks();

    // 各ブロックをループして、typeが"firstDefinitionType"であるものの色を変更
    allBlocks.forEach(function(block) {
        if (block.type === "firstDefinitionType") {  // 特定のブロックタイプを確認
            block.setColour("#800080");  
        }
        if (block.type === "stateDefinition") {  // 特定のブロックタイプを確認
            block.setColour("#FF69B4");  
        }
    });

    for (let i = 0; i < variableNames.length; i++){
        variableNames[`variableKey${i}`] = "";
    }

    // 必要ならログやUIもリセット
    logDiv.innerHTML = "The execution result will be displayed here"; 
    // 「動き」に関する画像やログもリセット
    // logContainer.innerHTML = "ここに現在の「動き」が表示されます" // behaiviorLogをリセット
    // let imgElement = imgContainer.querySelector("img");
    // imgElement.src = "img/白画像.png"; // 画像も白画像に差し替える
    currentCondition();
}


// 「データの保存」ボタンを押下時に保存データのメニューを追加する関数
function createSaveItem() {
    logToTxt('"Save Data" button was pressed');
    var inputValue = document.getElementById('saveNameInput').value; // 入力領域から保存名を取得
    var localStorageKeyList = [];
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');

    for (let i = 0; i < localStorage.length; i++) {
        localStorageKeyList.push(localStorage.key(i)); 
    };

    if(blockTags == "<xml></xml>"){
        alert('No blocks have been placed.\nThe save feature becomes available once blocks are placed.');
        logToTxt('No blocks have been placed.\nThe save feature becomes available once blocks are placed.');
    }
    else if(inputValue == ""){
        alert('"Save name" has not been entered.\nPlease enter a "Save name".');
        logToTxt('"Save name" has not been entered.\nPlease enter a "Save name".');
    }
    else if(localStorageKeyList.includes(inputValue)){
        alert('The same "Save name" already exists.\nPlease enter a different "Save name".');
        logToTxt('The same "Save name" already exists.\nPlease enter a different "Save name".');
    }
    else{
        saveXmlData(inputValue); // 入力された情報をキーとしてローカルストレージに保存
        logToTxt(`"Data name "${inputValue}" has been saved."`);
        addOptionToSelect(inputValue); // 「データの復元」のメニューに入力された保存名を追加
    };
    displayStyle("inputSaveNameContainer","saveNameInput"); // 保存後は入力領域を見えなくする
};


// 「データを復元」プルダウンメニューが選択されたときに実行される関数
function handleRestoreChange() {
    // 選択肢を変更したときに、最初の選択肢をデフォルトに戻す
    const selectedOption = event.target.options[event.target.selectedIndex]; // 選ばれた <option> を取得
    const selectedOptionId = selectedOption.id; // 選ばれた <option> の id を取得
    getXmlData(selectedOptionId); // ローカルストレージのキーと <option>のidは一致するので，idでローカルストレージのデータを取りだしワークスペースに適用する
    logToTxt(`"Data name "${selectedOptionId}" has been restored."`);
    restoreMenu.selectedIndex = 0;  // プルダウンメニューを最初の「データを復元」に戻す
}



// 「データの削除」ボタン押下時にデータの削除を行う関数
function deleteSaveItem() {
    var inputValue = document.getElementById('deleteNameInput').value; // 入力領域から保存名を取得
    var localStorageKeyList = []; // ローカルストレージのキー値を追加するリスト
    // ローカルストレージのキーをリストに追加
    for (let i = 0; i < localStorage.length; i++) {
        localStorageKeyList.push(localStorage.key(i)); 
    };
    
    // 入力された値がローカルストレージのキーと一致するかを確認し，存在すれば削除する
    if(localStorageKeyList.includes(inputValue)){
        logToTxt('"Delete Data" button was pressed');
        localStorage.removeItem(inputValue); // 該当のキーとデータを削除
        // データの復元ボタン内のキー値も削除
        for(let i = 0; i < restoreMenu.options.length; i++ ){
            let optionName = restoreMenu.options[i];
            if (optionName.id == inputValue){
                restoreMenu.removeChild(optionName);
                logToTxt(`"Data name "${inputValue}" has been deleted."`);
                break;
            }
        }
    }
    else{
        logToTxt(`"Data name "${inputValue}" does not exist and cannot be deleted."`);
        alert(`"Data name "${inputValue}" does not exist and cannot be deleted."`);
    };

    displayStyle("inputdeleteNameContainer","deleteNameInput"); // 削除後は入力領域を見えなくする
}



// 「図に変換」ボタンが押されたときに実行される
function stmbpToPuml() {
    const container = document.getElementById("imageModel");
    skipModelConversion = false; // エラー発生時にtrueとなる変数
    undefinedStateNumber = 0; // 未定義の状態数を数える変数
    // container.innerHTML = ""; // 中身を差し替えるために以前の画像は削除する
    pbJson = [];
    const blocks = blockspace.getAllBlocks(); // 最上位ブロック（workspace上の一番上）を取得
    // let stateName = "";
    
    blocks.sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y); // Y座標順にソート（上にある順）

    // 初期状態がないとステートマシン図にならないので，最初に追加(myselfプロパティはfalseとする)

    pbJson.push({"state": "InitialState"});  //nameとinputValueをpbJsonに追加
    let target = pbJson.find(item => item.state == "InitialState");
    target.transition = []; // 初期状態内に[transition]が無ければ追加
    target.myself = {}; // 初期状態内に[myself]が無ければ追加
    target.myself["condition"] = "false"; // [transition]に対応するフィールドと要素を追加
    

    // 各ブロックが「状態を遷移を定義するブロック」か「状態の振る舞いを定義するブロック」かを確認する
    // 状態名を抽出して，その状態下の遷移と振る舞いをpbJsonに追加していく
    blocks.forEach(block => {
        let transitionCount = 0; //各状態における遷移の数を数える変数
        if (block.type == "firstDefinitionType"){
            target.myself["condition"] = "true"; // [transition]に対応するフィールドと要素を追加
        
        }
        // 状態の遷移を設定している場合
        else if (block.type == "switchIfType" || block.type == "switchElseIfType") {
            let stateName = exploreStateBlocks(block, "IF0"); // 状態名を取得する
            const directChildren = []; // if,elseとなるブロックの情報を格納
            const deeperChildren = []; // 2階層目のブロック(すなわちイベント，複数のガードとなっていた場合)の情報を格納
            let ifCount = 0;
            // ブロックの中にif,elseのブロックがないか探索する
            // inputListはブロックのif,do部分の情報を取得する，この場合ダミーの装飾？も含めて3つある
            block.inputList.forEach(input => {
                const connected = input.connection?.targetBlock(); // 一番外のブロック情報を取得，その後このブロックと同じ階層のブロックを取得する
                if (connected) {
                    // 一番外のブロックがイベントやガードにおけるif文であるか確認する
                    if(connected.type == "customControlsIfType" || connected.type == "guardIfType"){
                        let hasdeeperBlock = false;
                        connected.inputList.forEach(innerInput => {
                            const deeperBlock = innerInput.connection?.targetBlock(); // さらに1つ下のブロック 
                            // 二番目に外側のブロックがガードであるかを確認する
                            if (deeperBlock && deeperBlock.type == "guardIfType") {
                                hasdeeperBlock = true;
                                deeperChildren[ifCount] = [];
                                deeperChildren[ifCount].push(connected);
                                deeperChildren[ifCount].push(deeperBlock); // ガードブロックに関するブロックの情報を代入
                                addNextBlocksRecursively(deeperBlock, deeperChildren[ifCount]); // 再帰的にelseブロック情報を代入する
                            }
                        });
                        // 入れ子になっていないとき
                        if(hasdeeperBlock == false){
                            directChildren.push(connected); // if文に関するブロックの情報を代入
                            addNextBlocksRecursively(connected, directChildren); // 再帰的にelseブロック情報を代入する
                        }
                        // 入れ子になっているとき
                        else{
                            const next = connected.getNextBlock();
                            if(next && next.type == "customControlsElseIfType"){
                                hasNestedBlock(connected,deeperChildren,ifCount);
                            }
                        }
                    }
                }
            });

            // if,elseになる条件式が存在しない場合
            if(directChildren.length == 0 && deeperChildren.length == 0){ 
                exploreDoBlocks(block, "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
            }
            else if(directChildren.length != 0){
                // if,elseの条件式分，遷移が存在するためその数だけtransitionに追加
                directChildren.forEach(element => {
                    // 一番外側のブロックだけは個別に取得
                    let resultIf = exploreIfBlocks(element,"IF0"); // IF部分に含まれるブロック情報を取得
                    pbJsonPushDetail(stateName,element.type,resultIf,transitionCount); // pbJsonにブロックの情報を追加
                    exploreDoBlocks(element, "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                    transitionCount += 1; // 遷移ごとにpbJsonのtransitionのリスト数を増やす
                    // exploreDoBlocks(element, "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                    // transitionCount += 1; // 遷移ごとにpbJsonのtransitionのリスト数を増やす
                })
            }
            // イベントとガードが複数ある場合
            else if(deeperChildren != 0){
                deeperChildren.forEach(element => {
                    let resultIf = exploreIfBlocks(element[0],"IF0"); // イベントのIF部分を取得
                    if(element.length == 1){
                        pbJsonPushDetail(stateName,element[0].type,resultIf,transitionCount); // pbJsonにイベントブロックの情報を追加
                        exploreDoBlocks(element[0], "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                    }
                    for (let i = 1; i < element.length; i++){
                        pbJsonPushDetail(stateName,element[0].type,resultIf,transitionCount); // pbJsonにイベントブロックの情報を追加
                        let resultGuard = exploreIfBlocks(element[i],"IF0"); // ガードのIF部分を取得
                        pbJsonPushDetail(stateName,element[i].type,resultGuard,transitionCount); // pbJsonにガードブロックの情報を追加
                        exploreDoBlocks(element[i], "DO0", stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
                        transitionCount += 1; // 遷移ごとにpbJsonのtransitionのリスト数を増やす
                    }
                })
            }
        }
        // 状態の振る舞いを定義している場合
        else if (block.type == "stateActionType"){
            let stateName = exploreStateBlocks(block, "IF0"); // 状態名を取得する
            // if (stateName == "") {
            //     console.log("状態名が未定義です");
            //     stateName = "<color: red>未定義<color: black>";
            //     // skipModelConversion = true; // 状態名が未定義のためモデル化しない
            // }
            // else {
                exploreBehaviorBlocks(block, stateName, transitionCount); // 取得した状態時の振る舞い，遷移の情報を取得する
            // }

        }
    });
    console.log(pbJson);

    // 以下ではモデルに変換できるかどうかの確認を行う
    // const hasInitialState = pbJson.find(item => item.state == "初期状態"); // pbJson内の"初期状態"を取得

    // 初期状態は存在しないので初期状態を追加
    // if (!hasInitialState) {

    // }

        // if (hasMyself){
            checkConvertModels(); // 次の状態が定義されていない場合は，ここで「nextState = 未定義」と追加
            postModelData();
        // }
        // else{
        //     console.log("「初めは初期状態とする」ブロックが配置されていません");
        // }
};


// web画面にモデルの画像を出力する関数
function displayStateMachine(){
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');
    // ブロックが配置されていたらサーバーから画像を作成して表示する
    if (blockTags != "<xml></xml>"){
           stmbpToPuml();
    }
    // ブロックがなかったら画像を削除する
    else{
        let container = document.getElementById("imageModel");
        let imgElement = container.querySelector("img");
        if (imgElement){
            imgElement.src = "img/whiteImage.png"; // 画像の削除
        }
    }
}

setInterval(displayStateMachine, 1000);



// document.querySelector("#practice").addEventListener("click",testPractice);

function testPractice(){
    const id = document.getElementById("hidden");
    id.style.display = "block";
}