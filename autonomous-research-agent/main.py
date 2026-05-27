from fastapi import FastAPI

from api.routes import router

app = FastAPI(
    title="Research Agent Engine",
    version="0.1.0",
)

app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "ok"}