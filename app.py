"""FastAPI app that exposes the ML models over HTTP for the dashboard."""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .detectors import DetectionResult, EmotionDetector, ViolenceDetector, WeaponDetector
from .utils import decode_base64_frame, default_placeholder_frame, grab_frame_from_source

LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODELS_ROOT = PROJECT_ROOT / "RJPOLICE_HACK_694_Defenders_3-master" / "RJPOLICE_HACK_694_Defenders_3-master" / "AI_ML_models"
DEFAULT_FEED = PROJECT_ROOT / "FrontEnd" / "assets" / "videos" / "sample_feed.mp4"


class DetectionRequest(BaseModel):
    frame: Optional[str] = None  # base64 encoded image data
    video_source: Optional[str] = None  # file path or "webcam"


class DetectionResponse(BaseModel):
    detector: str
    label: str
    confidence: float
    alert: bool
    timestamp: str
    metadata: Optional[Dict[str, float]] = None


app = FastAPI(title="Railway Safety AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DETECTORS: Dict[str, object] = {}


def _load_detectors() -> None:
    LOGGER.info("Loading ML models from %s", MODELS_ROOT)
    DETECTORS["emotion"] = EmotionDetector(
        model_path=MODELS_ROOT / "emotionModel" / "model.h5",
        cascade_path=MODELS_ROOT / "emotionModel" / "haarcascade_frontalface_default.xml",
    )
    DETECTORS["violence"] = ViolenceDetector(
        model_path=MODELS_ROOT / "ViolenceModel" / "model" / "model.h5", threshold=0.9
    )
    DETECTORS["weapon"] = WeaponDetector(
        model_path=MODELS_ROOT / "weaponDetection" / "Weapon_detection.h5"
    )


@app.on_event("startup")
def startup_event() -> None:
    _load_detectors()
    if not DEFAULT_FEED.exists():
        LOGGER.warning(
            "Sample video feed not found at %s. Upload your own feed or send frames from the frontend.",
            DEFAULT_FEED,
        )


@app.get("/api/health", tags=["health"])
def health() -> Dict[str, str]:
    return {"status": "ok", "detectors": ",".join(sorted(DETECTORS.keys()))}


def _should_alert(detector: str, result: DetectionResult) -> bool:
    if detector == "emotion":
        return result.label in {"Angry", "Fear", "Sad", "Disgust"} and result.confidence >= 0.6
    if detector == "violence":
        return result.label == "Violence Detected" and result.confidence >= 0.9
    if detector == "weapon":
        return result.label != "No Weapon" and result.label != "Unknown Weapon" and result.confidence >= 0.5
    return False


def _resolve_frame(payload: DetectionRequest):
    frame = None
    if payload.frame:
        frame = decode_base64_frame(payload.frame)
    if frame is None:
        source = payload.video_source or (str(DEFAULT_FEED) if DEFAULT_FEED.exists() else None)
        frame = grab_frame_from_source(source)
    if frame is None:
        frame = default_placeholder_frame()
    return frame


@app.post("/api/detect/{detector}", response_model=DetectionResponse, tags=["detection"])
def detect(detector: str, payload: DetectionRequest) -> DetectionResponse:
    detector = detector.lower()
    if detector not in DETECTORS:
        raise HTTPException(status_code=404, detail=f"Detector '{detector}' not available")

    frame = _resolve_frame(payload)
    result: DetectionResult = DETECTORS[detector].analyze_frame(frame)
    alert = _should_alert(detector, result)

    return DetectionResponse(
        detector=detector,
        label=result.label,
        confidence=float(result.confidence),
        alert=alert,
        metadata=result.metadata,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

