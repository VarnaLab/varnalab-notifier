
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
    "calendar": {
      "id": "lo0fh2tu3nu9vegm8ibf6hhtjg@group.calendar.google.com",
      "location": "VarnaLab, ul. \"Pencho Slaveykov\" 50, 9000 Varna Center, Varna, Bulgaria"
    },
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
