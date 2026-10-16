// Data layer, Reads businesses from the businesses.json folder
// When data is migrated to an SQL file the API will be called here

const BUSINESSES_URL = "data/businesses.json"; //assign the business url to the folder we are fetching data from 

async function getBusinesses()
 {
  const response = await fetch(BUSINESSES_URL);
  if (!response.ok) {
    throw new Error("Failed to load businesses (" + response.status + ")");
  }

//this function will call the URL which is the businesses stored in the JSON folder if the task fails it will return an appropriate error
  return response.json();//return the response show businesses or error message 
}