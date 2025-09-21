

// 子ブロックの情報(input_value)を取得する関数
function getchildBlockvalue(block,x){
    var conditionCode =''
    conditionCode = javascript.javascriptGenerator.valueToCode(block, x,
      javascript.javascriptGenerator.ORDER_ATOMIC) || `false`;
      return conditionCode;
  }
  

  
// 子ブロックの情報(input_statement)を取得する関数
function getchildBlockStatment(block,x){
var branchCode =''
branchCode = javascript.javascriptGenerator.statementToCode(block, x) || '';
    return branchCode;
}



// フィールドごとにブロックが接続・挿入されているか確認する関数
function checkForChildBlock(block,name,errorMessage){
    var code = '';
    var Input = block.inputList.find(input => input.name === name); // nameのフィールドを特定する変数
    var insertCheck = Input.connection.targetConnection // 接続・挿入されているかを確認　nullなら接続されていない
  
    // ブロックが接続・挿入されていなければエラーメッセージを出力する
    if (insertCheck == null) {
      console.log(errorMessage + "\n");
      logError(errorMessage,logDiv);
      hasInvalidBlocks = true; // ブロックが正しく接続できていないなら遷移やエフェクトが発生しないように制御
    //   logDiv.innerText += errorMessage + "\n";
    } 
  
    return code;
  }



// 終了状態に遷移後に出力するメッセージ
function handleExitState(){
  if (finalStateKey == true){
      console.log('The state has already changed to "", and it cannot be changed any further\n');
      logMessage("------------------------------------------------------",logDiv);
      logError('The state has already changed to "FinalState", and it cannot be changed any further',logDiv);
  }
}


// 親ブロックの存在を確認して挙動を変える関数
// 具体的には親ブロックが存在すれば親にcodeを渡す．親ブロックが存在しなければそのまま出力する
function processStateWithParentCheck(block,activity){
    var code = '';
    var parentBlock = block.getParent();
    // 親ブロックがないとき
    // 受け取った内容をそのまま出力する
    if(parentBlock === null){
        code = `console.log("${activity}");
               blocklogMessage("${activity}");`
    }
    // 親ブロックがあるとき
    // 受け取った内容を親に返す(親ブロックで受け取った内容に何かしらの内容を付け加えて出力する)
    else{
      code = activity;
    }  
    return code;
  }


// logMessage("",logDiv); // 最初に改行を入れる
currentCondition();

// 通常時に出力する(ボタン押下など)関数
function logMessage(message,logDiv) {
    const logEntry = document.createElement('div');  // 新しいdiv要素を作成
    logEntry.textContent = message;  // メッセージを設定
    logDiv.appendChild(logEntry);  // logDivに追加
    logToTxt(`Execution log：${message}`);
  } 
  
// ブロック実行時に出力するメッセージを追加する関数
  function blocklogMessage(message,logDiv) {
    const logEntry = document.createElement('div');  // 新しいdiv要素を作成
    logEntry.textContent = message;  // メッセージを設定
    logDiv.appendChild(logEntry);  // logDivに追加
  } 
  
  // エラーメッセージを追加する関数
  // 赤色でメッセージを出力する
  function logError(message,logDiv) {
    const logEntry = document.createElement('div');  // 新しいdiv要素を作成+
    logEntry.classList.add('log-entry', 'error');    // 'log-entry' と 'error' クラスを追加
    logEntry.textContent = message;  // メッセージを設定
    logDiv.appendChild(logEntry);  // logDivに追加
    logToTxt(`Execution error log:${message}`);
  }
  
// 現在の状態と変数の値を表示する領域
function currentCondition() {
    let testConditionText = "";
    let currentConditionText;
    let currentGuardValue = "";
    if(testKey == true){
      testConditionText = "  ------------Running simulation-----------" + "\n";
    }
    currentConditionText = "Current state:" + currentState + "\n";
    for (let i = 0; i < variableNames.length; i++){
      currentGuardValue += variableNames[i] + " value:" + variableNames[`variableKey${i}`] + "\n"; 
    }
    currentStateDiv.innerText = testConditionText + currentConditionText + currentGuardValue;
  }




//   // ブロックのDo部分に含まれる情報を取得する関数
// function exploreNextStateBlocks(block,stateName){
//     const input = block.getInput("DO0"); // ブロックの内側に接続されたブロックを取得
//     // ブロックが存在するかの確認
//     if (input && input.connection) {
//         const connected = input.connection.targetBlock(); // ブロックの内容を取得
//         // ブロックが存在した時
//         if (connected) {
//            if (connected.type == "changeStateType"){
//             console.log    
//            }
//            else {
//             exploreNextStateBlocks(connected,stateName); // 次のブロックを再帰的に探索
//            }
//         } 
//     } 
//     else {
//         // 下に連結されているブロック（next）を探索
//         const nextBlock = block.getNextBlock(); // 同じ階層下に繋がってるブロックを取得
//         if (nextBlock) {
//             let resultIf = exploreIfBlocks(nextBlock,"IF0"); // IF部分に含まれるブロック情報を取得
//             pbJsonPushDetail(stateName,nextBlock.type,resultIf); // pbJsonにブロックの情報を追加
//             exploreDoBlocks(nextBlock,DoBlock,stateName); // 次のブロックを再帰的に探索
//         }
//       }
// }