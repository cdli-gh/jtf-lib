# RESTAPI Docs Examples

Documentation for JTF-lib's endpoints to use from framewrok and through this app to get singnames and ATF/JTF.

Where full URLs are provided in responses they will be rendered as if service
is running on a Framework `http://127.0.0.1:2354/` or Host `http://localhost:3003/`.

## Open Endpoints

Open endpoints require no Authentication.

* [ATFLINE to Signnames](atflinetosignnames.md) : `POST /jtf-lib/api/getSignnamesATFLINE`

* [JTF to Signnames](jtftosignnames.md) : `POST /jtf-lib/api/getSignnamesJTF`

* [ATF to Signnames](atftosignnames.md) : `POST /jtf-lib/api/getSignnamesATF`
