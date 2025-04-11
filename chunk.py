import json
import math

# Input and output file paths
json_input_file = 'recipes.json'  

# Step 1: Read the JSON file
with open(json_input_file, 'r', encoding='utf-8') as jsonfile:
    data = json.load(jsonfile)

# Step 2: Calculate chunk size
total_items = len(data)
chunk_size = math.ceil(total_items / 130)

# Step 3: Split into 6 chunks and write to separate JSON files
for i in range(130):
    start_idx = i * chunk_size
    end_idx = min(start_idx + chunk_size, total_items)  
    chunk = data[start_idx:end_idx]

    # Write chunk to a new JSON file
    output_file = f"{output_prefix}{i}.json"
    with open(output_file, 'w', encoding='utf-8') as jsonfile:
        json.dump(chunk, jsonfile, indent=4, ensure_ascii=False)
    
    print(f"Wrote chunk {i} to {output_file} ({len(chunk)} items)")

print(f"Split {json_input_file} into 130 chunks")
