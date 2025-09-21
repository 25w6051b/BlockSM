function transitionDefinition(colourNumber){
  let transitionBlockList = []; 
  transitionBlockList.push(
  {
    //「もし～というイベントが起きたなら」ブロック
    "type": "customControlsIfType",
    "message0": "If event %1 occurs",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "trigger"
      },
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionIfElse"
      }
    ],
    "nextStatement": ["customControlsElseIf"],
    "previousStatement": "switchTransition",
    "colour": transitionColor[colourNumber[0]]
  },

  //「ではなく～というイベントが起きたなら」ブロック
  {
    "type": "customControlsElseIfType",
    "message0": "Else, if event %1 occurs",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "trigger"
      }
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionIfElse"
      }
    ],
    "nextStatement": ["customControlsElseIf"],
    "previousStatement": ["customControlsElseIf"],
    "colour": transitionColor[colourNumber[1]]
  },

  //「もし～という条件を満たすなら」ブロック
  {
    "type": "guardIfType",
    "message0": "If condition %1 holds",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "guard"
      },
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionGuard"
      }
    ],
    "nextStatement": ["guardIfElseIf"],
    "previousStatement": ["switchTransition","transitionIfElse"],
    "colour": transitionColor[colourNumber[2]]
  },

  // 「ではなく，～という条件を満たすなら」ブロック
  {
    "type": "guardElseIfType",
    "message0": "Else, if condition %1 holds",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "guard"
      },
    ],
    "message1": "%1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO0",
        "check": "transitionGuard"
      }
    ],
    "nextStatement": ["guardIfElseIf"],
    "previousStatement": ["guardIfElseIf"],
    "colour": transitionColor[colourNumber[3]]
  },

  //「～という作用が起こる」ブロック
  {
    "type": "effectType",
    "message0": "Execute effect %1",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "effect"
      },
    ],
    "nextStatement": ["effectChangeState"],
    "previousStatement": ["switchTransition","transitionIfElse","transitionGuard"],
    "colour": transitionColor[colourNumber[4]]
  }
 );

 return transitionBlockList;
}




// トリガーを入れるブロック(ifを実現)
javascript.javascriptGenerator.forBlock['customControlsIfType'] = function(block) {
  var code = '';
  const nextblock = block.getNextBlock(); // 同じ階層で下に接続されているブロックを確認するために用いる
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;
  conditionCode = JSON.parse(conditionCode); // 配列が文字列で返されるので，元の配列に戻す

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0",'Insert an "Event" block into the "If event occurs" block');
  checkForChildBlock(block,"DO0",'The "If event occurs" block does not contain a required nested block');

  // 初期状態の時はイベントを持てないことを説明
  if (currentState == "InitialState"){
    code += `console.log('The "If event occurs" block cannot be used when the current state is "InitialState"');
           logError('The "If event occurs" block cannot be used when the current state is "InitialState"',logDiv);`
  }
  // 挿入されたイベントが発生していた場合の処理
  else{
    if (conditionCode[0] == true){
      // code += `console.log("「" + "${conditionCode[1]}" + "」イベントの発生確認が取れました");
      //         logMessage("「" + "${conditionCode[1]}" + "」イベントの発生確認が取れました");`
      branchCode = getchildBlockStatment(block,"DO0");
      code += `${branchCode}`;
      eventIfKey = true;
    }
  }

  if (nextblock === null){
    eventIfKey = false;
  }
  
  return code;
};


// トリガーを入れるブロック()if else ifを実現)
javascript.javascriptGenerator.forBlock['customControlsElseIfType'] = function(block) {
  var code =''; 
  const nextblock = block.getNextBlock(); //オブジェクトを返す
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;
  conditionCode = JSON.parse(conditionCode);
 
  checkForChildBlock(block,"IF0",'Insert an "Event" block into the "Else, if event occurs" block');
  checkForChildBlock(block,"DO0",'The "Else, if event occurs" block does not contain a required nested block');

  if (currentState == "InitialState"){
    code += `console.log('The "Else, if event occurs" block cannot be used when the current state is "InitialState"');
           logError('The "Else, if event occurs" block cannot be used when the current state is "InitialState"',logDiv);`; }
  else {
    if (eventIfKey == false && conditionCode[0] == true){
    // code += `console.log("「" + "${conditionCode[1]}" + "」イベントの発生確認が取れました");
    //           logMessage("「" + "${conditionCode[1]}" + "」イベントの発生確認が取れました");`
    branchCode = getchildBlockStatment(block,"DO0");
    code += `${branchCode}`;
    eventIfKey = true;
    };
  };

  if (nextblock == null){
    eventIfKey = false;
  };

  return code;
};


// ガードを入れるブロック(ifを実現)
javascript.javascriptGenerator.forBlock['guardIfType'] = function(block) {
  var code = '';
  const nextblock = block.getNextBlock(); 
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0",'Insert a "Condition" block into the "If condition holds" block');
  checkForChildBlock(block,"DO0",'The "If condition holds" block does not contain a required nested block');

  if (currentState == "InitialState"){
    code += `console.log('The "If condition holds" block cannot be used when the current state is "InitialState"');
           logError('The "If condition holds" block cannot be used when the current state is "InitialState"',logDiv);`; }
  else {
    if (conditionCode == "true"){
    branchCode = getchildBlockStatment(block,"DO0");
    code += `${branchCode}`;
    guardIfKey = true;
    };
  };

  if (nextblock === null){
    guardIfKey = false;
  }

  return code;
};


// ガードを入れるブロック(else ifを実現)
javascript.javascriptGenerator.forBlock['guardElseIfType'] = function(block) {
  var code = '';
  const nextblock = block.getNextBlock(); 
  var conditionCode = getchildBlockvalue(block,"IF0");
  var branchCode;

  // ブロックが挿入されていなければコンソールにエラーメッセージを出力
  checkForChildBlock(block,"IF0",'Insert a "Guard" block into the "Else, if condition holds" block');
  checkForChildBlock(block,"DO0",'The "Else, if condition holds" block does not contain a required nested block');

  if (currentState == "InitialState"){
    code += `console.log('The "Else, if condition holds" block cannot be used when the current state is "InitialState"');
           logError('The "Else, if condition holds" block cannot be used when the current state is "InitialState"',logDiv);`; }
  else {
    if (conditionCode == "true" && guardIfKey == false){
      branchCode = getchildBlockStatment(block,"DO0");
      code += `${branchCode}`;
      guardIfKey = true;
    }
  }
  if (nextblock == null){
    guardIfKey = false;
  }

  return code;
};


// エフェクトを入れるブロック
javascript.javascriptGenerator.forBlock['effectType'] = function(block) {
  var code = '';
  var conditionCode;
  conditionCode = javascript.javascriptGenerator.valueToCode(block, "IF0",
                  javascript.javascriptGenerator.ORDER_ATOMIC) || false; // ブロックが挿入されていなければfalseを返す

  checkForChildBlock(block,"IF0",'Insert an "Effect" block into the "takes effect" block');

  if(conditionCode != false){
    // 他のブロックが正しく接続されている場合のみ実行
    code += `if (!hasInvalidBlocks){
              console.log("${conditionCode}" + " effect has occurred");
              blocklogMessage("${conditionCode}" + " effect has occurred",logDiv);
            }`
  }
  return code;
};




