# GameStore

Digital Game Marketplace

Full-stack digital video game distribution platform built with **Node.js**, **Express**, and **Microsoft SQL Server**. The application manages a dual-role eco-system catering to both **Gamers (Clients)** looking to purchase and review games, and **Game Developers (Devs)** aiming to publish titles and track financial sales analytics.

---

- **Runtime Environment:** Node.js (ES Modules syntax)
- **Backend Framework:** Express.js
- **Database Engine:** Microsoft SQL Server (MSSQL) via relational stored procedures
- **File Management:** Multer (Local disk storage allocation with collision-resistant prefixing)
- **Security & Cross-Origin:** CORS enabled, centralized database-level authentication checking

---

## ✨ Features
- **Role-Based Registrations:** Distinct workflows and interfaces for `CLIENT` and `DEV` users.
- **Account Control:** Secure Login/Signup checks alongside customizable profile details, descriptions, and custom avatar media handling.
- **Publishing Pipeline:** Direct endpoint handling for game titles, descriptions, pricing structures (`Money` types), and genre tagging.
- **Deep Analytics:** Native dashboards detailing total gross sales, specific game-by-game revenue streams, and system-wide visibility metrics.
- **Smart Queries:** Performance-optimized queries retrieving top-50 batches of active listings, filtered genre pairings, and real-time calculated average review scores.
- **Order Processing:** Transaction management monitoring checkout ids, relative quantities, and inventory logging.
- **Feedback Loop:** Player scoring and comment reviews directly tied to active titles to influence community discovery algorithms.

---

## API Reference Endpoints

### Marketplace
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/games` | Returns top 50 active marketplace games |
| `GET` | `/api/games_genres` | Returns 50 games mapped to their relative genres |
| `GET` | `/api/games_avg` | Returns top 50 games sorted by average review scores |
| `GET` | `/api/genres` | Fetches list of all globally supported game genres |

### Authentication & Profiles
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/signup` | Registers new user; validates username uniqueness |
| `POST` | `/api/login` | Authenticates sessions and returns user metadata |
| `POST` | `/api/update_profile`| Modifies bio data, birthday, and avatar variables |
| `POST` | `/api/get_user` | Pulls core data profile for a target user ID |

### Developer Management
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/upload_game` | Publishes a brand-new title to the storefront |
| `POST` | `/api/update_game` | Edits details, genres, pricing, or images for a game |
| `POST` | `/api/dev_games` | Pulls all titles associated with a single Developer ID |
| `POST` | `/api/toggle_game` | Toggles availability state (Enable/Disable) of a game |

### Transactions & Social
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/order` | Submits a new purchase order for a game |
| `POST` | `/api/user_games` | Retrieves an inventory of all games owned by a user |
| `POST` | `/api/review` | Posts a numerical score and text review for a game |

### System Administration & Analytics
| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/get_count` | Returns total system counts filtering by `users`, `devs`, or `games` |
| `POST` | `/api/dev_sales` | Compiles total gross financial sales summary for a developer |
| `POST` | `/api/dev_per_game_sales`| Breaks down individual revenue metrics per title for a developer |
| `POST` | `/api/all_game_sales` | Administrative search/filter across all sales history data |

---

## Database Requirements

The application relies entirely on an MSSQL database connection handling heavy lifting via **Stored Procedures**. Ensure your server instance contains the following compiled routines:

- `SP_SIGNUP_USER`, `SP_LOGIN_USER`, `SP_GET_USERS_BY_USERNAME`
- `SP_GET_GAMES`, `SP_GET_GAMES_GENRES`, `SP_GET_GAMES_AVG`, `SP_GET_GAMES_BY_DEV`
- `SP_ADD_GAME`, `SP_UPDATE_GAME`, `SP_TOGGLE_DISABLE_GAME`
- `SP_ADD_NEW_ORDER`, `SP_GET_USER_PURCHASED_GAMES`
- `SP_ADD_REVIEW`, `SP_UPDATE_PROFILE`, `SP_GET_USER`
- `SP_GET_SALES_REPORT_BY_DEV`, `SP_GET_PER_GAME_SALES_REPORT_BY_DEV`, `SP_GET_ALL_PER_GAME_SALES`
- `SP_GET_ALL_USERS_COUNT`, `SP_GET_DEV_COUNT`, `SP_GET_ALL_GAMES_COUNT`

---

## Quick Start

### 1. Prerequisites
- **Node.js** (v16.x or higher recommended)
- **MSSQL Server** instance with configurations mapped out

### 2. File Architecture Verification
Ensure your local project directory includes your structural DB credentials hook alongside the target static frontend folder:
```text
├── db.js                 # Contains database connectivity definitions (connect, sql)
├── server.js             # Main server execution script (The provided file)
└── frontend/             # Root directory for web assets
    └── dashboard.html    # Base index panel served on home route '/'
