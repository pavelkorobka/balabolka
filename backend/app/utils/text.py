import re

def tokenize(text: str):
    # Удаляем пунктуацию, приводим к нижнему регистру и разбиваем по пробелам
    return [word.lower() for word in re.findall(r"\b\w+\b", text)]
