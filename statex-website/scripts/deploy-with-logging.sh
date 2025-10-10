#!/bin/bash

# Скрипт развертывания с детальным логированием
# Запускать в директории ~/statex

set -e

echo "🚀 Запуск развертывания Statex с детальным логированием..."
echo "================================================"

# Проверяем, что мы в правильной директории
if [ ! -f "docker-compose.production.yml" ]; then
    echo "❌ Ошибка: docker-compose.production.yml не найден"
    echo "   Запустите скрипт из директории ~/statex"
    exit 1
fi

# Шаг 1: Остановка существующих контейнеров
echo ""
echo "🛑 Шаг 1: Остановка существующих контейнеров..."
docker compose -f docker-compose.production.yml stop -v
echo "✅ Контейнеры остановлены"

# Шаг 2: Очистка Docker cache
echo ""
echo "🧹 Шаг 2: Очистка Docker cache..."
docker system prune -f
echo "✅ Docker cache очищен"

# Шаг 3: Запуск production сборки с детальным логированием
echo ""
echo "🏗️  Шаг 3: Запуск production сборки..."
echo "   Это может занять 10-20 минут на первом запуске..."
echo "   Логи будут показываться в реальном времени..."

# Запускаем сборку с детальным выводом
docker compose -f docker-compose.production.yml build --progress=plain --no-cache

echo ""
echo "✅ Сборка завершена!"

# Шаг 4: Запуск контейнеров
echo ""
echo "🚀 Шаг 4: Запуск контейнеров..."
docker compose -f docker-compose.production.yml up -d

# Шаг 5: Мониторинг запуска
echo ""
echo "📊 Шаг 5: Мониторинг запуска сервисов..."
echo "   Ожидание запуска (30 секунд)..."

sleep 30

echo ""
echo "📋 Статус контейнеров:"
docker ps --filter "name=statex" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Шаг 6: Проверка логов
echo ""
echo "📋 Шаг 6: Проверка логов..."
echo "================================================"

echo "🔍 Логи frontend (statex.cz):"
docker logs statex.cz --tail 10

echo ""
echo "🔍 Логи backend (api.statex.cz):"
docker logs api.statex.cz --tail 10

echo ""
echo "🔍 Логи www subdomain (www.statex.cz):"
docker logs www.statex.cz --tail 10

echo ""
echo "🎉 Развертывание завершено!"
echo "================================================"
echo "🌐 Frontend: https://statex.cz"
echo "🔌 API: https://api.statex.cz"
echo "🌐 WWW: https://www.statex.cz"
echo ""
echo "📊 Мониторинг в реальном времени:"
echo "   docker ps --filter 'name=statex'"
echo "   docker logs -f statex.cz"
echo "   docker logs -f api.statex.cz"
echo ""
echo "🛑 Остановка:"
echo "   docker compose -f docker-compose.production.yml down"
