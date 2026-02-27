# Security Measures

## Implemented

### 1. JWT Expiration
- **Default**: 7 days (`JWT_EXPIRY=7d` in `.env`)
- Tokens are rejected when expired; auth middleware returns `"Token expired. Please log in again."`
- Override via `JWT_EXPIRY` env var (e.g. `24h`, `30m`)

### 2. Device Ownership Validation
- **Location report**: Only accepts reports for devices owned by the authenticated user
- **Commands** (ring, lock, wipe): Only executes for user's devices
- **Device registration**: Prevents device ID spoofing — if a deviceId is already registered to another account, returns `403 Device already registered to another account`

### 3. Invalid Device ID Rejection
- **Format**: Alphanumeric + hyphen, 8–64 chars (covers Android ID, UUID)
- **Applied to**: `/location/report`, `/location/:deviceId/*`, `/devices/register`, `/devices/:deviceId/heartbeat`, `/commands/:deviceId/*`, `/sightings/:deviceId/*`
- Invalid IDs return `400 Invalid device ID format`

### 4. Rate Limiting
| Endpoint        | Limit              | Purpose                    |
|----------------|--------------------|----------------------------|
| Auth (login/register) | 20 req / 15 min / IP | Brute force protection     |
| Location report       | 30 req / min / IP   | Spam prevention            |
| All API               | 200 req / min / IP  | General abuse prevention    |

## Production Checklist

- [ ] Set strong `JWT_SECRET` (min 32 chars, random)
- [ ] Use HTTPS (reverse proxy: nginx, Caddy)
- [ ] Set `JWT_EXPIRY` appropriately (e.g. `7d` or `24h`)
- [ ] Ensure MongoDB is not exposed publicly
- [ ] Review rate limits for your traffic patterns
