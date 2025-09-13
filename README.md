# Companies API - Next.js 13 App Router

A RESTful API built with **Next.js 13 (App Router)** and **MongoDB** for managing company data.  
Supports CRUD operations, bulk inserts, adding benefits, pushing interview rounds, and full-text search.

---

## 🌐 Links

- **Postman Documentation:** [View Postman Docs](https://documenter.getpostman.com/view/47489755/2sB3HopzZu)  
- **Deployed App:** [Next.js App](https://next-app-woad-xi.vercel.app/)

---

## 🗂 Project Overview

This API allows you to:

- Insert one or multiple companies
- Fetch company data (all, paginated, or by ID)
- Update company fields dynamically
- Delete companies
- Add benefits to companies
- Push interview rounds
- Search companies by name or skills
- Count companies and filter by location

MongoDB is used as the database, with connection via `clientPromise` to reuse connections efficiently.

---

## ⚡ API Routes

# API Documentation

## Base URLs

### Purpose: Return all companies
- **Inputs**: none (optional `?limit=10&page=1`)
- **Example**: `curl http://localhost:3000/api/companies`
- **Method**: `GET`
- **Endpoint**: `/api/companies`

### Purpose: Insert one company document
- **Inputs**: JSON body (at least `{ name, location }`)
- **Example**: `curl -X POST -H "Content-Type: application/json" -d '{"name":"Tesla","location":"Bangalore"}' http://localhost:3000/api/companies`
- **Method**: `POST`
- **Endpoint**: `/api/companies`

### Purpose: Simple query helper: `?city=Hyderabad&minBase=30`
- **Inputs**: query params `city`, `minBase`, `skill` (optional)
- **Example**: `curl "http://localhost:3000/api/companies/search?city=Bangalore&minBase=25"`
- **Method**: `GET`
- **Endpoint**: `/api/companies/search`

### Purpose: Pagination support: `?page=1&limit=10`
- **Inputs**: `page`, `limit`
- **Example**: `curl "http://localhost:3000/api/companies/paginate?page=2&limit=5"`
- **Method**: `GET`
- **Endpoint**: `/api/companies/paginate`

### Purpose: Return total number of companies and optional counts by location
- **Inputs**: none or `?location=Bangalore`
- **Example**: `curl http://localhost:3000/api/companies/count`
- **Method**: `GET`
- **Endpoint**: `/api/companies/count`

### Purpose: Get single company by `_id`
- **Inputs**: path param `id`
- **Example**: `curl http://localhost:3000/api/companies/64a...`
- **Method**: `GET`
- **Endpoint**: `/api/companies/[id]`

### Purpose: Update company fields by id (partial updates via `$set`)
- **Inputs**: path param `id`, JSON body with fields to update
- **Example**: `curl -X PUT -H "Content-Type: application/json" -d '{"headcount":2200}' http://localhost:3000/api/companies/<id>`
- **Method**: `PUT`
- **Endpoint**: `/api/companies/[id]`

### Purpose: Delete a company by id
- **Inputs**: path param `id`
- **Example**: `curl -X DELETE http://localhost:3000/api/companies/<id>`
- **Method**: `DELETE`
- **Endpoint**: `/api/companies/[id]`

### Purpose: Insert many companies at once (insertMany) — useful for seeding test data
- **Inputs**: JSON array in body
- **Example**: `curl -X POST -H "Content-Type: application/json" -d '[{...},{...}]' http://localhost:3000/api/companies/bulk`
- **Method**: `POST`
- **Endpoint**: `/api/companies/bulk`

### Purpose: Push a new benefit to benefits array (`$addToSet` or `$push`)
- **Inputs**: path `id`, body `{ benefit: "WFH" }`
- **Example**: `curl -X PATCH -H "Content-Type: application/json" -d '{"benefit":"WFH"}' http://localhost:3000/api/companies/<id>/add-benefit`
- **Method**: `PATCH`
- **Endpoint**: `/api/companies/[id]/add-benefit`

### Purpose: Push an interview round to interviewRounds (array)
- **Inputs**: body `{ round: 5, type: "CTO Interview" }`
- **Example**: `curl -X PATCH -H "Content-Type: application/json" -d '{"round":5,"type":"CTO Interview"}' http://localhost:3000/api/companies/<id>/push-round`
- **Method**: `PATCH`
- **Endpoint**: `/api/companies/[id]/push-round`

### Purpose: Full-text (or simple regex) search on name or hiringCriteria.skills
- **Inputs**: `?q=system` or `?skill=Java`
- **Example**: `curl "http://localhost:3000/api/companies/text-search?q=design"`
- **Method**: `GET`
- **Endpoint**: `/api/companies/text-search`
