**JTF to Signnames**
----
This api will take whole ATF with PID and give Singnames Back.

* **URL**

    `/jtf-lib/api/getSignnamesATF`

* **Method:**
    `POST` 
  
*  **URL Params**
    No URL params

* **Data Params**

    Message Body PayLoad
    `{"atf": "ATF(make sure string is stringify)"}`

* **Success Response:**

  * **Code:** 200 
  * **Content:** `converted signnames from ATF`
 
* **Error Response:**

  * **Code:** 404 <br />
  * **Content:** Empty

* **Sample Call:**

  `axios.post('http://localhost:3003/jtf-lib/api/getSignnamesATF`,`{
         "atf": "&P142759 = AAICAB 1/1, pl. 047, 1911-486\n#atf: lang sux\n@tablet\n@obverse\n1. 1(gesz2) 2(u) 6(disz) sar 1(u) 5(disz) gin2 u2 sahar-ba\n2. kab2-ku5 a-u2-da-ta\n3. kab2-ku5 u2-du-{d}nin-a-ra-li-sze3\n4. 2(gesz2) 5(u) 9(disz) 2/3(disz) sar 5(disz) gin2 u2 sahar-ba\n5. kab2-ku5 ki-BAD-ta\n6. kab2-ku5# u3-sur tir-sze3\n7. 2(gesz2) 2(u) 6(disz) 5/6(disz) sar kin sahar\n8. i7 {d}nin-hur-sag-ka\n9. 4(u) 6(disz) 1/3(disz) sar kin sahar\n10. kin szuku-ra engar nu-banda3-gu4 u3 sza3-sahar\n11. e sa-dur2-ra a-sza3 {d}nin-hur-sag-ka\n@reverse\n1. 2(u) sar 1(u) gin2 kin sahar\n2. i7 u3-wa-ri-da\n3. 6(disz) 1/2(disz) sar kin sahar e sa-dur2-ra a-sza3 iszib-e-ne\n$ blank space\n4. szunigin 8(gesz2) 5(disz) 5/6(disz) sar kin\n5. sahar zi-ga\n6. ugula da-da\n7. mu an-sza-an{ki} ba-hul\n$ blank space\n",
  })`