import os
import shutil

def make_folders_with_template(ids, base_dir, template_file):
    """
    Creates folders for each ID and copies a template HTML file into them.
    If a folder already exists, it will be deleted and recreated.

    Args:
        ids (list): A list of IDs (strings or numbers).
        base_dir (str): Path to the base directory where folders will be created.
        template_file (str): Path to the template HTML file to copy.
    """
    # Ensure base directory exists
    os.makedirs(base_dir, exist_ok=True)

    for id_val in ids:
        folder_path = os.path.join(base_dir, str(id_val))

        # Delete if it already exists
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)

        # Recreate folder
        os.makedirs(folder_path)

        # Destination file path
        dest_file = os.path.join(folder_path, os.path.basename(template_file))

        # Copy template
        shutil.copyfile(template_file, dest_file)

        print(f"Created folder: {folder_path} with {os.path.basename(template_file)}")

if (__name__ == "__main__"):
    make_folders_with_template("./songids.txt", "./songs", "./songs/template.html")
