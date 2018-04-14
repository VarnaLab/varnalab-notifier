
# varnalab-notifier

[![travis-ci]][travis] [![coveralls-status]][coveralls]

```bash
node varnalab-notifier/bin/cli.js \
  --auth      /path/to/auth.json \
  --targets   /path/to/targets.json \
  --events    /path/to/events.json \
  --ids       /path/to/ids.json \
  --env       environment \
  --notify    calendar,googlegroups,slack,twitter
```

## auth.json

```json
{
  "production": [
    {
      "app": {
        "id": "39756e31-4ee4-49fa-9df6-12284fa2ed20",
        "provider": "google",
        "name": "",
        "owner": "",
        "url": "",
        "key": "",
        "secret": "",
        "refresh": "https://accounts.google.com/o/oauth2/token"
      },
      "users": [
        {
          "id": "ce40dbf7-a519-488b-a817-84e0bc707c17",
          "account": "",
          "scope": [
            "calendar",
            "gmail.send"
          ],
          "token": "",
          "refresh": "",
          "expires": 1523279703510
        },
        {
          "id": "0aee86db-ea01-4c03-b1ad-2de2f0028f78",
          "account": "",
          "scope": [
            "calendar"
          ],
          "token": "",
          "refresh": "",
          "expires": 1523279703521
        }
      ]
    },
    {
      "app": {
        "id": "e8f1a920-a26c-466e-8538-9018c0f613c5",
        "provider": "twitter",
        "name": "",
        "owner": "",
        "url": "",
        "key": "",
        "secret": ""
      },
      "users": [
        {
          "id": "fd8f7527-e980-4ebb-a316-73955b910308",
          "account": "varnalab",
          "token": "",
          "secret": ""
        }
      ]
    }
  ]
}
```

## targets.json

```json
{
  "production": [
    {
      "id": "495f1581-b299-40ae-92ef-6649e4247153",
      "auth": "ce40dbf7-a519-488b-a817-84e0bc707c17",
      "name": "calendar",
      "url": "",
      "options": {
        "location": "VarnaLab, ul. \"Pencho Slaveykov\" 50, 9000 Varna Center, Varna, Bulgaria"
      }
    },
    {
      "id": "4173500f-8f2d-4705-acfd-882a35d6aa81",
      "auth": "0aee86db-ea01-4c03-b1ad-2de2f0028f78",
      "name": "calendar",
      "url": "",
      "options": {
        "location": "VarnaLab, ul. \"Pencho Slaveykov\" 50, 9000 Varna Center, Varna, Bulgaria"
      }
    },
    {
      "id": "dbf7bf60-cb11-4d8e-a2b0-a3c245e76157",
      "auth": "ce40dbf7-a519-488b-a817-84e0bc707c17",
      "name": "googlegroups",
      "url": "https://www.googleapis.com/gmail/v1/users/me/messages/send",
      "options": {
        "from": "VarnaLab <noreply@varnalab.org>",
        "to": ""
      }
    },
    {
      "id": "77d00ec9-2de7-4e3a-8093-c26c8d9d97b2",
      "name": "slack",
      "url": ""
    },
    {
      "id": "55e5167a-210f-47e8-9f61-5c869af36e8a",
      "name": "slack",
      "url": ""
    },
    {
      "id": "b563ee64-c937-4642-b93a-1d28203eff9c",
      "auth": "fd8f7527-e980-4ebb-a316-73955b910308",
      "name": "twitter",
      "url": "https://api.twitter.com/1.1/statuses/update.json"
    }
  ]
}
```

## events.json

```json
[
  {
    "id": "279858379218043",
    "name": "Rails Girls Varna Study Group",
    "description": "Поредната сбирка, на която ще решим и последните интересни задачи и започваме раотата с файлове.",
    "cover_desktop": "https://scontent.xx.fbcdn.net/v/t1.0-9/30531162_10216131483541683_2327689505201371390_n.jpg?_nc_cat=0&oh=922fd2eb593791f37a699561d7895ce6&oe=5B66BD41",
    "cover_mobile": "https://scontent.xx.fbcdn.net/v/t1.0-0/p320x320/30531162_10216131483541683_2327689505201371390_n.jpg?_nc_cat=0&oh=48411aa88bd88a84b17fda2d7afb1a7e&oe=5B5DF0F6",
    "start_time": "2018-04-11T19:45:00+0300",
    "end_time": "2018-04-11T21:45:00+0300",
    "updated_time": "2018-04-09T11:58:57+0000"
  }
]
```

## ids.json

```json
[
  "1772476899717149",
  "129396144458257",
  "282498435569265"
]
```


  [travis-ci]: https://img.shields.io/travis/VarnaLab/varnalab-notifier/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/VarnaLab/varnalab-notifier.svg?style=flat-square (Test Coverage - Coveralls)

  [travis]: https://travis-ci.org/VarnaLab/varnalab-notifier
  [coveralls]: https://coveralls.io/github/VarnaLab/varnalab-notifier
