import fs from "fs"

// move this to db service
export const retrieveMachineSession = async (id: string) => {
  const data = await fs.promises.readFile("./src/data/machines.json", "utf8")
  const jsonified = JSON.parse(data)
  if (jsonified[id] == undefined) {
    throw Error("machine doesn't exist!")
  }
  return jsonified[id].id
}

export const writeMachineSession = async(userID: string, machine: any) => {
  console.log("machining")
  console.log(machine)
  const file = fs.readFileSync("./src/data/machines.json")
  const json = JSON.parse(file.toString())
  json[userID] = machine
  console.log("writing!")
  console.log(json)

  fs.promises.writeFile("./src/data/machines.json", JSON.stringify(json))
  console.log("written")
  return {data: "machine"}
}

export const buildMachineQuery = async(id: string) => {
  //read file service
  let query: machineQuery
  try {
    const machineID = await retrieveMachineSession(id)
    query = {
      method: "GET",
      machineID
    }
    console.log("query is", query)
    return query
    // return { method: "", machineID: "", config: {} }
  } catch(err) {
    query = {
      method: "POST",
      config: {
        image: "flyio/fastify-functions"
      }
    }
    return query
  }
}
