# INVITRO Marketplace — Technical Platform, Deployment & Security v0.1

**Дата:** 20.08.2026  
**Обновлено:** 14.09.2026  
**Статус:** первичный технический слой; FACT / DECISION / TARGET / TBD разделены.

## Короткий вывод

Инфраструктуру и безопасность фиксируем до production-разработки, но не усложняем текущий статический prototype преждевременно. GitHub становится source of truth для кода, версий, документации и CI/QA. Cloudflare Pages — целевой demo/production hosting-контур для статического front-end. Docker добавляется при появлении backend/API/worker; Kubernetes и конкретный production runtime остаются TBD до разговора с инфраструктурой INVITRO.

## Current state — FACT

- GitHub-репозиторий — source of truth.
- Статический HTML/CSS/JS, без backend и БД.
- GitHub Actions: Playwright E2E + desktop/mobile smoke + Release Gate.
- QA гоняется на том же packaged artifact `dist`, который предназначен для Cloudflare.
- Только demo/synthetic data.
- Docker в runtime текущего прототипа не используется.
- Ветка `release` предназначена для production deployment в Cloudflare и продвигается только после успешного E2E на `main`.

> Публичный GitHub/Cloudflare Pages нельзя использовать для production-хранения реальных документов, списков сотрудников, персональных или медицинских данных.

## Delivery architecture — DECISION

`локальная / AI-разработка → GitHub main → CI/QA → Release Gate → GitHub release → Cloudflare Pages → stable URL`

Роли:

- **GitHub** — source of truth, versioning, docs, CI/QA.
- **GitHub Actions** — Release Gate.
- **Cloudflare Pages** — hosting, CDN, preview/production URL.
- **release branch** — production branch Cloudflare.
- **GitHub Pages** — не целевой hosting; допускается временный fallback на период миграции.

Cloudflare Pages settings:

- Production branch: `release`
- Build command: `bash scripts/build-cloudflare.sh dist`
- Build output directory: `dist`
- Root directory: `/`

## Target application architecture

Browser → Web frontend → API/BFF → Integration Gateway → Unified DKP / Bitrix (TBD) / Catalog / Document storage / Billing-EDO / Existing results contour.

## Docker

- Не добавлять Docker только ради статического demo.
- При появлении backend/API-mock/worker — Dockerfile на deployable component.
- docker compose для локальной разработки.
- Private registry для production images.
- Container/dependency/secret scanning в CI.
- Kubernetes/OpenShift/VM — TBD по корпоративному стандарту.

## Environments

DEV → TEST → STAGE → PROD. Реальные данные допускаются только после Security Gate и по утверждённым правилам.

Для статического prototype до появления корпоративного runtime допускается:

- `main` — integration/source branch;
- branch/PR previews — development validation;
- `release` — только green build для Cloudflare demo/production.

## Security baseline

- SSO/IAM/RBAC/least privilege.
- HTTPS/TLS.
- Secrets только в secret manager/CI secrets.
- Защищённое document storage, ACL, audit, retention.
- Минимизация данных employee roster.
- Результаты по умолчанию остаются в существующем медицинском контуре.
- SAST/dependency/secret scan, DAST/pentest перед production по корпоративным правилам.
- Audit trail критических действий.
- Для публичного demo: security headers, запрет индексации, отсутствие real data/secrets.

## Infrastructure & Security Gate

1. Production hosting/runtime и owner.
2. DEV/TEST/STAGE/PROD.
3. IAM/SSO/RBAC/MFA.
4. Secret manager/certificates.
5. Data classification + retention/delete policy.
6. Protected PDF storage + upload security.
7. Owners + API contracts: DKP/Bitrix/catalog/docs/results.
8. CI/CD security + rollback.
9. Logging/monitoring/audit/alerting.
10. Security + infrastructure + product production approval.

## Release Gate для публичного demo

1. Требования синхронизированы.
2. Packaged artifact собран в `dist`.
3. E2E PASS.
4. Desktop visual QA PASS.
5. Mobile visual QA PASS.
6. Console/JS errors отсутствуют.
7. `main` продвинут в `release` только после PASS.
8. Cloudflare deployment завершён.
9. Smoke-check Cloudflare URL PASS.
10. Только после этого статус `DEMO READY` и ссылка внешнему пользователю.

## Главные TBD

- Production runtime: Kubernetes/OpenShift/VM/PaaS?
- Corporate container registry/base images?
- IAM/SSO/secret manager?
- Mandatory security controls?
- Exact personal data fields and retention?
- What is the actual unified DKP front; role of Bitrix?
- Catalog/price source and update API?
- Contract/invoice/act/EDO source?
- SLA/RPO/RTO?
- Final custom domain / DNS owner for public demo and production.

## Next step

1. Подключить GitHub repository к Cloudflare Pages.
2. Выбрать production branch `release`.
3. Указать build command/output directory.
4. Получить Cloudflare preview/production URL.
5. Пройти Release Gate уже на Cloudflare.
6. После этого GitHub Pages перестаёт быть рабочей публичной ссылкой и остаётся только fallback до окончательного отключения.
7. Перед production с real data провести implementation-discovery с инфраструктурой/ИБ INVITRO и выпустить **NFR / DevOps / Security Requirements v1.0**.
