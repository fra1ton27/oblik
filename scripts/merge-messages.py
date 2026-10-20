# Вспомогательный скрипт для разработки: глубоко сливает JSON-фрагмент в messages/<locale>.json
import json, sys, collections
def merge(a, b):
    for k, v in b.items():
        if isinstance(v, dict) and isinstance(a.get(k), dict):
            merge(a[k], v)
        else:
            a[k] = v
    return a
locale, fragment = sys.argv[1], sys.argv[2]
path = f'messages/{locale}.json'
data = json.load(open(path, encoding='utf-8'), object_pairs_hook=collections.OrderedDict)
frag = json.load(open(fragment, encoding='utf-8'), object_pairs_hook=collections.OrderedDict)
merge(data, frag)
open(path, 'w', encoding='utf-8', newline='\n').write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
print('merged', fragment, '->', path)
