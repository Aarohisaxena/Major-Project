"""Utility helpers for preparing frames and working with OpenCV in the API."""

from __future__ import annotations

import base64
import logging
from pathlib import Path
from typing import Optional, Union

import cv2
import numpy as np

LOGGER = logging.getLogger(__name__)


def decode_base64_frame(data: str) -> Optional[np.ndarray]:
    try:
        binary = base64.b64decode(data)
        array = np.frombuffer(binary, dtype=np.uint8)
        frame = cv2.imdecode(array, cv2.IMREAD_COLOR)
        return frame
    except Exception as exc:  # pylint: disable=broad-except
        LOGGER.exception("Failed to decode base64 frame: %s", exc)
        return None


def grab_frame_from_source(source: Optional[Union[str, int]]) -> Optional[np.ndarray]:
    """
    Opens the provided video source (file path or webcam index) and fetches a single frame.
    """
    if source is None:
        return None

    if isinstance(source, str) and source.lower() == "webcam":
        source = 0

    try:
        capture = cv2.VideoCapture(source)
        ok, frame = capture.read()
        capture.release()
        if not ok:
            LOGGER.warning("Unable to read frame from source %s", source)
            return None
        return frame
    except Exception as exc:  # pylint: disable=broad-except
        LOGGER.exception("Failed to read frame from %s: %s", source, exc)
        return None


def default_placeholder_frame(width: int = 640, height: int = 480) -> np.ndarray:
    """
    Returns a placeholder blank frame to keep the API responsive even if no video is available.
    """
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    cv2.putText(
        frame,
        "No video source",
        (40, height // 2),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2,
        cv2.LINE_AA,
    )
    return frame

