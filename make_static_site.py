import os
import shutil

def make_folders_with_template(ids_file, base_dir, template_file):
    """
    Creates folders for each ID read from a text file and copies a template HTML file into them.
    If a folder already exists, it will be deleted and recreated.

    Args:
        ids_file (str): Path to a text file containing IDs (one per line).
        base_dir (str): Path to the base directory where folders will be created.
        template_file (str): Path to the template HTML file to copy.
    """
    # Read IDs from file (strip whitespace, ignore empty lines)
    with open(ids_file, "r", encoding="utf-8") as f:
        ids = [line.strip() for line in f if line.strip()]

    # Ensure base directory exists
    os.makedirs(base_dir, exist_ok=True)

    for id_val in ids:
        folder_path = os.path.join(base_dir, str(id_val))

        # Delete if it already exists
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        # Recreate folder
        os.makedirs(folder_path)

        # Always save as index.html
        dest_file = os.path.join(folder_path, "index.html")

        # Copy template
        shutil.copyfile(template_file, dest_file)

        print(f"Created folder: {folder_path} with {os.path.basename(template_file)}")

if (__name__ == "__main__"):
    make_folders_with_template("./songids.txt", "./songs", "./songs/template.html")
    make_folders_with_template("./motifids.txt", "./motifs", "./motifs/template.html")
