document.addEventListener('DOMContentLoaded', () => {
    const userRowsContainer = document.getElementById('user-rows-container');
    const addUserRowButton = document.getElementById('add-user-row');

    // 指揮官の名前リスト (index.htmlのthタグの並び順と完全に同期)
    const commanderNames = [
        // 歩兵ラリー
        "Pスキピオ", "ターリク", "劉徹", "マルテル",
        // 歩兵防衛
        "ゴルゴー", "徳川家康", "ゼノビア",
        // 騎兵ラリー
        "スブタイ", "アッティラ", "ユスティニアヌス",
        // 騎兵防衛
        "アリエノール", "ヤン",
        // 弓兵ラリー
        "シャープール", "嬴政", "アッシュルバニパル", "諸葛亮", "ギルガメッシュ", "ヘンリー",
        // 弓兵防衛
        "崔瑩", "ディドー",
        // 統率
        "ヘラクレス", "yss"
    ];

    // VIPレベルの選択肢
    const vipOptions = ["-", "15", "16", "17", "18", "19", "SVIP"];
    // 水晶課金の選択肢
    const crystalPackOptions = ["-", "シーズン補給のみ", "シーズン補給+ポップアップ", "シーズン補給+ポップアップ+関所パック"];

    // データ保存用のキー
    const STORAGE_KEY = 'commanderChecklistData';

    // ユーザーデータをロード
    let userData = loadUserData();
    if (userData.length === 0) {
        // データがない場合は初期ユーザーを追加
        userData.push(createNewUserData());
    }
    renderTable();

    // 新しいユーザー行を追加するイベントリスナー
    addUserRowButton.addEventListener('click', () => {
        userData.push(createNewUserData());
        renderTable();
        saveUserData();
    });

    // ユーザーデータの初期構造を生成
    function createNewUserData() {
        const newUserData = {
            id: Date.now(), // 一意のID (削除機能を実装する場合に便利)
            username: '',
            vip: vipOptions[0],
            crystalPack: crystalPackOptions[0],
            commanders: {}
        };
        commanderNames.forEach(name => {
            newUserData.commanders[name] = false; // 全ての指揮官を未所持で初期化
        });
        return newUserData;
    }

    // テーブル全体をレンダリング
    function renderTable() {
        userRowsContainer.innerHTML = ''; // 既存の行をクリア
        userData.forEach(user => {
            const row = createTableRow(user);
            userRowsContainer.appendChild(row);
        });
    }

    // 1つのユーザー行を生成
    function createTableRow(user) {
        const tr = document.createElement('tr');
        tr.dataset.userId = user.id; // 行にユーザーIDを紐付け

        // ユーザー名セル
        const nameTd = document.createElement('td');
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = user.username;
        nameInput.placeholder = 'ユーザー名';
        nameInput.addEventListener('change', (e) => {
            user.username = e.target.value;
            saveUserData();
        });
        nameTd.appendChild(nameInput);
        tr.appendChild(nameTd);

        // VIP選択セル
        const vipTd = document.createElement('td');
        const vipSelect = document.createElement('select');
        vipOptions.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            if (optionText === user.vip) {
                option.selected = true;
            }
            vipSelect.appendChild(option);
        });
        vipSelect.addEventListener('change', (e) => {
            user.vip = e.target.value;
            saveUserData();
        });
        vipTd.appendChild(vipSelect);
        tr.appendChild(vipTd);

        // 水晶課金選択セル
        const crystalPackTd = document.createElement('td');
        const crystalPackSelect = document.createElement('select');
        crystalPackOptions.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText;
            if (optionText === user.crystalPack) {
                option.selected = true;
            }
            crystalPackSelect.appendChild(option);
        });
        crystalPackSelect.addEventListener('change', (e) => {
            user.crystalPack = e.target.value;
            saveUserData();
        });
        crystalPackTd.appendChild(crystalPackSelect);
        tr.appendChild(crystalPackTd);

        // 指揮官チェックボックスセル
        commanderNames.forEach(commanderName => {
            const td = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = user.commanders[commanderName] || false; // 未定義の場合はfalse
            checkbox.dataset.commanderName = commanderName; // データ属性で指揮官名を紐付け
            checkbox.addEventListener('change', (e) => {
                user.commanders[commanderName] = e.target.checked;
                saveUserData();
            });
            td.appendChild(checkbox);
            tr.appendChild(td);
        });

        return tr;
    }

    // ユーザーデータをLocalStorageからロード
    function loadUserData() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        try {
            return storedData ? JSON.parse(storedData) : [];
        } catch (e) {
            console.error("Failed to parse stored data:", e);
            return []; // パースエラーの場合は空の配列を返す
        }
    }

    // ユーザーデータをLocalStorageに保存
    function saveUserData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        console.log("User data saved to LocalStorage."); // デバッグ用
    }
});