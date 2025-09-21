function guardDefinision(colourNumber){
  let guardBlockList = []; 
  guardBlockList.push(
  {
    "type": "checkComputationType",
    "message0": " %1%2%3",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "variable"
      },
      {
        "type": "field_dropdown",
        "name": "IF1",
        "options": [
          ["==", "VALUE0"],
          ["<", "VALUE1"],
          [">", "VALUE2"],
          ["<=", "VALUE3"],
          [">=", "VALUE4"]
        ]
      },
      {
        "type": "field_input",
        "name": "IF2",
        "text": "EnterNumber"   
      }
    ],
    "inputsInline": true, // arg0を横並びにするため
    "output":"guard",
    "colour": guardColor[colourNumber[0]]
  },    
  {
    "type": "logicalOperationsType",
    "message0": " %1%2%3",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "guard"
      },
      {
        "type": "field_dropdown",
        "name": "IF1",
        "options": [
          ["and", "VALUE0"],
          ["or", "VALUE1"]
        ]
      },
      {
        "type": "input_value",
        "name": "IF2",
        "check": "guard"
      }
    ],
    "inputsInline": true, // arg0を横並びにするため
    "output":"guard",
    "colour": guardColor[colourNumber[1]]
  },
  {
    "type": "NegationType",
    "message0": "%1 is not %2",
    "args0": [
      {
        "type": "input_value",
        "name": "IF0",
        "check": "variable"
      },
      {
        "type": "field_input",
        "name": "IF1",
        "text": "EnterNumber"  
      }
    ],
    "inputsInline": true, // arg0を横並びにするため
    "output":"guard",
    "colour": guardColor[colourNumber[2]]
  }
  )
 return guardBlockList;
}



javascript.javascriptGenerator.forBlock["checkComputationType"] = function(block) {
  var code = false;
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1");
  var conditionCode2 = block.getFieldValue("IF2") || null;

  let variableValue = variableNames[`variableKey${conditionCode0}`];
  // variableValueが値を持たない時はfalseを代入する
  if(variableValue == ""){
    variableValue = false;
  }
  // 自由入力のため全角で書かれた場合，半角に直す
  if(conditionCode2 != false){
    conditionCode2 = conditionCode2.replace(/[！-～]/g, function(char) {
      let charCode = char.charCodeAt(0); // 文字コードに変換
      let halfWidthCharCode = charCode - 0xFEE0;  // 半角に変換するためのコード計算
      return String.fromCharCode(halfWidthCharCode);  // 半角文字に変換して返す
    });
  }

  let computationList = ["==", "<", ">", "<=", ">="];
  let operator = computationList[parseInt(conditionCode1.replace("VALUE", ""))];

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"IF0",`"Please enter a variable into the "" ${operator} "" block`);
  // conditionCode2 == 0のときfalseと判定されるため，0かどうかの確認が必要
  if (conditionCode2 == "Enter a number" || conditionCode2 == null){
    logError(`Enter a number into the "" ${operator} "" block`,logDiv);
    console.log(`Enter a number into the "" ${operator} "" block`);
  }

  if(variableValue == 0){
    if (eval(`variableValue ${operator} conditionCode2`)) {
      code = true;
    }
  }
  if(variableValue != false){
    if (eval(`variableValue ${operator} conditionCode2`)) {
      code = true;
    }
  }

  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};




javascript.javascriptGenerator.forBlock["logicalOperationsType"] = function(block) {
  var code = false;
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1");
  var conditionCode2 = getchildBlockvalue(block,"IF2"); 
  

  // ブロックが挿入されていない時の確認メッセージを出力
  if(conditionCode1 == "VALUE0"){
    checkForChildBlock(block,"IF0",'Please enter a variable into the "" and "" block');
    checkForChildBlock(block,"IF2",'Please enter a variable into the "" and "" block');
  }
  else if(conditionCode1 == "VALUE1"){
    checkForChildBlock(block,"IF0",'Please enter a variable into the "" or "" block');
    checkForChildBlock(block,"IF2",'Please enter a variable into the "" or "" block');
  }


  if (conditionCode1 == "VALUE0"){
    if(conditionCode0 == "true" && conditionCode2 == "true"){
      code = true;
    }
  }
  else if (conditionCode1 == "VALUE1"){
    if(conditionCode0 == "true" || conditionCode2 == "true"){
      code = true;
    }
  }

  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};


javascript.javascriptGenerator.forBlock["NegationType"] = function(block) {
  var code = false;
  var conditionCode0 = getchildBlockvalue(block,"IF0"); 
  var conditionCode1 = block.getFieldValue("IF1") || false;

  let variableValue = variableNames[`variableKey${conditionCode0}`];
  // variableValueが値を持たない時はfalseを代入する
  if(variableValue == ""){
    variableValue = false;
  }
  // 自由入力のため全角で書かれた場合，半角に直す
  if(conditionCode1 != false){
    conditionCode1 = conditionCode1.replace(/[！-～]/g, function(char) {
      let charCode = char.charCodeAt(0); // 文字コードに変換
      let halfWidthCharCode = charCode - 0xFEE0;  // 半角に変換するためのコード計算
      return String.fromCharCode(halfWidthCharCode);  // 半角文字に変換して返す
    });
  }

  if (conditionCode1 == "Enter a number" || conditionCode1 == null){
    logError('Enter a number into the "" is not "" block',logDiv);
    console.log('Enter a number into the "" is not "" block');
  }

  if(variableValue != false){
    if (variableValue != conditionCode1) {
      code = true;
    }
  }

  return [code, javascript.javascriptGenerator.ORDER_ATOMIC];
};
