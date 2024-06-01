import os
import json

def process_character(character_path):
    character_data = {"Costumes": 0, "Subdirectories": {}, "Files": []}

    for item in os.listdir(character_path):
        item_path = os.path.join(character_path, item)
        if os.path.isfile(item_path) and item.endswith('.png'):
            character_data["Files"].append(item)
        elif os.path.isdir(item_path):
            if item.lower().startswith("costume"):
                character_data["Costumes"] += 1
            else:
                subdir_data = {"Costumes": 0, "Files": []}
                for sub_root, sub_dirs, sub_files in os.walk(item_path):
                    subdir_name = os.path.basename(sub_root)
                    if subdir_name not in character_data["Subdirectories"]:
                        character_data["Subdirectories"][subdir_name] = {"Costumes": 0, "Files": []}
                    for sub_file in sub_files:
                        if sub_file.endswith('.png'):
                            character_data["Subdirectories"][subdir_name]["Files"].append(sub_file)
                    for sub_subdir in sub_dirs:
                        if sub_subdir.lower().startswith("costume"):
                            character_data["Subdirectories"][subdir_name]["Costumes"] += 1

    return character_data

def generate_character_json():
    characters = {}
    characters_path = "./characters"

    for character_name in os.listdir(characters_path):
        character_path = os.path.join(characters_path, character_name)
        if os.path.isdir(character_path):
            characters[character_name] = process_character(character_path)

    with open("characters.json", "w") as json_file:
        json.dump(characters, json_file, indent=4)

if __name__ == "__main__":
    generate_character_json()
