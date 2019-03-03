Fan
------------------------------------------------------------------------------------
Represents a single fan which has fan-server and pin number on that specific server.
### List all Fans
#### Request
`GET /api/fan`
#### Response
- `200 OK` on success
```
{
    "cooling_unit_id": 1,
    "id": 1,
    "pin_number": 3,
    "server": {
        "id": 1,
        "url": "http://example.url"
    },
    "server_id": 1
}
```


Temperature Sensor
------------------------------------------------------------------------------------
Represents a single temperature sensor which has temperature-server and unique id.
### List all Temperature sensors
#### Request
`GET /api/temperature`
#### Response
- `200 OK` on success
```

{
    "device": {
        "cooling_unit_id": 1,
        "id": 1,
        "name": "TV"
    },
    "device_id": 1,
    "id": "123456789",
    "server": {
        "id": 1,
        "url": "http://example.url"
    },
    "server_id": 1
}

```


Device
------------------------------------------------------------------------------------
Represents a single device which has temperature sensor.
### List all Devices
#### Request
`GET /api/device`
#### Response
- `200 OK` on success
```
{
    "cooling_unit": {
        "id": 1,
        "name": "TV cabinet, right"
    },
    "cooling_unit_id": 1,
    "id": 1,
    "name": "TV",
    "temperature_sensor": {
        "device_id": 1,
        "id": "123456789",
        "server_id": 1
    }
}
```


Cooling Unit
------------------------------------------------------------------------------------
 Represents a set of devices and fans which form a whole unit to cool.
 For example single cabinet or case.
 
### List all Cooling Units
#### Request
`GET /api/coolingunit`
#### Response
- `200 OK` on success
```
{
    "id": 1,
    "name": "TV cabinet",
    "devices": [
        {
            "cooling_unit_id": 1,
            "id": 4,
            "name": "TV"
        },
        {
            "cooling_unit_id": 1,
            "id": 2,
            "name": "Apple TV"
        }
    ],
    "fans": [
        {
            "cooling_unit_id": 1,
            "id": 1,
            "pin_number": 3,
            "server_id": 1
        }
    ]
}
``` 

### Create new Cooling unit
#### Request
`POST /api/coolingunit`
```
{
    "name": "Random closet"
}
```
#### Response
- `200 OK` on success
```
{
    "devices": [],
    "fans": [],
    "id": 5,
    "name": "Random closet"
}
```

 ### Modify Cooling Unit
 #### Request
`PUT /api/coolingunit/<id>`
```
{
    "devices": [2, 6]
}
```
#### Response
- `200 OK` on success
- `400 Bad request` if malformatted or otherwise illegal request
```
{
    "fans": [],
    "id": 5,
    "name": "Random closet",
    "devices": [
        {
            "cooling_unit_id": 5,
            "id": 4,
            "name": "TV"
        }
    ]
}
```

### Remove Cooling Unit
#### Request
`DELETE /api/coolingunit/<id>`
#### Response
- `204 No Content` on success
- `404 Not Found` if id not found 


Remote Fan Server
------------------------------------------------------------------------------------
Represents server used to control fans. Single fan server usually has many fans.
### List all Fan Servers
#### Request
`GET /api/fanserver`
#### Response
- `200 OK` on success
```
{
    "id": 1,
    "url": "http://example.url",
    "fans": [
        {
            "cooling_unit_id": 1,
            "id": 1,
            "pin_number": 3,
            "server_id": 1
        },
        {
            "cooling_unit_id": 4,
            "id": 2,
            "pin_number": 9,
            "server_id": 1
        }
    ]
}
```

Remote Temperature Server
------------------------------------------------------------------------------------
Represents server used to retrieve temperatures.
Single temperature server usually has many temperature sensors.
### List all Fan Servers
#### Request
`GET /api/temperatureserver`
#### Response
- `200 OK` on success
```
{
    "url": "http://example.url",
    "id": 1,
    "sensors": [
        {
            "device_id": 1,
            "id": "123456789",
            "server_id": 1
        },
        {
            "device_id": null,
            "id": "1A2B3C4D5E",
            "server_id": 1
        }
    ]
}
```


Todo
--------------------------------------------------------------------------------
- Validate new Fan Servers
- Remove Device/Temperature sensor from cooling unit/device when assigning it to different one
- Different target temperatures to devices