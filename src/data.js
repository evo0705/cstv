import X2JS from "x2js"
import axios from "axios"

export default class DataSource {

  static async parseResponseAndHandleErrors(response) {
    const x2js = new X2JS()
    // If not successful, throw JSON as response
    let responseStatusNumber = Number(response.status)
    if (responseStatusNumber >= 400 && responseStatusNumber <= 599) {
      throw x2js.xml2js(response)
    }

    // Parse response
    let json
    try {
      json = x2js.xml2js(response)
    } catch (err) {
      throw err
    }

    // Handle empty JSON with prejudice
    if (json === null) {
      throw new Error("No response", "no_response")
    }

    return json
  }

  static async fetchXmlInJson(url) {
    try {
      const response = await axios(`https://cors.now.sh/${url}`, {
        method:  "GET",
        headers: {
          "Accept": "text/xml",
          "Access-Control-Allow-Origin": "*"
        },
        mode:    "no-cors",
      })
      return await this.parseResponseAndHandleErrors(response.data)
    } catch (err) {
      throw err
    }
  }

}
