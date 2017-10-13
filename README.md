
# varnalab-notifier

```bash
node varnalab-notifier/bin/ \
  --config /path/to/config.json \
  --auth /path/to/auth.json \
  --events /path/to/events.json \
  --ids /path/to/ids.json \
  --env environment \
  --notify calendar,googlegroups,twitter
```

## config.json

```json
{
  "production": [
    {
      "notify": "calendar",
      "target": "lo0fh2tu3nu9vegm8ibf6hhtjg@group.calendar.google.com",
      "auth": "VarnaLab's Google Account",
      "location": "VarnaLab, ul. \"Pencho Slaveykov\" 50, 9000 Varna Center, Varna, Bulgaria"
    },
    {
      "notify": "calendar",
      "target": "itclubsbg@gmail.com",
      "auth": "ITClubsBG Calendar",
      "location": "VarnaLab, ul. \"Pencho Slaveykov\" 50, 9000 Varna Center, Varna, Bulgaria"
    },
    {
      "notify": "googlegroups",
      "target": "varna-lab@googlegroups.com",
      "auth": "VarnaLab's Google Account",
      "from": "VarnaLab <noreply@varnalab.org>"
    },
    {
      "notify": "twitter",
      "target": "varnalab",
      "auth": "VarnaLab's Twitter Account"
    }
  ]
}
```

## auth.json

```json
{
  "production": [
    {
      "provider": "google",
      "key": "",
      "secret": "",
      "users": [
        {
          "id": "VarnaLab's Google Account",
          "account": "varna.hack.lab@gmail.com",
          "scope": [
            "calendar",
            "gmail.send"
          ],
          "token": "",
          "refresh": "",
          "expires": 0
        },
        {
          "id": "ITClubsBG Calendar",
          "account": "itclubsbg@gmail.com",
          "scope": [
            "calendar"
          ],
          "token": "",
          "refresh": "",
          "expires": 0
        }
      ]
    },
    {
      "provider": "twitter",
      "key": "",
      "secret": "",
      "users": [
        {
          "id": "VarnaLab's Twitter Account",
          "account": "varnalab",
          "token": "",
          "secret": ""
        }
      ]
    }
  ]
}
```

## events.json

## ids.json
