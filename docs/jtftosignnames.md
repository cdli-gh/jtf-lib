**JTF to Signnames**
----
This api will take JTF object and give Singnames Back.

* **URL**

    `/jtf-lib/api/getSignnamesJTF`

* **Method:**
    `POST` 
  
*  **URL Params**
    No URL params

* **Data Params**

    Message Body PayLoad
    `{"jtf": jtf object}`

* **Success Response:**

  * **Code:** 200 
  * **Content:** `converted signnames from JTF`
 
* **Error Response:**

  * **Code:** 404 <br />
  * **Content:** Empty

* **Sample Call:**

  `axios.post('http://localhost:3003/jtf-lib/api/getSignnamesJTF',`{
      "jtf": `{
    "reference": "texts_selection.txt",
    "success": true,
    "errors": [],
    "warnings": [],
    "atf": "&P142759 = AAICAB 1/1, pl. 047, 1911-486\n#atf: lang sux\n@tablet\n@obverse\n1. 1(gesz2) 2(u) 6(disz) sar 1(u) 5(disz) gin2 u2 sahar-ba\n2. kab2-ku5 a-u2-da-ta\n3. kab2-ku5 u2-du-{d}nin-a-ra-li-sze3\n4. 2(gesz2) 5(u) 9(disz) 2/3(disz) sar 5(disz) gin2 u2 sahar-ba\n5. kab2-ku5 ki-BAD-ta\n6. kab2-ku5# u3-sur tir-sze3\n7. 2(gesz2) 2(u) 6(disz) 5/6(disz) sar kin sahar\n8. i7 {d}nin-hur-sag-ka\n9. 4(u) 6(disz) 1/3(disz) sar kin sahar\n10. kin szuku-ra engar nu-banda3-gu4 u3 sza3-sahar\n11. e sa-dur2-ra a-sza3 {d}n",
    "meta": {
        "name": "AAICAB 1/1, pl. 047, 1911-486",
        "p_number": "P142759"
    },
    "objects": [
        {
            "_class": "object",
            "type": "tablet",
            "children": [
                {
                    "_class": "surface",
                    "type": "obverse",
                    "children": [
                        {
                            "_class": "line",
                            "name": "1",
                            "children": []
                        }
                }   
        }
}                     
 ` })`  
 