document.addEventListener('DOMContentLoaded', () => {
    const userRowsContainer = document.getElementById('user-rows-container');
    const addUserRowButton = document.getElementById('add-user-row');

    // 指揮官の名前リスト (カテゴリ情報を追加)
    // HTMLの<th>タグの並び順と完全に同期させる
    const commanderCategories = [
        { name: "歩兵ラリー", type: "infantry", commanders: ["Pスキピオ", "ターリク", "劉徹", "マルテル"] },
        { name: "歩兵防衛", type: "infantry", commanders: ["ゴルゴー", "徳川家康", "ゼノビア"] },
        { name: "騎兵ラリー", type: "cavalry", commanders: ["スブタイ", "アッティラ", "ユスティニアヌス"] },
        { name: "騎兵防衛", type: "cavalry", commanders: ["アリエノール", "ヤン"] },
        { name: "弓兵ラリー", type: "archer", commanders: ["シャープール", "嬴政", "アッシュルバニパル", "諸葛亮", "ギルガメッシュ", "ヘンリー"] },
        { name: "弓兵防衛", type: "archer", commanders: ["崔瑩", "ディドー"] },
        { name: "統率", type: "leadership", commanders: ["ヘラクレス", "yss"] }
    ];

    // 全指揮官名をフラットな配列として取得 (既存ロジックのため)
    const commanderNames = commanderCategories.flatMap(cat => cat.commanders);

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
            id: Date.now(),
            username: '',
            vip: vipOptions[0],
            crystalPack: crystalPackOptions[0],
            commanders: {}
        };
        commanderNames.forEach(name => {
            newUserData.commanders[name] = false;
        });
        return newUserData;
    }

    // テーブル全体をレンダリング
    function renderTable() {
        userRowsContainer.innerHTML = '';
        userData.forEach(user => {
            const row = createTableRow(user);
            userRowsContainer.appendChild(row);
        });
    }

    // 1つのユーザー行を生成
    function createTableRow(user) {
        const tr = document.createElement('tr');
        tr.dataset.userId = user.id;

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
        let currentCommanderIndex = 0;
        commanderCategories.forEach(category => {
            category.commanders.forEach(commanderName => {
                const td = document.createElement('td');
                td.classList.add(`${category.type}-cell`); // カテゴリタイプをクラスとして追加

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = user.commanders[commanderName] || false;
                checkbox.dataset.commanderName = commanderName;
                checkbox.addEventListener('change', (e) => {
                    user.commanders[commanderName] = e.target.checked;
                    saveUserData();
                });
                td.appendChild(checkbox);
                tr.appendChild(td);
                currentCommanderIndex++;
            });
        });

        return tr;
    }

    // ユーザーデータをLocalStorageからロード
    function loadUserData() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        try {
            // commanderNames配列が更新された場合でも既存データと整合性を取る
            const parsedData = storedData ? JSON.parse(storedData) : [];
            return parsedData.map(user => {
                const updatedCommanders = {};
                commanderNames.forEach(name => { // 新しいcommanderNamesに基づいて初期化
                    updatedCommanders[name] = user.commanders[name] || false;
                });
                return { ...user, commanders: updatedCommanders };
            });
        } catch (e) {
            console.error("Failed to parse stored data:", e);
            return [];
        }
    }


    // ユーザーデータをLocalStorageに保存
    function saveUserData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        console.log("User data saved to LocalStorage.");
    }
});