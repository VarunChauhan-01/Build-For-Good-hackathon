import sys

translations_file = r"c:\Users\Jatin\OneDrive\Desktop\jeevansetuaiproject\Sama-Social-Hackathon-project\src\utils\translations.ts"

with open(translations_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

# We will modify the lines that contain 'fhMandiDesc:' and have broken text.
# Let's inspect each line.
# Line 876 is 1-indexed, so it is index 875.
# Let's write a general replacement based on language blocks if possible, or direct line replacements.

# Let's define the correct translations
correct_translations = {
    "pa": "ਹੇਠਾਂ ਸਥਾਨਕ ਮੰਡੀਆਂ ਦੇ ਪ੍ਰਮਾਣਿਤ ਦਰ ਹਨ।",
    "bn": "নিচে স্থানীয় মান্ডির যাচাইকৃত দাম দেওয়া হলো।",
    "ta": "கீழே உள்ளூர் சந்தைகளின் சரிபார்க்கப்பட்ட விலைகள் உள்ளன।",
    "te": "క్రింద స్థానిక మార్కెట్ల ధృవీకరించబడిన ధరలు ఉన్నాయి.",
    "gu": "નીચે સ્થાનિક બજારોના પ્રમાણિત દરો છે."
}

# We can search for the lines that look like:
# fhMandiDesc: '...'s verified grain and produce...
# and replace them.

changed = 0
for i in range(len(lines)):
    line = lines[i]
    if "fhMandiDesc:" in line and "s verified grain and produce rates compiled directly from local APMC Mandis" in line:
        # Determine the language based on the text or context
        # Or we can just find which language translation is inside the quotes
        for lang, trans in correct_translations.items():
            if trans in line:
                # Replace the line with the clean translation
                # Keep indentation
                indent = line[:line.find("fhMandiDesc:")]
                lines[i] = f"{indent}fhMandiDesc: '{trans}',\n"
                print(f"Fixed line {i+1} for {lang}")
                changed += 1
                break

if changed > 0:
    with open(translations_file, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Successfully fixed all broken syntax lines!")
else:
    print("No broken lines matched the criteria.")
