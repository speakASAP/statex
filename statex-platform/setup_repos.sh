#!/bin/bash

# ----------------------------
# Настройка продовых репозиториев с отдельными Deploy Keys
# ----------------------------

# Массив репозиториев
# Формат: "локальная_папка GitHub_пользователь GitHub_репо ветка"
REPOS=(
    "statex-ai speakASAP statex-ai main"
    "statex-infrastructure speakASAP statex-infrastructure main"
    "statex-monitoring speakASAP statex-monitoring main"
    "statex-notification-service speakASAP statex-notification-service main"
    "statex-platform speakASAP statex-platform main"
    "statex-website speakASAP statex-website main"
)

# ----------------------------
# Функция настройки одного репозитория
# ----------------------------
setup_repo() {
    LOCAL_DIR=$1
    GITHUB_USER=$2
    REPO_NAME=$3
    BRANCH=$4
    KEY_FILE="$HOME/.ssh/id_$REPO_NAME"
    SSH_HOST="github.com-$REPO_NAME"
    REMOTE_URL="git@$SSH_HOST:$GITHUB_USER/$REPO_NAME.git"

    echo ""
    echo "=============================="
    echo "Настройка репозитория $REPO_NAME"
    echo "=============================="

    # 1. Генерация SSH-ключа
    if [ ! -f "$KEY_FILE" ]; then
        echo "Генерируем SSH ключ для $REPO_NAME..."
        ssh-keygen -t ed25519 -C "prod-$REPO_NAME" -f "$KEY_FILE" -N ""
    else
        echo "Ключ уже существует: $KEY_FILE"
    fi

    echo "Публичный ключ для GitHub ($REPO_NAME):"
    cat "${KEY_FILE}.pub"
    echo ""
    echo "⚠️ Скопируйте этот ключ и добавьте в GitHub → $REPO_NAME → 
Settings → Deploy Keys → Add deploy key"
    echo "После добавления нажмите Enter для продолжения..."
    read -r

    # 2. Настройка ssh config
    if ! grep -q "$SSH_HOST" "$HOME/.ssh/config"; then
        echo "Добавляем запись в ~/.ssh/config..."
        echo "" >> "$HOME/.ssh/config"
        echo "Host $SSH_HOST" >> "$HOME/.ssh/config"
        echo "    HostName github.com" >> "$HOME/.ssh/config"
        echo "    User git" >> "$HOME/.ssh/config"
        echo "    IdentityFile $KEY_FILE" >> "$HOME/.ssh/config"
    else
        echo "Запись для $SSH_HOST уже есть в ssh/config"
    fi

    # 3. Проверка SSH-доступа
    echo "Проверяем SSH-доступ к GitHub..."
    until ssh -T "$SSH_HOST" 2>&1 | grep -q "Hi $GITHUB_USER/$REPO_NAME!"; 
do
        echo "⚠️ SSH-доступ не работает. Убедитесь, что Deploy Key 
добавлен в GitHub."
        echo "Нажмите Enter, когда добавите ключ..."
        read -r
    done
    echo "✅ SSH-доступ к $REPO_NAME установлен."

    # 4. Клонирование или обновление репозитория
    if [ ! -d "$LOCAL_DIR/.git" ]; then
        echo "Клонируем репозиторий $REPO_NAME..."
        git clone "$REMOTE_URL" "$LOCAL_DIR"
    else
        echo "Репозиторий $REPO_NAME уже существует, обновляем remote..."
        cd "$LOCAL_DIR" || exit
        git remote set-url origin "$REMOTE_URL"
    fi

    # 5. Синхронизация ветки main
    cd "$LOCAL_DIR" || exit
    git fetch origin
    git checkout "$BRANCH"
    git reset --hard "origin/$BRANCH"

    echo "✅ Репозиторий $REPO_NAME настроен и синхронизирован."
}

# ----------------------------
# Главный цикл по всем репозиториям
# ----------------------------
for repo in "${REPOS[@]}"; do
    setup_repo $repo
done

echo ""
echo "🎉 Все репозитории настроены и синхронизированы!"
