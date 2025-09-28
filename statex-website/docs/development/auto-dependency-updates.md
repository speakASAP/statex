# 🔄 Автоматическое обновление зависимостей

Этот документ описывает систему автоматического обновления зависимостей в проекте StateX.

## 🚀 Быстрый старт

### Автоматическое обновление всех зависимостей

```bash
# Обновить все зависимости во всех пакетах
npm run update-deps:all

# Или использовать скрипт
./scripts/auto-update-deps.sh
```

### Проверка доступных обновлений

```bash
# Проверить обновления в корневом пакете
npm run update-deps:check

# Проверить обновления во frontend
cd frontend && npm run update-deps:check

# Проверить обновления в backend
cd backend && npm run update-deps:check
```

## 📋 Доступные команды

### Корневой package.json

| Команда | Описание |
|---------|----------|
| `npm run update-deps` | Обновить зависимости до последних версий |
| `npm run update-deps:check` | Проверить доступные обновления |
| `npm run update-deps:interactive` | Интерактивное обновление (выбор пакетов) |
| `npm run update-deps:all` | Обновить все зависимости во всех пакетах |

### Frontend package.json

| Команда | Описание |
|---------|----------|
| `npm run update-deps` | Обновить frontend зависимости |
| `npm run update-deps:check` | Проверить доступные обновления |
| `npm run update-deps:interactive` | Интерактивное обновление |

## 🤖 GitHub Actions

Проект настроен с автоматическим обновлением зависимостей через GitHub Actions:

- **Расписание**: Каждый понедельник в 9:00 AM UTC
- **Триггер**: Автоматически или вручную через workflow_dispatch
- **Действия**:
  1. Проверка доступных обновлений
  2. Автоматическое обновление зависимостей
  3. Тестирование сборки проекта
  4. Создание Pull Request с обновлениями

### Ручной запуск

1. Перейдите в раздел Actions в GitHub
2. Выберите "Auto-update Dependencies"
3. Нажмите "Run workflow"
4. Выберите ветку и запустите

## 🔧 Ручное обновление

### 1. Обновление корневых зависимостей

```bash
# Проверить доступные обновления
npx npm-check-updates

# Обновить все зависимости
npx npm-check-updates -u
npm install
```

### 2. Обновление frontend зависимостей

```bash
cd frontend

# Проверить доступные обновления
npx npm-check-updates

# Обновить все зависимости
npx npm-check-updates -u
npm install

cd ..
```

### 3. Обновление backend зависимостей

```bash
cd backend

# Проверить доступные обновления
npx npm-check-updates

# Обновить все зависимости
npx npm-check-updates -u
npm install

cd ..
```

### 4. Синхронизация package-lock.json

После обновления зависимостей важно скопировать обновленный package-lock.json в frontend директорию для корректной работы Docker:

```bash
cp package-lock.json frontend/
```

## ⚠️ Важные замечания

### Совместимость версий

- **React 19**: Убедитесь, что все пакеты совместимы с React 19
- **Next.js 15**: Проверьте совместимость с Next.js 15
- **TypeScript 5.9**: Убедитесь в совместимости типов

### Тестирование после обновления

После обновления зависимостей обязательно:

1. **Запустить тесты**: `npm run test`
2. **Проверить сборку**: `npm run docker:dev:build`
3. **Тестировать локально**: `npm run dev`

### Откат изменений

Если обновление вызвало проблемы:

```bash
# Откатить package.json
git checkout HEAD -- package.json frontend/package.json backend/package.json

# Переустановить зависимости
rm -rf node_modules package-lock.json
npm install
```

## 📊 Мониторинг обновлений

### Логи обновлений

Все автоматические обновления логируются в `scripts/update-log.txt`:

```bash
# Просмотр логов
cat scripts/update-log.txt

# Последние 10 обновлений
tail -10 scripts/update-log.txt
```

### Уведомления

GitHub Actions отправляет уведомления о:
- Успешных обновлениях
- Ошибках сборки
- Созданных Pull Request

## 🛠️ Устранение неполадок

### Ошибка "peer dependency conflict"

```bash
# Использовать legacy peer deps
npm install --legacy-peer-deps

# Или обновить конфликтующие пакеты
npm update
```

### Ошибка сборки после обновления

```bash
# Очистить кэш
npm cache clean --force

# Переустановить зависимости
rm -rf node_modules package-lock.json
npm install
```

### Проблемы с Docker

```bash
# Пересобрать образы
docker compose -f docker-compose.development.yml down
docker compose -f docker-compose.development.yml up --build -d
```

## 📚 Полезные ссылки

- [npm-check-updates документация](https://github.com/raineorshine/npm-check-updates)
- [GitHub Actions документация](https://docs.github.com/en/actions)
- [npm документация](https://docs.npmjs.com/)
- [Docker документация](https://docs.docker.com/)

## 🤝 Вклад в проект

Если вы нашли проблемы с системой обновления зависимостей:

1. Создайте Issue с описанием проблемы
2. Предложите Pull Request с исправлениями
3. Обновите эту документацию при необходимости
