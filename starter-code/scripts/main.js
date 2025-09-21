/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


let classCode = ""; // 作成したクラスを格納するための変数
let currentState = ""; // 現在の状態を格納する変数
let pbJson = []; // ワークスペース内のブロック情報を格納する(json形式)
let testKey = false; // テストボタンが押されたかを判断するために用いる，falseなら押されていない，trueなら押されている
let initialStateKey = false; // 初めの状態を更新する際に用いる，falseなら更新しない，trueなら更新
let finalStateKey = false; // 終了状態に遷移したかを判定する　falseなら遷移していない，trueなら遷移している
let switchKey = false; // swich case文を実現するための変数　
                       // この変数がfalseならcase文の確認を順に行う　trueならそれ以降のcase文の確認は行なわない
let eventIfKey = false; // eventの発生確認を行うswich case文を実現するための変数　
                        // この変数がfalseならcase文の確認を順に行う　trueならそれ以降のcase文の確認は行なわない  
let guardIfKey = false; // guardの発生確認を行うswich case文を実現するための変数　
                        // この変数がfalseならcase文の確認を順に行う　trueならそれ以降のcase文の確認は行なわない  
let hasInvalidBlocks = false; // エフェクトや次状態への遷移を制御する変数 ブロックが正しく配置されていない時などに使う
let skipModelConversion = false; // モデルに変換できないミス(例えば，ブロックが配置されていないなど)はある場合はこの変数をtrueにして制御する
let undefinedStateNumber = 0; // 未定義の状態数を数える変数
let plantUmlText = ""; // ワークスペース情報がplantUML形式で格納される変数(サーバーとのresponse時に格納)
let lastDefLogged = false; // 前回の探索時，初期状態が定義されているか確認する変数
let lastTransLogged = false; // 前回の探索時，初期状態からの遷移が定義されているか確認する変数
                      
// 退場動作を実現するための変数
// 退場動作は次の状態に遷移するタイミングで実行されるため～という状態に変わるブロックと連携して実装する
// let exitStatement = ""; // 退場遷移の処理内容を格納する変数
// let exitKey = false; // 前回の状態に退場動作が状態に含まれていたかを判定する　falseなら含まれていない，trueなら含まれている
// let exitState = "";

// logarea(コンソールに出力される内容を取得して出力するための領域)にログを出力すための変数
let logDiv = document.getElementById("log-area");
let currentStateDiv = document.getElementById("current-state-area");

// 動きに関するログ
// const logContainer = document.getElementById("behaiviorLog");
// const imgContainer = document.getElementById("behaiviorImage");


// 要求文に依存する鍵
// let heatingkey = false;  //trueは押さた時，falseは押されていない時
// let powerswitchKey = false; //trueなら電源スイッチボタンが押された，falseなら電源スイッチが押されていない
// let powerswitchstate = false; //trueは電源ON，falseは電源OFF
// let ignitekey = false; // 点火されているかを判定するtrueは点火済み，falseは点火していない
// let fankey = false; // 換気扇がついているかを判定するtrueは回っている，falseは回っていない

// errorkeyは要求文に依存する事柄を制御するときに用いる(自動化への障害が考えられる)
// let effecterrorkey = false; // エラー発生時に予期せぬ問題を避ける ただし使用後は必ずfalseにもどすこと
// let motionRuleserrorkey = false; // エラー発生時に予期せぬ問題を避ける ただし使用後は必ずfalseにもどすこと



(function () {
  let currentButton;

  // function handlePlay(event) {
  //   // Add code for playing sound.
  //   loadWorkspace(event.target);
  //   let code = javascript.javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
  //   try {
  //     eval(code);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // function save(button) {
  //   // Add code for saving the behavior of a button.
  //   blocklySave = Blockly.serialization.workspaces.save(Blockly.getMainWorkspace());
  // }

  // saveボタンが押されたときに実行される
  function handleSave() {
    document.body.setAttribute('mode', 'blockly');
    // save(currentButton);
  }

  // function checkBlocksAndHandleEvent() {
  //   const workspace = Blockly.getMainWorkspace(); // ワークスペースの情報を取得する関数
  // } 

  

  // // editボタンが押されたときに実行される
  // function enableEditMode() {
  //   document.body.setAttribute('mode', 'edit');
  //   document.querySelectorAll('.button').forEach((btn) => {
  //     btn.removeEventListener('click', handlePlay);
  //     btn.addEventListener('click', enableBlocklyMode);
  //   });
  // }
  document.body.setAttribute('mode', 'blockly'); //初めに開くモードを設定

  // doneボタンが押されたときに実行される
  function enableMakerMode() {
    // document.body.setAttribute('mode', 'blockly'); //初めに開くモードを設定
    // document.querySelectorAll('.button').forEach((btn) => {
    //   btn.addEventListener('click', handlePlay);
    //   btn.removeEventListener('click', enableBlocklyMode);
    // });
  }


  // function enableBlocklyMode(e) {
  //   document.body.setAttribute('mode', 'blockly');
  //   currentButton = e.target;
  // }

  // function loadWorkspace(button) {
  //   const workspace = Blockly.getMainWorkspace();
  //   if (button.blocklySave) {
  //     Blockly.serialization.workspaces.load(button.blocklySave, workspace);
  //   } else {
  //     workspace.clear();
  //   }
  // }
  
  // document.querySelector('#edit').addEventListener('click', enableEditMode);
  // document.querySelector('#done').addEventListener('click', enableMakerMode);
  // document.querySelector('#save').addEventListener('click', handleSave);

  // ボタンが押されたときの処理
  // アロー関数を用いて関数を設定＆クリック時にhandleEventActionを呼び出す
  // 直接handleEventAction(0)と呼びだすと即時実行されてしまうので，この書き方とする
  document.querySelector('#test').addEventListener('click', functionalTest);
  document.querySelector('#reset').addEventListener('click', resetLogData);
  document.querySelector('#nonEvent').addEventListener('click', handleNonEventAction);
  document.getElementById('restoreMenu').addEventListener('change', handleRestoreChange);
  document.querySelector('#addNameButton').addEventListener('click',createSaveItem);
  document.querySelector('#deleteButton').addEventListener('click',deleteSaveItem);
  document.querySelector("#saveButton").addEventListener('click', () => {
  displayStyle("inputSaveNameContainer","saveNameInput")});
  document.querySelector("#deleteRestoreButton").addEventListener('click', () => {
  displayStyle("inputdeleteNameContainer","deleteNameInput")})
  // document.querySelector("#pbToPuml").addEventListener('click',stmbpToPuml)
    

  // document.querySelector("#deleteRestoreButton").addEventListener('click',handelDeleteMenu); // 削除ボタンにアクセス
  // document.getElementById('#createSave').addEventListener('click',createSaveItem)
  document.querySelector('#logGet').addEventListener('click', saveLogsToExcel);
  // document.querySelector('#saveData').addEventListener('click', saveData);


  // // 変更イベントリスナーを追加
  // workspace.addChangeListener(function(event) {
  //     if (event.type === Blockly.Events.SELECTED) { 
  //         var block = workspace.getBlockById(event.newValue); // クリックされたブロックを取得

  //     }
  // });


  enableMakerMode();
})();


const toolbox = {
  'kind': 'categoryToolbox',
  'contents':[
    {
      'kind':'category',
      'name':'Transition',
      'categorystyle': 'switch_category',
      "custom": "swich_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      "kind": "category",
      "name": "Trigger",
      'categorystyle': 'transition_category',
      "custom": "transition_COLOUR_PALETTE",
      "contents": [
      ]
    },
    {
      'kind':'category',
      'name':'State',
      'categorystyle': 'state_category',
      "custom": "state_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      'kind':'category',
      'name':'Action Timing',
      'categorystyle': 'motionRules_category',
      "custom": "motionRules_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      'kind':'category',
      'name':'Action',
      'categorystyle': 'behavior_category',
      "custom": "behavior_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      'kind':'category',
      'name':'Event',
      'categorystyle': 'trigger_category',
      "custom": "event_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      'kind':'category',
      'name':'Guard',
      'categorystyle': 'guard_category',
      "custom": "guard_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      'kind':'category',
      'name':'Effect',
      'categorystyle': 'effect_category',
      "custom": "effect_COLOUR_PALETTE",
      'contents': [
      ]
    },
    {
      'kind':'category',
      'name':'Variable',
      'categorystyle': 'variable_category',
      "custom": "variable_COLOUR_PALETTE",
      'contents': [
      ]
    }
  ]
};



const theme = Blockly.Theme.defineTheme('customTheme', {
  'base': Blockly.Themes.Classic, // ベーステーマを指定
  'blockStyles': {
      'logic_blocks': {
          'colourPrimary': '#4a148c', // ロジックブロックの主色
          'colourSecondary': '#6a1b9a', // ロジックブロックの副色
          'colourTertiary': '#7b1fa2' // ロジックブロックの三次色
      },
      'math_blocks': {
          'colourPrimary': '#0d47a1' // 数学ブロックの主色
      },
      // 他のブロックスタイルを追加
  },
  'categoryStyles': {
      'switch_category': {
          'colour': '#800080'
      },
      'transition_category': {
          'colour': '#FFA500'
      },
      'state_category': {
          'colour': '#FF69B4'
      },
      'trigger_category': {
          'colour': '#FF0015'
      },
      'guard_category': {
          'colour': 'green'
      },
      'effect_category': {
          'colour': '#32CD32'
      },
      'motionRules_category': {
          'colour': 'blue'
      },
      'behavior_category': {
          'colour': '#00BFFF'
      },
      'variable_category': {
          'colour': '#8B4513'
      },
  },
  'componentStyles': {
      'toolbox': {
          'backgroundColour': '#f0f0f0', // ツールボックスの背景色
          'borderColour': '#b0bec5' // ツールボックスの境界色
      }
  },
  'fontStyle': {
      'family': 'sans-serif', // フォントファミリー
      'size': 14, // フォントサイズ
      'weight': 'normal' // フォントの太さ
  },
  'startHats': true // スタートハットを表示
});




Blockly.inject('blocklyDiv', {
  toolbox: toolbox,
  theme: theme,
  scrollbars: true,
  horizontalLayout: false,
  toolboxPosition: "start",
  zoom: {
    controls: true, // ズームボタンを表示
  }
});




let blockspace = Blockly.getMainWorkspace(); // ワークスペースの情報を取得する


// 警告文を消す(ブロックの再定義に関する警告文)
const originalConsoleWarn = console.warn;
// console.warn をオーバーライドして警告を抑制
console.warn = function(message, ...args) {
  if (message && message.includes('Block definition')) {
    return;  // 'Block definition' を含む警告は表示しない
  }
  originalConsoleWarn.apply(console, [message, ...args]);
};

// ブロックの選択時に選ばれたブロックIDと名前を保存しておく変数　
// selectedにおいてブロックの選択・解除で用いる
let temporaryBlockType;
let blockText;

// イベントタイプを監視する
if (blockspace) {
  blockspace.addChangeListener(function(event) {
    const selectedBlockId = event.newElementId; // 選択されたブロックのIDを取得

    if (event.type == "selected"){
      if (selectedBlockId) {
          let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
          if (block){
            temporaryBlockType = block.type;
            blockText = block.toString();
            logToTxt("Selected:" + sanitizeBlockText(blockText));
            boostOpacity(opaqueBlockTypes.map.get(block.type));
            for (let i = 0; i < categorytypes.length; i++) {
              let category_EachTypesSet = new Set(categorytypes[i].map(block => block.type));
              if (category_EachTypesSet.has(block.type)) {
                // 初期状態を決めるブロックは一度実行したらブロックの色は薄くしたままにする
                if(block.type == "firstDefinitionType"){
                  if(initialStateKey == true){
                    block.setColour(allblocksColor[i][1]);
                  }
                  else {
                    block.setColour(allblocksColor[i][0]);
                  }
                }
                else{
                  block.setColour(allblocksColor[i][0]);
                }
                break; // 一度色が決まれば後続の処理は不要なので break
              }
            }
          }
      }
      else{
        logToTxt("Dropped:" + sanitizeBlockText(blockText));
        resetcomponent();
      }
    }
    else if(event.type == "move"){
      moveAnalyze(event);
    }
    else if(event.type == "delete"){
      if (selectedBlockId) {
        let block = blockspace.getBlockById(selectedBlockId); // ブロックIDからブロックを取得
        if (block){
          blockText = block.toString();
        }
      }
      logToTxt('Deleted:' + sanitizeBlockText(blockText));
    }
    else if(event.type == "trashcan_open"){
      logToTxt('"Trashcan" selected');
    }
    else if(event.type == "toolbox_item_select"){
      logToTxt('"Category box" selected');
    }
  })
}


function moveAnalyze(event){
  // if (event.type === Blockly.Events.BLOCK_MOVE) {
    const movedBlock = Blockly.getMainWorkspace().getBlockById(event.blockId);

    if(movedBlock != null){
        let movedBlockText = movedBlock.toString();
      // 接続された場合
      if (event.newParentId && !event.oldParentId) {
        const parentBlockText = (Blockly.getMainWorkspace().getBlockById(event.newParentId)).toString();
        logToTxt(`Moved: "${sanitizeBlockText(movedBlockText)}"`)
      }

      // 切断された場合
      else if (!event.newParentId && event.oldParentId) {
        const oldParentBlockText = (Blockly.getMainWorkspace().getBlockById(event.oldParentId)).toString();
        logToTxt(`Moved: "${sanitizeBlockText(movedBlockText)}" was disconnected from "${sanitizeBlockText(oldParentBlockText)}"`)
      }

      // 単なる位置移動の場合
      else if (!event.newParentId && !event.oldParentId) {
        logToTxt(`Moved: "${sanitizeBlockText(movedBlockText)}" (disconnected)`)
      }
    }
  // }
}


function sanitizeBlockText(blockText) {
  // 連続する ? をまとめて [undefined] に置き換える
  return blockText.replace(/\?+/g, '[undefined]');
}

