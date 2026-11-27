# Локальный просмотр

Запуск: powershell -ExecutionPolicy Bypass -File .\start-local.ps1
Адрес: http://localhost:3100/

Скрипт запускает Next dev отдельным скрытым процессом Windows. Логи: local-server.log и local-server-error.log. После перезагрузки компьютера запустите скрипт снова. Production build не требуется.
