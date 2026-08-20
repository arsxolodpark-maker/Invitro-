# INVITRO Marketplace — Technical Platform, Deployment & Security v0.1

**Дата:** 20.08.2026  
**Статус:** первичный технический слой; FACT / DECISION / TARGET / TBD разделены.

## Короткий вывод

Добавить инфраструктуру и безопасность сейчас, но не строить production-контур преждевременно. Для текущего статического прототипа Docker не обязателен. Для будущей разработки Docker принимается как базовый способ упаковки сервисов; Kubernetes и конкретный runtime остаются TBD до разговора с инфраструктурой INVITRO.

## Current state — FACT

- Публичный GitHub-репозиторий и GitHub Pages.
- Статический HTML/CSS/JS, без backend и БД.
- GitHub Actions deployment.
- Playwright E2E + desktop/mobile smoke.
- Только demo/synthetic data.
- Docker в runtime текущего прототипа не используется.

> Публичный GitHub/Pages нельзя использовать для production-хранения реальных документов, списков сотрудников, персональных или медицинских данных.

## Target architecture

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

## Security baseline

- SSO/IAM/RBAC/least privilege.
- HTTPS/TLS.
- Secrets только в secret manager/CI secrets.
- Защищённое document storage, ACL, audit, retention.
- Минимизация данных employee roster.
- Результаты по умолчанию остаются в существующем медицинском контуре.
- SAST/dependency/secret scan, DAST/pentest перед production по корпоративным правилам.
- Audit trail критических действий.

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

## Next step

Провести implementation-discovery с инфраструктурой/ИБ INVITRO и после этого выпустить **NFR / DevOps / Security Requirements v1.0**. До этого текущий v0.6 остаётся простым demo-contour без real data.
