# ---- Build stage: install all deps and build the React frontend ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY airbnb-api/package*.json ./airbnb-api/

RUN npm ci --ignore-scripts \
 && npm --prefix airbnb-api ci --ignore-scripts

COPY . .
RUN npm run build

# ---- Runtime stage: smaller image with only prod backend deps + built frontend ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY airbnb-api/package*.json ./airbnb-api/
RUN npm --prefix airbnb-api ci --omit=dev --ignore-scripts

COPY --from=build /app/airbnb-api ./airbnb-api
COPY --from=build /app/dist ./dist

EXPOSE 4000
CMD ["node", "airbnb-api/index.js"]
