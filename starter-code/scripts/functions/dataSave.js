
// ワークスペース内のデータを保存する関数
function saveXmlData(Key){
    var xmlData = Blockly.Xml.workspaceToDom(blockspace);
    var xmlText = Blockly.Xml.domToText(xmlData); // XMLを文字列として取得
    var blockTags = xmlText.replace(/<xml[^>]*?>/, '<xml>');
    if(blockTags != "<xml></xml>"){
        localStorage.setItem(Key,blockTags);
    }
}

// 一定間隔ずつワークスペースの情報を保存する
setInterval(() => saveXmlData("previousDataKey"),5000);

// ローカルストレージに保存されているデータを取得する関数
function getXmlData(Key){
    var xmlData = localStorage.getItem(Key); // キーと一致するデータをローカルストレージから取得
    const parser = new DOMParser(); // dpmに変換するパサー
    const domData = parser.parseFromString(xmlData, 'text/xml'); // xmlデータをdomに変換
    Blockly.Xml.appendDomToWorkspace(domData.documentElement, blockspace); // ワークスペースにデータを追加
    // Blockly.Xml.clearWorkspaceAndLoadFromXmlであればワークスペース上のデータを消して書き換える
}


let saveOptionCount = 1;
let restoreMenu = document.getElementById("restoreMenu"); // 復元ボタンにアクセス






// function handelDeleteMenu(){
//     const selectedOption = event.target.options[event.target.selectedIndex]; // 選ばれた <option> を取得
//     const selectedOptionId = selectedOption.id; // 選ばれた <option> の id を取得
// }






// web更新時に「データの復元」ボタンにメニューを追加する関数
function initCreateSaveItem(){
    // ローカルストレージのpreviousDataKey以外のkeyを呼び出す
    // 呼び出すのはユーザーが保存したオプション
    for (let i = 0; i < localStorage.length; i++) {
        let localStorageKey = localStorage.key(i); 
        if(localStorageKey != "previousDataKey"){
          addOptionToSelect(localStorageKey); // データの復元メニューにキー名を追加
        }
    }
}

initCreateSaveItem(); // データの復元メニューをwebリロード時に追加


// データの復元メニューにユーザーが入力した保存項目を追加する関数
function addOptionToSelect(menuName){
    var additionalOption = document.createElement("option"); // optionタグを作成
    additionalOption.value = saveOptionCount; // valueを設定
    additionalOption.id = menuName; // idを設定(idはローカルストレージのkey名と同一とする)
    additionalOption.textContent = "Saved data name:" + menuName; // テキスト名を設定
    restoreMenu.appendChild(additionalOption); // データの復元メニューに追加
    saveOptionCount++; //value値を増やす
}


// displayをnoneとflexに切り替える関数
function displayStyle(containerId,inputId){
    const container = document.getElementById(containerId); // 「追加」ボタンのコンテナIDを取得
    const currentDisplay = window.getComputedStyle(container).display; // コンテナのdisplay値を取得
    // コンテナのdisplayがnoneかflexかを調べる
    if(currentDisplay == "none"){
        setDisplayState("flex",containerId,inputId); // noneならボタンがタップされたときに「追加」ボタンが見えるようにする
    }
    else{
        setDisplayState("none",containerId,inputId); // flexならボタンがタップされたときに「追加」ボタンが見えないようにする
    }
}


// displayとinputの値を変更する関数
function setDisplayState(value,containerId,inputId){
    const container = document.getElementById(containerId);
    const inputArea = document.getElementById(inputId);
    container.style.display = value;
    inputArea.value = '';
    inputArea.focus();
}


// dom形式をxml形式に変換する関数
function textToDom(xmlText) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, 'application/xml');
}