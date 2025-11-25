import os
import shutil
import json

def clean_subdirectories(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)
        return

    for name in os.listdir(directory):
        full_path = os.path.join(directory, name)
        if os.path.isdir(full_path):
            shutil.rmtree(full_path)

def build_from_json(json_path, base_dir, template_file):
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

if __name__ == "__main__":
    build_from_json("./songs.json", "./songs", "./songs/template.html")
    build_from_json("./motifs.json", "./motifs", "./motifs/template.html")
