
# varnalab-notifier

```bash
node varnalab-notifier/bin/ \
  --config /path/to/config.json \
  --auth /path/to/auth.json \
  --events /path/to/events.json \
  --ids /path/to/ids.json \
  --env environment \
  --notify googlegroups,twitter
```

## config.json

```json
{
  "production": {
    "googlegroups": {
      "name": "VarnaLab",
      "email": "varna-lab@googlegroups.com"
    }
  }
}
```

## auth.json

```json
{
  "production": {
    "google": {
      "app": {
        "key": "",
        "secret": ""
      },
      "user": {
        "token": "",
        "refresh": ""
      },
      "expires": 0
    },
    "twitter": {
      "app": {
        "key": "",
        "secret": ""
      },
      "user": {
        "token": "",
        "secret": ""
      }
    }
  }
}
```

## events.json

## ids.json
