# PrepPilot AI — AI Exam Notes Platform

PrepPilot AI is an AI-powered study platform designed to help students prepare for exams by turning topics into structured revision material.

## Overview

The application uses the Gemini API to generate study content, including structured notes, diagrams, charts, and graphs, with a revision mode for reviewing material.

## Core capabilities

- AI-assisted exam-note generation using the Gemini API
- Structured study content with diagrams, charts, and graphs
- Revision mode to support review of generated material
- Google OAuth authentication
- Credit-based usage model
- JWT-protected backend endpoints
- PDF export and checkout workflows
- Stripe integration for tiered pricing plans

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI integration | Gemini API |
| Authentication | Google OAuth, JWT |
| Payments | Stripe |
| Deployment | Render |

## Architecture at a glance

1. The React frontend provides the study workflow and user interface.
2. The Express backend exposes REST API endpoints for authentication, note generation, PDF export, and checkout.
3. MongoDB supports application data persistence.
4. The Gemini API powers AI-assisted study-content generation.
5. Google OAuth and JWT support authentication and protected API access.
6. Stripe supports payment checkout and tiered plans.

## Local setup

The repository contains `frontend/` and `backend/` directories. Setup commands and required environment variables depend on the current implementation in those directories. Configure API credentials and payment secrets through environment variables; do not commit secrets to the repository.

Before running locally, inspect the package/dependency manifests in each directory, install the listed dependencies, and configure the required environment values.

## Deployment

The project has been deployed on Render. Add the live application URL here if it is currently available.

## Engineering notes

- Keep API keys, OAuth secrets, database credentials, and Stripe secrets out of source control.
- Document the required environment variables using an `.env.example` file with placeholder values only.
- Add screenshots or a short demo so reviewers can quickly understand the user experience.
- Include setup commands and automated tests as the implementation stabilizes.

## Project context

This project is part of my full-stack development work, combining frontend development, REST API design, database integration, authentication, AI API integration, and payment workflows.
