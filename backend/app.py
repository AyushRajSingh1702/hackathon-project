from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import os
import uuid
import cv2
import torch

from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer


# ============================================================
# LUNAENHANCE AI
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# FOLDERS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.abspath(
    os.path.join(BASE_DIR, "..", "uploads")
)

OUTPUT_FOLDER = os.path.abspath(
    os.path.join(BASE_DIR, "..", "outputs")
)

WEIGHTS_FOLDER = os.path.join(
    BASE_DIR,
    "weights"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
os.makedirs(WEIGHTS_FOLDER, exist_ok=True)


# ============================================================
# AI DEVICE
# ============================================================

device = "cuda" if torch.cuda.is_available() else "cpu"

print("=" * 60)
print("              🌕 LunaEnhance AI")
print("=" * 60)

print("PyTorch:", torch.__version__)
print("CUDA Available:", torch.cuda.is_available())
print("Device:", device)

if torch.cuda.is_available():

    print(
        "GPU:",
        torch.cuda.get_device_name(0)
    )

    print(
        "VRAM:",
        round(
            torch.cuda.get_device_properties(0).total_memory
            / (1024 ** 3),
            2
        ),
        "GB"
    )

    # Select NVIDIA GPU
    torch.cuda.set_device(0)


# ============================================================
# REAL-ESRGAN MODEL
# ============================================================

MODEL_PATH = os.path.join(
    WEIGHTS_FOLDER,
    "RealESRGAN_x4plus.pth"
)


if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(
        f"Model not found: {MODEL_PATH}"
    )


# ============================================================
# RRDBNET MODEL
# ============================================================

model = RRDBNet(
    num_in_ch=3,
    num_out_ch=3,
    num_feat=64,
    num_block=23,
    num_grow_ch=32,
    scale=4
)


# ============================================================
# REAL-ESRGAN UPSAMPLER
# ============================================================

upsampler = RealESRGANer(

    scale=4,

    model_path=MODEL_PATH,

    model=model,

    # RTX 3050 4GB SAFE TILE
    tile=128,

    tile_pad=10,

    pre_pad=0,

    # FP16 for NVIDIA GPU
    half=(device == "cuda")
)


print()
print("Real-ESRGAN x4 loaded successfully")

if device == "cuda":
    print("🚀 GPU Acceleration: ENABLED")
    print("🎮 NVIDIA GPU:", torch.cuda.get_device_name(0))
    print("⚡ Precision: FP16")
    print("🧩 Tile Size: 128")
else:
    print("⚠️ GPU not available. Running on CPU.")

print("=" * 60)


# ============================================================
# HOME / STATUS
# ============================================================

@app.route("/")
def home():

    return jsonify({

        "status":
            "success",

        "message":
            "LunaEnhance AI backend is running 🌕",

        "model":
            "Real-ESRGAN x4",

        "device":
            device,

        "gpu":
            torch.cuda.get_device_name(0)
            if torch.cuda.is_available()
            else "CPU",

        "cuda":
            torch.cuda.is_available()

    })


# ============================================================
# ENHANCE IMAGE
# ============================================================

@app.route("/enhance", methods=["POST"])
def enhance_image():

    try:

        # ----------------------------------------------------
        # CHECK IMAGE
        # ----------------------------------------------------

        if "image" not in request.files:

            return jsonify({

                "status":
                    "error",

                "message":
                    "No image uploaded"

            }), 400


        file = request.files["image"]


        if file.filename == "":

            return jsonify({

                "status":
                    "error",

                "message":
                    "No image selected"

            }), 400


        # ----------------------------------------------------
        # UNIQUE FILE ID
        # ----------------------------------------------------

        file_id = str(uuid.uuid4())


        # ----------------------------------------------------
        # FILE PATHS
        # ----------------------------------------------------

        input_path = os.path.join(

            UPLOAD_FOLDER,

            file_id + ".jpg"

        )


        output_path = os.path.join(

            OUTPUT_FOLDER,

            file_id + "_enhanced.png"

        )


        # ----------------------------------------------------
        # SAVE UPLOADED IMAGE
        # ----------------------------------------------------

        file.save(input_path)


        # ----------------------------------------------------
        # READ IMAGE
        # ----------------------------------------------------

        image = cv2.imread(

            input_path,

            cv2.IMREAD_COLOR

        )


        if image is None:

            return jsonify({

                "status":
                    "error",

                "message":
                    "Invalid image file"

            }), 400


        # ----------------------------------------------------
        # INFORMATION
        # ----------------------------------------------------

        print()
        print("=" * 60)

        print(
            "Processing:",
            file.filename
        )

        print(
            "Device:",
            device
        )

        print(
            "Original:",
            image.shape[1],
            "x",
            image.shape[0]
        )


        # ----------------------------------------------------
        # GPU MEMORY BEFORE AI
        # ----------------------------------------------------

        if torch.cuda.is_available():

            torch.cuda.empty_cache()

            memory_before = (
                torch.cuda.memory_allocated()
                / (1024 ** 2)
            )

            print(
                "GPU Memory Before:",
                round(memory_before, 1),
                "MB"
            )


        # ====================================================
        # AI SUPER RESOLUTION
        # ====================================================

        output, _ = upsampler.enhance(

            image,

            outscale=4

        )


        print(

            "AI Output:",

            output.shape[1],

            "x",

            output.shape[0]

        )


        # ----------------------------------------------------
        # GPU MEMORY AFTER AI
        # ----------------------------------------------------

        if torch.cuda.is_available():

            memory_after = (

                torch.cuda.memory_allocated()
                / (1024 ** 2)

            )

            print(

                "GPU Memory After:",

                round(memory_after, 1),

                "MB"

            )


        # ====================================================
        # GENTLE DENOISING
        # ====================================================

        output = cv2.fastNlMeansDenoisingColored(

            output,

            None,

            1,

            1,

            7,

            21

        )


        # ====================================================
        # LOCAL CONTRAST ENHANCEMENT
        # ====================================================

        lab = cv2.cvtColor(

            output,

            cv2.COLOR_BGR2LAB

        )


        l, a, b = cv2.split(lab)


        clahe = cv2.createCLAHE(

            clipLimit=1.2,

            tileGridSize=(8, 8)

        )


        l = clahe.apply(l)


        output = cv2.cvtColor(

            cv2.merge((l, a, b)),

            cv2.COLOR_LAB2BGR

        )


        # ====================================================
        # VERY LIGHT SHARPENING
        # ====================================================

        blurred = cv2.GaussianBlur(

            output,

            (0, 0),

            1.0

        )


        output = cv2.addWeighted(

            output,

            1.12,

            blurred,

            -0.12,

            0

        )


        # ====================================================
        # 4K-CLASS OUTPUT LIMIT
        # ====================================================

        height, width = output.shape[:2]

        max_dimension = 3840


        if max(width, height) > max_dimension:

            scale = (

                max_dimension
                / max(width, height)

            )


            new_width = int(

                width * scale

            )


            new_height = int(

                height * scale

            )


            output = cv2.resize(

                output,

                (
                    new_width,
                    new_height
                ),

                interpolation=cv2.INTER_AREA

            )


        # ====================================================
        # SAVE HIGH QUALITY PNG
        # ====================================================

        success = cv2.imwrite(

            output_path,

            output,

            [

                cv2.IMWRITE_PNG_COMPRESSION,

                1

            ]

        )


        if not success:

            raise RuntimeError(
                "Failed to save enhanced image"
            )


        # ====================================================
        # FINAL INFORMATION
        # ====================================================

        print(

            "Final:",

            output.shape[1],

            "x",

            output.shape[0]

        )


        print(

            "Saved:",

            output_path

        )


        print(

            "Device Used:",

            device

        )


        print("=" * 60)


        # ====================================================
        # CLEAN GPU CACHE
        # ====================================================

        if torch.cuda.is_available():

            torch.cuda.empty_cache()


        # ====================================================
        # RESPONSE
        # ====================================================

        return jsonify({

            "status":
                "success",

            "message":
                "AI super-resolution completed successfully",

            "model":
                "Real-ESRGAN x4",

            "device":
                device,

            "gpu":
                torch.cuda.get_device_name(0)
                if torch.cuda.is_available()
                else "CPU",

            "original_width":
                int(image.shape[1]),

            "original_height":
                int(image.shape[0]),

            "enhanced_width":
                int(output.shape[1]),

            "enhanced_height":
                int(output.shape[0]),

            "output":
                f"/result/{file_id}_enhanced.png"

        })


    # ========================================================
    # ERROR HANDLING
    # ========================================================

    except Exception as e:

        print()
        print("❌ ERROR:", str(e))

        if torch.cuda.is_available():

            torch.cuda.empty_cache()


        return jsonify({

            "status":
                "error",

            "message":
                "AI enhancement failed",

            "error":
                str(e)

        }), 500


# ============================================================
# VIEW RESULT
# ============================================================

@app.route("/result/<filename>")
def result(filename):

    return send_from_directory(

        OUTPUT_FOLDER,

        filename

    )


# ============================================================
# DOWNLOAD RESULT
# ============================================================

@app.route("/download/<filename>")
def download_file(filename):

    return send_from_directory(

        OUTPUT_FOLDER,

        filename,

        as_attachment=True,

        download_name=
            "LunaEnhance_Enhanced.png"

    )


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    app.run(

        host="127.0.0.1",

        port=5000,

        debug=True

    )