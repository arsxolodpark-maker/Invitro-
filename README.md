# INVITRO Marketplace

Отдельный продуктовый проект по B2B/B2G-маршруту INVITRO для организаций и малых закупок.

> Не смешивать с ПРИИЗ и интерактивной картой INVITRO.

## Текущий статус

- актуальный прототип: v0.6;
- клиентский B2B-front пересобран после обратной связи владельца процесса;
- малые закупки встроены в общий раздел «Для организаций»;
- каталог и корзина доступны до регистрации организации;
- корпоративная заявка: корзина → параметры → ИНН/реквизиты → PDF-документы → корпоративный менеджер;
- единый фронт ДКП рассматривается как отдельный сквозной внутренний контур;
- desktop/mobile Playwright E2E и ручной visual QA входят в Release Gate;
- публичный клиентский слой очищен от внутренней терминологии прототипа;
- отдельный technical layer: `docs/Technical_Platform_Deployment_Security_v0.1.md`.

## Продуктовый путь v0.6

`Для организаций → Малые закупки → Каталог → Карточка услуги/программы → Корзина → Параметры → Регистрация организации → Документы → Корпоративный менеджер → КП → Договор/счёт → Сотрудники → Исполнение → Закрытие`

## Инженерное правило

`локальная / AI-разработка → GitHub → CI/QA → Release Gate → Cloudflare → стабильный URL`

- **GitHub** — source of truth: код, версии, документация, CI/QA.
- **GitHub Actions** — Release Gate.
- **Cloudflare Pages** — preview/production hosting и стабильный demo URL.
- **release** — ветка, которую Cloudflare должен использовать как production branch.
- Ветка `release` обновляется автоматически только после успешного E2E на `main`.
- **Docker** добавляется, когда появляются backend/API/worker/сложное окружение; для текущего статического prototype не нужен.
- GitHub Pages больше не является целевым production/demo hosting-контуром; его можно временно сохранять как fallback до завершения миграции.

## Cloudflare Pages settings

После подключения GitHub-репозитория в Cloudflare:

- Production branch: `release`
- Build command: `bash scripts/build-cloudflare.sh dist`
- Build output directory: `dist`
- Root directory: `/`

Cloudflare должен публиковать только содержимое `dist`, а не весь repository.

## Release Gate

Перед внешней ссылкой обязательны:

1. актуальные подтверждённые требования;
2. полный пользовательский сценарий;
3. browser E2E;
4. desktop visual QA;
5. mobile visual QA;
6. отсутствие console/JS errors;
7. проверка первого экрана новым пользователем;
8. синхронность кода, prototype и документации;
9. successful promotion `main → release`;
10. smoke-check Cloudflare deployment.

Только после этого статус **DEMO READY**.

## Продуктовый принцип

Marketplace не должен становиться новым ЛИС, бухгалтерской системой, ЭДО или системой медицинских результатов. Где возможно, используются существующие контуры INVITRO через защищённые интеграции/deep-links.

## Этап №2

Внешний marketplace нескольких лабораторий и сравнение предложений — отдельный следующий этап после проверки внутреннего marketplace INVITRO.
