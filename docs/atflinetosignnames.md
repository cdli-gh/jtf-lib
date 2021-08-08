**ATFLINE to Signnames**
----
This api will take ATFLINE and give Singnames Back.

* **URL**

    `/jtf-lib/api/getSignnamesATFLINE`

* **Method:**
    `POST` 
  
*  **URL Params**
    No URL params

* **Data Params**

    Message Body PayLoad
    `{"atf": "Single line of ATF DATA"}`

* **Success Response:**

  * **Code:** 200 
  * **Content:** `converted signnames`
 
* **Error Response:**

  * **Code:** 404 <br />
  * **Content:** Empty

* **Sample Call:**

  `axios.post('http://localhost:3003/jtf-lib/api/getSignnamesATFLINE',{
      "atf":"ma-ba2-da ba-ba3-du"
  })`  
 