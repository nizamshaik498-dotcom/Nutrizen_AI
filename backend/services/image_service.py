import os
import cv2
import tempfile
import logging

logger = logging.getLogger(__name__)


def preprocess_image(image_path: str) -> str:
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image at {image_path}")

        img = cv2.resize(img, (1024, 1024))

        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge([l, a, b])
        img = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

        img = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)

        tmp_dir = tempfile.gettempdir()
        output_path = os.path.join(tmp_dir, f"processed_{os.path.basename(image_path)}")
        cv2.imwrite(output_path, img)

        logger.info(f"Image processed and saved to {output_path}")
        return output_path

    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        raise
