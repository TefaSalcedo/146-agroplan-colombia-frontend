import json,sys
with open(sys.argv[1], encoding='utf-8') as f:
    data=json.load(f)
print('Endpoints:')
for p,methods in data['paths'].items():
    for m,spec in methods.items():
        print(f'  {m.upper()} {p}  tags={spec.get('tags',[])}')
print('Schemas:')
print(list(data['components']['schemas'].keys()))
