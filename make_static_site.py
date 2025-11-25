import os
import shutil
import json
from PIL import Image, ImageDraw, ImageFont
import requests
from io import BytesIO
from textwrap import wrap

EMBED_WIDTH = 640
EMBED_HEIGHT = 360
BORDER_THICKNESS = 12
PADDING = 16
NAME_FONT_SIZE = 32
IMAGE_SIZE = 128
BACKGROUND_COLOR = (0, 0, 0, 255)
MAX_LINE_WIDTH = 17

def load_image_from_url(url):
    r = requests.get(url)
    r.raise_for_status()
    return Image.open(BytesIO(r.content)).convert("RGBA")

def load_font(size):
    try:
        return ImageFont.truetype("undertaleFont.otf", size)
    except:
        return ImageFont.load_default()

def parse_color(value):
    if value is None:
        return (0, 0, 0, 0)
    value = value.strip().lstrip("#")
    if len(value) == 6:
        r = int(value[0:2], 16)
        g = int(value[2:4], 16)
        b = int(value[4:6], 16)
        return (r, g, b, 255)
    if len(value) == 8:
        r = int(value[0:2], 16)
        g = int(value[2:4], 16)
        b = int(value[4:6], 16)
        a = int(value[6:8], 16)
        return (r, g, b, a)
    return (0, 0, 0, 255)

def generate_motif_embed(obj, output_path):
    name = obj.get("name", "")
    color = parse_color(obj.get("color"))
    color2 = parse_color(obj.get("color2"))
    img_path = obj.get("image")

    embed = Image.new("RGBA", (EMBED_WIDTH, EMBED_HEIGHT), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(embed)

    draw.rectangle(
        (0, 0, EMBED_WIDTH - 1, EMBED_HEIGHT - 1),
        outline=color,
        width=BORDER_THICKNESS
    )

    overlay = Image.new("RGBA", (EMBED_WIDTH, EMBED_HEIGHT), color2)
    embed = Image.alpha_composite(embed, overlay)
    draw = ImageDraw.Draw(embed)

    font = load_font(NAME_FONT_SIZE)
    lines = wrap(name, width=MAX_LINE_WIDTH)
    y_text = PADDING
    for line in lines:
        x, y, text_w, text_h = draw.textbbox((0, 0), text=line, font=font)
        x_text = (EMBED_WIDTH - text_w) // 2
        draw.text((x_text, y_text), line, fill=(255, 255, 255, 255), font=font)
        y_text += text_h + 4

    if img_path:
        try:
            motif_img = load_image_from_url(img_path)
            motif_img.thumbnail((IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.NEAREST)
            img_x = (EMBED_WIDTH - motif_img.width) // 2
            img_y = (((EMBED_HEIGHT - BORDER_THICKNESS) + y_text) // 2) - (IMAGE_SIZE // 2)
            embed.alpha_composite(motif_img, (img_x, img_y))
        except:
            pass

    embed.save(output_path)

def gradient_diagonal(width, height, c1, c2):
    img = Image.new("RGBA", (width, height))
    px = img.load()
    for y in range(height):
        for x in range(width):
            t = (x + y) / (width + height)
            r = int(c1[0] * (1 - t) + c2[0] * t)
            g = int(c1[1] * (1 - t) + c2[1] * t)
            b = int(c1[2] * (1 - t) + c2[2] * t)
            a = int(c1[3] * (1 - t) + c2[3] * t)
            px[x, y] = (r, g, b, a)
    return img

def generate_song_embed(song_obj, output_path):
    name = song_obj.get("name", "")
    motif_ids = song_obj.get("mainMotifs", [])

    first = motif_ids[0] if motif_ids else None
    second = motif_ids[1] if len(motif_ids) > 1 else first

    # If first and second are the same, treat as single motif
    if first and second and first["id"] == second["id"]:
        second = None

    embed = Image.new("RGBA", (EMBED_WIDTH, EMBED_HEIGHT), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(embed)

    # Background gradient or overlay
    if first and second:
        c1 = parse_color(first.get("color2"))
        c2 = parse_color(second.get("color2"))
        gradient = gradient_diagonal(EMBED_WIDTH, EMBED_HEIGHT, c1, c2)
        embed = Image.alpha_composite(embed, gradient)
    elif first:
        c2 = parse_color(first.get("color2"))
        overlay = Image.new("RGBA", (EMBED_WIDTH, EMBED_HEIGHT), c2)
        embed = Image.alpha_composite(embed, overlay)

    draw = ImageDraw.Draw(embed)

    # Borders
    if first and second:
        c1 = parse_color(first.get("color"))
        c2 = parse_color(second.get("color"))
        t = BORDER_THICKNESS
        draw.rectangle((0, 0, EMBED_WIDTH, t), fill=c1)                   # top
        draw.rectangle((0, 0, t, EMBED_HEIGHT), fill=c1)                  # left
        draw.rectangle((0, EMBED_HEIGHT - t, EMBED_WIDTH, EMBED_HEIGHT), fill=c2)  # bottom
        draw.rectangle((EMBED_WIDTH - t, 0, EMBED_WIDTH, EMBED_HEIGHT), fill=c2)   # right
    elif first:
        c = parse_color(first.get("color"))
        draw.rectangle((0, 0, EMBED_WIDTH, EMBED_HEIGHT), outline=c, width=BORDER_THICKNESS)

    # Centered, wrapped song name
    font = load_font(NAME_FONT_SIZE)
    lines = wrap(name, width=MAX_LINE_WIDTH)
    y_text = PADDING
    for line in lines:
        x, y, text_w, text_h = draw.textbbox((0, 0), text=line, font=font)
        x_text = (EMBED_WIDTH - text_w) // 2
        draw.text((x_text, y_text), line, fill=(255, 255, 255, 255), font=font)
        y_text += text_h + 4

    # Prepare motif images
    images = []
    for motif in filter(None, [first, second]):
        path = motif.get("image")
        if path:
            try:
                if path.startswith("http://") or path.startswith("https://"):
                    m = load_image_from_url(path)
                else:
                    m = Image.open(path).convert("RGBA")
                m.thumbnail((IMAGE_SIZE, IMAGE_SIZE), Image.Resampling.NEAREST)
                images.append(m)
            except:
                pass

    # Center motif images under song name
    if images:
        total_width = IMAGE_SIZE if len(images) == 1 else (IMAGE_SIZE * (len(images) + 1)) + PADDING * (len(images))
        x_start = (EMBED_WIDTH - total_width) // 2
        y_img = (((EMBED_HEIGHT - BORDER_THICKNESS) + y_text) // 2) - (IMAGE_SIZE // 2)
        for img in images:
            embed.alpha_composite(img, (x_start, y_img))
            x_start += (img.width + PADDING) * 2

    embed.save(output_path)

def clean_subdirectories(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        return

    for name in os.listdir(directory):
        full_path = os.path.join(directory, name)
        if os.path.isdir(full_path):
            shutil.rmtree(full_path)

def build_from_json(json_path, base_dir, template_file, da_type):
    with open(json_path, "r", encoding="utf-8") as f:
        objects = json.load(f)

    by_id = {}
    for obj in objects:
        if obj["id"] not in by_id:
            by_id[obj["id"]] = obj

    clean_subdirectories(base_dir)

    with open(template_file, "r", encoding="utf-8") as f:
        template_content = f.read()

    for id_val, obj in by_id.items():
        folder_path = os.path.join(base_dir, str(id_val))
        os.makedirs(folder_path, exist_ok=True)

        replaced = template_content.replace("{id}", str(obj["id"]))
        replaced = replaced.replace("{name}", str(obj.get("name", "")))

        dest_file = os.path.join(folder_path, "index.html")
        with open(dest_file, "w", encoding="utf-8") as out:
            out.write(replaced)

        print(f"Created folder: {folder_path}")

        embed_path = os.path.join(folder_path, "embed.png")

        if da_type == "motif":
            generate_motif_embed(obj, embed_path)
        else:
            generate_song_embed(obj, embed_path)


if __name__ == "__main__":
    build_from_json("./songs.json", "./songs", "./songs/template.html", "song")
    build_from_json("./motifs.json", "./motifs", "./motifs/template.html", "motif")
