// ブロックの色を薄くするための関数
function boostOpacity(blocktypes) {
  // ブロックを全て薄くする(下のfor文で繋げられるブロックのみを濃くする)
  categorytypes = categorytypes.map(category => 
    category.map(block => ({ ...block, number: 1 }))
  );

  // 関数に代入されたブロックタイプごとに繰り返す
  for(let i = 0; i < blocktypes.length; i++){
    // カテゴリ数分繰り返す
    for(let j = 0; j < categorytypes.length; j++){
      // カテゴリに含まれるタイプごとに繰り返す
      for(let l = 0; l < categorytypes[j].length; l++){
        // 関数に代入されたタイプとカテゴリに含まれるタイプが一致した場合
        if(blocktypes[i] == categorytypes[j][l].type){
          categorytypes[j][l].number = 0; // 数字を0にすることでブロックを濃くする
        }
      }
    }
  }
  colourNumber_list.forEach(list => list.length = 0);

  for(let i = 0; i < categorytypes.length; i++){
    for(let j = 0; j < categorytypes[i].length; j++){
      colourNumber_list[i].push(categorytypes[i][j].number);
    }
    // const callback = categoryCallbacks[i];
    // blockspace.registerToolboxCategoryCallback(callback.category, () => callback.resetFunc(blockspace, callback.list));
  }

  blockspace.registerToolboxCategoryCallback('swich_COLOUR_PALETTE',() => reset_switch(blockspace,swichColorNumberList));
  blockspace.registerToolboxCategoryCallback('transition_COLOUR_PALETTE', () => {
    let transitionBlocks = reset_transition(blockspace,transitionColorNumberList);
    if(guardNames.length == 0){
      transitionBlocks = transitionBlocks.filter(block => block.type != "guardIfType" && block.type != "guardElseIfType");
    }
    if(eventNames.length == 0){
      transitionBlocks = transitionBlocks.filter(block => block.type != "customControlsIfType" && block.type != "customControlsElseIfType");
    }
    if(effectNames.length == 0 && guardNames.length == 0){
      transitionBlocks = transitionBlocks.filter(block => block.type != "effect");
    }
    return transitionBlocks
  });
  blockspace.registerToolboxCategoryCallback('state_COLOUR_PALETTE',() =>  reset_state(blockspace,stateColorNumberList));
  blockspace.registerToolboxCategoryCallback('motionRules_COLOUR_PALETTE', () => reset_motionRules(blockspace,motionRulesColorNumberList));
  blockspace.registerToolboxCategoryCallback('behavior_COLOUR_PALETTE', () => reset_behavior(blockspace,behaviorColourNumber_list));
  blockspace.registerToolboxCategoryCallback('event_COLOUR_PALETTE', () => reset_event(blockspace,eventColourNumber_list)); 
  blockspace.registerToolboxCategoryCallback('guard_COLOUR_PALETTE', () => reset_guard(blockspace,guardColourNumber_list));
  blockspace.registerToolboxCategoryCallback('effect_COLOUR_PALETTE', () => reset_effect(blockspace,effectColourNumber_list));
  blockspace.registerToolboxCategoryCallback('variable_COLOUR_PALETTE', () => reset_variable(blockspace,variableColourNumber_list));
  return ;
};
