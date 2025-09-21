function motionRulesDefinition(colourNumber){
  let motionRulesBlockList = []; 
  motionRulesBlockList.push(
    // 「はじめに」ブロック
    {
      "type": "entryType",
      "message0": "At Start %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": "motionRulesSwich",
      "nextStatement": "motionRulesEntry",
      "colour": motionRulesColor[colourNumber[0]]
    },

    // 「ずっと」ブロック
    {
      "type": "doContinuousType",
      "message0": "Continuously %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": ["motionRulesSwich","motionRulesEntry"],
      "nextStatement": "motionRulesDoContinuos",
      "colour": motionRulesColor[colourNumber[1]]
    },

    // 「一度だけ」ブロック
    {
      "type": "doOnetimeType",
      "message0": "Only once %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": ["motionRulesSwich","motionRulesEntry"],
      "nextStatement": "motionRulesDoOnetime",
      "colour": motionRulesColor[colourNumber[2]]
    },

    // 「終わりに」ブロック
    {
      "type": "exitType",
      "message0": "At End %1",
      "args0": [
        {
            "type": "input_statement",
            "name": "DO0",
            "check": "behavior"
        }
      ],
      "previousStatement": ["motionRulesSwich","motionRulesEntry","motionRulesDoContinuos","motionRulesDoOnetime"],
      "colour": motionRulesColor[colourNumber[3]]
    }
 );
 return motionRulesBlockList;
}


javascript.javascriptGenerator.forBlock['entryType'] = function(block) {
    var code = '';
    var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
    branchCode = branchCode.trim();
    var parentBlock = block.getParent();

    // ブロックが挿入されていない時の確認メッセージを出力
    checkForChildBlock(block,"DO0",'Insert a "Action" block into the "At start" block');

    if(branchCode != "false"){
      if(parentBlock === null){
        code = `console.log("At start " + "${branchCode}");
                logMessage("At start " + "${branchCode}",logDiv);`
      }
      else{
        code = `["entry","At start ${branchCode}"],`;
      }
    }

    return code;
};


javascript.javascriptGenerator.forBlock['doContinuousType'] = function(block) {
    var code = '';
    var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
    branchCode = branchCode.trim();
    var parentBlock = block.getParent();

    // ブロックが挿入されていない時の確認メッセージを出力
    checkForChildBlock(block,"DO0",'Insert a "Action" block into the "Continuously" block');

    if(branchCode != "false"){
      if(parentBlock === null){
        code = `console.log("Continuously " + "${branchCode}");
                logMessage("Continuously " + "${branchCode}",logDiv);`
      }
      else{
        code = `["do","Continuously ${branchCode}"],`;
      }
    }
    return code;
};


javascript.javascriptGenerator.forBlock['doOnetimeType'] = function(block) {
  var code = '';
  var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
  branchCode = branchCode.trim();
  var parentBlock = block.getParent();

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"DO0",'Insert a "Action" block into the "Only once" block');

  if(branchCode != "false"){
    if(parentBlock === null){
      code = `console.log("Only once " + "${branchCode}");
             logMessage("Only once " + "${branchCode}",logDiv);`
    }
    else{
      code = `["do","Only once ${branchCode}"],`;
    }
  }

  return code;
};


javascript.javascriptGenerator.forBlock['exitType'] = function(block) {
  var code = '';
  var branchCode = javascript.javascriptGenerator.statementToCode(block, 'DO0') || "false";
  branchCode = branchCode.trim();
  var parentBlock = block.getParent();

  // ブロックが挿入されていない時の確認メッセージを出力
  checkForChildBlock(block,"DO0",'Insert a "Action" block into the "At End" block');

  if(branchCode != "false"){
    if(parentBlock === null){
      code = `console.log("At End " + "${branchCode}");
             logMessage("At End " + "${branchCode}",logDiv);`
    }
    else{
      code = `["exit","At End ${branchCode}"],`;
    }
  }
  return code;
};
