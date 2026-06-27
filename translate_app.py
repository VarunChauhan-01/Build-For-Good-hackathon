import sys
import re

translations_file = r"c:\Users\Jatin\OneDrive\Desktop\jeevansetuaiproject\Sama-Social-Hackathon-project\src\utils\translations.ts"
app_file = r"c:\Users\Jatin\OneDrive\Desktop\jeevansetuaiproject\Sama-Social-Hackathon-project\src\App.tsx"

new_keys = {
    "en": {
        "appTopBanner": "Official Government Technology Initiative Sandbox Environment. 100% Secure.",
        "appLogoSubtitle": "Government employment ecosystem"
    },
    "hi": {
        "appTopBanner": "आधिकारिक सरकारी प्रौद्योगिकी पहल सैंडबॉक्स वातावरण। 100% सुरक्षित।",
        "appLogoSubtitle": "सरकारी रोजगार पारिस्थितिकी तंत्र"
    },
    "mr": {
        "appTopBanner": "अधिकृत सरकारी तंत्रज्ञान उपक्रम सँडबॉक्स वातावरण. १००% सुरक्षित.",
        "appLogoSubtitle": "सरकारी रोजगार परिसंस्था"
    }
}

for lang in ['pa', 'bn', 'ta', 'te', 'gu']:
    new_keys[lang] = {k: v for k, v in new_keys["en"].items()} 

with open(translations_file, "r", encoding="utf-8") as f:
    content = f.read()

for lang, keys_dict in new_keys.items():
    pattern = rf"({lang}:\s*{{)"
    inject_str = ""
    for k, v in keys_dict.items():
        v_escaped = v.replace("'", "\\'")
        inject_str += f"\n    {k}: '{v_escaped}',"
    content = re.sub(pattern, r"\1" + inject_str, content)

with open(translations_file, "w", encoding="utf-8") as f:
    f.write(content)

with open(app_file, "r", encoding="utf-8") as f:
    app_content = f.read()

app_content = app_content.replace(
    "Official Government Technology Initiative Sandbox Environment. 100% Secure.",
    "{t('appTopBanner')}"
)
app_content = app_content.replace(
    "Government employment ecosystem",
    "{t('appLogoSubtitle')}"
)

with open(app_file, "w", encoding="utf-8") as f:
    f.write(app_content)

print("Updated App.tsx and translations.ts")
