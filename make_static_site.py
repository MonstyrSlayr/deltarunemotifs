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

    ids = {obj["id"] for obj in objects}

    clean_subdirectories(base_dir)

    for id_val in ids:
        folder_path = os.path.join(base_dir, str(id_val))
        os.makedirs(folder_path, exist_ok=True)

        dest_file = os.path.join(folder_path, "index.html")
        shutil.copyfile(template_file, dest_file)

        print(f"Created folder: {folder_path}")

if __name__ == "__main__":
    build_from_json("./songs.json", "./songs", "./songs/template.html")
    build_from_json("./motifs.json", "./motifs", "./motifs/template.html")
