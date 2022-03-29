import requests

baseurl = "http://localhost:4000/v1/"

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYTY1NTIwNTlkYmFjYmIxYmNjMWJiNSIsInJvbGUiOiJzdGFmZiIsImNvbXBhbnlEZXRhaWxzIjoiNjFhNjU1MjA1OWRiYWNiYjFiY2MxYmIzIiwibWFuYWdlckRldGFpbHMiOiI2MWE2NTUyMDU5ZGJhY2JiMWJjYzFiYjQiLCJpYXQiOjE2MzgyOTA3MjJ9.4YukQzM-Bns4MzsADpVxPO7KngkIOSwZ357OZoe2PzQ"

tripID = "61a6560659dbacbb1bcc1bc5"

driverID = "61a6552059dbacbb1bcc1bb7"

def test():
    updatedTripStatus = requests.put(baseurl + "change-trip-status", data = {
    "token": token,
    "tripID": tripID,
    "status": "approved",
    "driversDetails": driverID
    })
    print(updatedTripStatus.text)

test()
