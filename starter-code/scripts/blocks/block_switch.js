function swichDefinition(colourNumber){
  let swichBlockList = []; 
  swichBlockList.push(
    {
    //「初めの状態は～とする」ブロック
    // 開始疑似状態からの遷移を設定するブロック
    "type": "firstDefinitionType",
    "message0": 'Start at "InitialState"',
    "nextStatement": "firstSwichIf",
    "colour": switchColor[colourNumber[0]]
  },
  //「今の状態が～のとき」ブロック
  {
    "type": "switchIfType",
    "message0": 'When current state is %1',
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": ["initialState","swicthState"]
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "switchTransition"
      }
    ],
    "nextStatement": ["switchIfSwitchElseIf","switchStateAction"],
    "previousStatement": "firstSwichIf",
    "colour": switchColor[colourNumber[1]]
  },

  //「ではなく，今の状態が～のとき」ブロック
  {
    "type": "switchElseIfType",
    "message0": 'Else, when current state is %1',
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": ["initialState","swicthState"]
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "switchTransition"
      }
    ],
    "nextStatement": ["switchIfSwitchElseIf","switchStateAction"],
    "previousStatement": "switchIfSwitchElseIf",
    "colour": switchColor[colourNumber[2]]
  },
  // 「状態が～のときの動きは」
  // 状態の定義を行うブロック
  {
    "type": "stateActionType",
    "message0": 'Action when state is %1',
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "swicthState"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "motionRulesSwich"
      }
    ],
    "nextStatement": "switchStateAction",
    "previousStatement": "switchStateAction",
    "colour": switchColor[colourNumber[3]]
  },
  //「～という状態に変わる」ブロック
  {
    "type": "changeStateType",
    "message0": "Transition to state %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": ["swicthState","finalState"]
      },
    ],
    "previousStatement": ["switchTransition","transitionIfElse","transitionGuard","effectChangeState"],
    "colour": switchColor[colourNumber[4]]
  });
  return swichBlockList;
}



javascript.javascriptGenerator.forBlock['stateActionType'] = function(block) {
  var code = '';
  var conditionCode = getchildBlockvalue(block,"IF0"); // この関数はブロックの情報を取得できなければfalseを返す
  var branchCode;
  var stateClass = "";

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0",'Insert a "State" block into the "Action when state is" block');
  checkForChildBlock(block,"DO0",'The "Action when state is" block does not contain a required nested block');

  if(conditionCode != "EnterStateName" && conditionCode != "false"){
    branchCode = getchildBlockStatment(block,"DO0");

    // ここでは各状態におけるクラスの作成を行う
    let list = `[${branchCode} ["",""]]`; // ダミー配列を入れないと","が余ってしまう branchCodeは文字列で渡される
    list = JSON.parse(list); // listを文字列から配列に変更
    // 状態を表すクラスに各活動を追加　lengthはダミー配列があるため-1する
    for(let i = 0; i < list.length - 1; i++){
      // motionrulesから受け取った配列は[識別子,活動の内容]
      // 0番目の位置には識別子が入るのでentry,do,exitであるかを確認
      if(list[i][0] == "entry"){
        var entryAction = list[i][1]; // entryの活動内容を代入
        stateClass += `static saveEntryAction(){
                        console.log("${entryAction}");
                        logMessage("${entryAction}",logDiv);
                        };\n`
      }
      else if(list[i][0] == "do"){
        var doAction = list[i][1]; // doの活動内容を代入
        stateClass += `static saveDoAction(){
                        console.log("${doAction}");
                        logMessage("${doAction}",logDiv);
                        }; \n`
      }
      else if(list[i][0] == "exit"){
        var exitAction = list[i][1]; // exitの活動内容を代入
        stateClass += `static saveExitAction(){
                        console.log("${exitAction}");
                        logMessage("${exitAction}",logDiv);
                        };\n`
      }
    }

    classCode += `class ${conditionCode} { ${stateClass}; };\n`;
  }

  return code;
};



javascript.javascriptGenerator.forBlock['firstDefinitionType'] = function(block) {
  var code = '';
  if (initialStateKey == false){
      currentState = "InitialState";
      console.log('The initial state is: ' + currentState);
      blocklogMessage('The initial state is: ' + currentState,logDiv);
      initialStateKey = true;
      block.setColour('#C8A2D6'); 
    }
  return code;
};



javascript.javascriptGenerator.forBlock['switchIfType'] = function(block) {
  var code ='';
  const nextblock = block.getNextBlock(); // 同じ階層で下に接続されているブロックを確認するために用いる
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0",'Insert a "State" block into the "If event %1 occurs" block');
  checkForChildBlock(block,"DO0",'The "If event %1 occurs" block does not contain a required nested block');

  // 現在の状態と挿入されたブロックが一致しているかの判定をする関数
  if (conditionCode == "true"){
      branchCode = getchildBlockStatment(block,"DO0");
      code += `${branchCode}`;
      switchKey = true;
    }
  
  // swich case文を実装するために次に接続されているブロックが存在するかを確認する
  // 次に接続されているブロックが存在しなければswitchKeyをfalseにする
  // nextblockはオブジェクトを返すので単純な文字列比較はできない　テンプレートリテラルは用いない
  if (nextblock === null){
    switchKey = false;
  }

  return code;
}


javascript.javascriptGenerator.forBlock['switchElseIfType'] = function(block) {
  var code =''; 
  const nextblock = block.getNextBlock(); //オブジェクトを返す
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0",'Insert a "State" block into the "Else, when current state is" block');
  checkForChildBlock(block,"DO0",'The "Else, when current state is" block does not contain a required nested block');

  // 現在の状態と挿入されたブロックが一致しているかの判定をする　＆
  // このブロック以前のcaseと該当していないかどうかの判定をする(swich case文の再現)
  if (switchKey === false && conditionCode == "true"){
    branchCode = getchildBlockStatment(block,"DO0");
    code += `${branchCode}`;
    switchKey = true; 
  }

  // swich case文を実装するために次に接続されているブロックが存在するかを確認する
  // 次に接続されているブロックが存在しなければswitchKeyをfalseにする
  // nextblockはオブジェクトを返すので単純な文字列比較はできない　テンプレートリテラルは用いない
  if (nextblock == null || nextblock.type == "stateActionType"){
    switchKey = false;
  }

  return code;
}


// 次の状態を入れるブロック
javascript.javascriptGenerator.forBlock['changeStateType'] = function(block) {
  var code = '';
  var temporaryState = getchildBlockvalue(block,"IF0"); // 遷移後の状態を取得
  
  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0",'Insert a "State" block into the "Transition to state" block');
  

  // ブロックが挿入されて入れば現在の状態を更新する
  if(currentState == "FinalState"){
  }
  else if(currentState == ""){
    logError('Set the initial state to "InitialState"',logDiv);
    console.log('Set the initial state to "InitialState"');
  }
  else if(temporaryState != "false"){
    // 「動き」ブロックに関するの画像とログを変更する
    let previousStateBhavior = containsBehavior(currentState);
    let currentStateBhaivior = containsBehavior(temporaryState);
    //runMotionSequence(currentState,temporaryState,previousStateBhavior[2],currentStateBhaivior[0],3000); //「動き」の画像とログを出力するための関数

    // 退場動作の処理
    // 次の状態に遷移する前に退場動作の処理内容を出力 
    if(currentState != ""){
      code += `if (!hasInvalidBlocks){
                if (typeof ${currentState} == 'function') {
                  if(typeof ${currentState}.saveExitAction == "function"){
                  ${currentState}.saveExitAction();
                  }
                }
              }`;
    }

    
    // 他のブロックが正しく接続されている場合のみ実行
    code += `if (!hasInvalidBlocks){
              currentState = "${temporaryState}"; // 現在の状態を更新
              console.log('The current state has been changed to: ' + currentState);
              blocklogMessage('The current state has been changed to: ' + currentState,logDiv);
            }`;

    // 状態がentryとdoを持っていればそれぞれを実行する
    // 実行タイミングとしては状態に入ったときなのでこのブロックで実行する
    code += `if (!hasInvalidBlocks){
              if (typeof ${temporaryState} == 'function') {
                if(typeof ${temporaryState}.saveEntryAction == "function"){
                  ${temporaryState}.saveEntryAction();
                }
                if(typeof ${temporaryState}.saveDoAction == "function"){
                  ${temporaryState}.saveDoAction();
                }
              }
            }`;
  }
  return code;
};
